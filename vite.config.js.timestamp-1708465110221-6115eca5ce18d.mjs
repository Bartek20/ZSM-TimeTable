// vite.config.js
import Components from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/unplugin-auto-import/dist/vite.js";
import autoprefixer from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/autoprefixer/lib/autoprefixer.js";
import banner from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/vite-plugin-banner/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/vite/dist/node/index.js";
import vue from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// public/schoolData.js
var schoolData_default = {
  schoolShortName: "ZSM",
  schoolHomeURL: "https://zsm.resman.pl/",
  schoolTimeTableRootURL: "/plan_vulcan/",
  schoolLogoDescription: "Szkolne Logo Zespo\u0142u Szk\xF3\u0142 Mechanicznych w Rzeszowie"
};

// configs/vite.server.js
var proxyConfigure = (proxy, _options) => {
  const headings = {
    ERROR: "[PROXY] [ERROR]   ",
    REQUEST: "[PROXY] [REQUEST] ",
    RESPONSE: "[PROXY] [RESPONSE]"
  };
  proxy.on("error", (err, _req, _res) => {
    console.log(headings.ERROR, err);
  });
  proxy.on("proxyReq", (_proxyReq, req, _res) => {
    const method = "[" + req.method + "]".padEnd(5, " ");
    console.log(headings.REQUEST, method, req.url);
  });
  proxy.on("proxyRes", (proxyRes, req, _res) => {
    const code = "[" + proxyRes.statusCode + "]".padEnd(5, " ");
    console.log(headings.RESPONSE, code, req.url);
  });
};
function getProxy() {
  const proxy = {};
  console.log("Setting up PROXY for:", schoolData_default.schoolTimeTableRootURL);
  proxy[schoolData_default.schoolTimeTableRootURL] = {
    target: schoolData_default.schoolHomeURL,
    changeOrigin: true,
    secure: false,
    ws: true,
    configure: proxyConfigure
  };
  return proxy;
}
var vite_server_default = {
  proxy: getProxy()
};

// configs/vite.plugins.js
import fs from "fs";
function getNow() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(/* @__PURE__ */ new Date());
}
function getBanner(now2, file) {
  const filename = file.slice(0, file.lastIndexOf("-"));
  const extension = file.slice(file.lastIndexOf("."));
  const bannerTemplate = `
	Creator: Bart\u0142omiej Rado\u0144 (@Bartek20)
	File name: ${filename}${extension}
	Generated: ${now2}
	App name: ZSM TimeTable
`;
  return bannerTemplate;
}
function parseHTML() {
  return {
    name: "parseHTML",
    transformIndexHtml(html) {
      const htmlVariables = {
        schoolROOT: schoolData_default.schoolTimeTableRootURL
      };
      Object.keys(htmlVariables).forEach((key) => {
        const regex = new RegExp(`%${key}%`, "g");
        html = html.replace(regex, htmlVariables[key]);
      });
      return html;
    }
  };
}
function generateBrowserConfigXML() {
  const xmlTemplate = '<?xml version="1.0" encoding="utf-8"?><browserconfig><msapplication><tile><square70x70logo src="${root}assets/images/mstile-70x70.png"/><square150x150logo src="${root}assets/images/mstile-150x150.png"/><square310x310logo src="${root}assets/images/mstile-310x310.png"/><wide310x150logo src="${root}assets/images/mstile-310x150.png"/><TileColor>#da532c</TileColor></tile></msapplication></browserconfig>';
  let base2;
  return {
    name: "generateBrowserConfigXML",
    configResolved(config) {
      base2 = config.base;
    },
    async writeBundle(outputOptions, _) {
      const data = xmlTemplate.replace(/\$\{root\}/g, base2);
      try {
        fs.writeFileSync((outputOptions.dir || outputOptions.file) + "/browserconfig.xml", data, "utf-8");
      } catch (error) {
        console.error("B\u0142\u0105d podczas generowania browserconfig.xml:", error);
      }
    }
  };
}
function generateHTACCESS() {
  const htaccessTemplate = "<IfModule mod_rewrite.c>\n	RewriteEngine On\n\n{rule}\n\n	RewriteCond %{SERVER_PORT} 80\n	RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]\n\n	RewriteCond %{REQUEST_FILENAME} !-f\n	RewriteCond %{REQUEST_FILENAME} !-d\n	RewriteRule ^(.*)$ /index.html [QSA,L]\n</IfModule>";
  return {
    name: "generateHTACCESS",
    async writeBundle(outputOptions, _) {
      try {
        fs.writeFileSync((outputOptions.dir || outputOptions.file) + "/.htaccess.nonwww", htaccessTemplate.replace("{rule}", "	RewriteCond %{HTTP_HOST} ^www.(.*)$ [NC]\n	RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [R=301,L]"), "utf-8");
        fs.writeFileSync((outputOptions.dir || outputOptions.file) + "/.htaccess.www", htaccessTemplate.replace("{rule}", "	RewriteCond %{HTTP_HOST} !^www. [NC]\n	RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]"), "utf-8");
      } catch (error) {
        console.error("B\u0142\u0105d podczas generowania .htaccess:", error);
      }
    }
  };
}

// vite.config.js
import { VitePWA } from "file:///workspaces/ZSM%20TimeTable%20Remastered/node_modules/vite-plugin-pwa/dist/index.js";

// appConfigs.js
var appConfigs_default = {
  pwaName: "ZSM Plan Lekcji",
  pwaShortName: "ZSM Plan Lekcji",
  pwaDescription: "Aplikacja do przegl\u0105du planu lekcji w Zespole Szk\xF3\u0142 Mechanicznych w Rzeszowie"
};

// configs/vite.pwa.js
var timetableParts = [
  // CSS
  "css/lista.css",
  "css/plan.css",
  // Images
  "images/logo_min.JPG",
  "images/minus.gif",
  "images/plan_logo.gif",
  "images/plus.gif",
  "images/pusty.gif",
  // Scripts
  "scripts/plan.js",
  "scripts/powrot.js",
  // Index
  "index.html",
  // Lista
  "lista.html",
  // Plany
  "plany/[ons]{1}\\d+.html"
];
var timetableRegExp = new RegExp(timetableParts.join("|"));
var argvs = process.argv;
var args = [];
argvs.forEach((arg) => args.push(...arg.split("=")));
var baseIndex = args.indexOf("--base");
var base = baseIndex != -1 ? args[baseIndex + 1] : "/";
var BASE_URL = base ? base : "/";
var vite_pwa_default = {
  registerType: "autoUpdate",
  includeManifestIcons: false,
  workbox: {
    globPatterns: ["**/*.{js,css,png,svg,ico}", "index.html"],
    globIgnores: ["schoolData.js", "schoolData.template.js", "timetableData.js", "timetableData.template.js"],
    navigateFallback: `${BASE_URL}index.html`,
    navigateFallbackAllowlist: [/uczen/, /nauczyciel/],
    navigateFallbackDenylist: [timetableRegExp, /assets/],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: timetableRegExp,
        handler: "NetworkFirst",
        options: {
          cacheName: "timetables-data",
          networkTimeoutSeconds: 5,
          backgroundSync: {
            name: "timetables-data-bs",
            options: {
              maxRetentionTime: 24 * 60
            }
          },
          cacheableResponse: {
            statuses: [200]
          }
        }
      }
    ]
  },
  manifest: {
    start_url: "?PWA=true",
    name: appConfigs_default.pwaName,
    short_name: appConfigs_default.pwaShortName,
    description: appConfigs_default.pwaDescription,
    theme_color: "#ffffff",
    lang: "pl-PL",
    dir: "ltr",
    orientation: "portrait",
    icons: [
      {
        src: "assets/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "assets/images/android-chrome-256x256.png",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: "assets/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "assets/images/safari-pinned-tab.svg",
        type: "image/svg",
        purpose: "maskable"
      }
    ]
  }
};

// configs/vite.components.js
var components = {
  dirs: ["src/components"],
  extensions: ["vue"]
};
var imports = {
  include: [/\.js$/, /\.vue$/, /\.vue\?vue/, /\.json$/],
  imports: [
    "vue",
    "vue-router",
    "pinia",
    "@vueuse/core",
    {
      "@vueuse/router": ["useRouteParams"],
      "virtual:pwa-register": ["registerSW"],
      "@nozbe/microfuzz": [["default", "createFuzzySearch"]],
      axios: [["default", "axios"]],
      "string-to-color": [["default", "stc"]],
      "chroma-js": [["default", "chroma"]]
    }
  ],
  dirs: ["src/functions", "src/stores", "src/assets"],
  vueTemplate: true
};

// vite.config.js
var __vite_injected_original_dirname = "/workspaces/ZSM TimeTable Remastered";
var now = getNow();
var vite_config_default = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify("v2.0.0")
  },
  server: vite_server_default,
  preview: {
    port: 5173
  },
  plugins: [
    vue(),
    Components(components),
    AutoImport(imports),
    parseHTML(),
    generateBrowserConfigXML(),
    generateHTACCESS(),
    VitePWA(vite_pwa_default),
    banner((fileName) => getBanner(now, fileName))
  ],
  build: {
    minify: "terser",
    assetsInlineLimit: 10240,
    cssCodeSplit: false,
    rollupOptions: {}
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/media";@import "@/assets/variables";'
      }
    },
    postcss: {
      plugins: [autoprefixer({})]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "@bootstrap": path.resolve(__vite_injected_original_dirname, "node_modules/bootstrap/scss")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicHVibGljL3NjaG9vbERhdGEuanMiLCAiY29uZmlncy92aXRlLnNlcnZlci5qcyIsICJjb25maWdzL3ZpdGUucGx1Z2lucy5qcyIsICJhcHBDb25maWdzLmpzIiwgImNvbmZpZ3Mvdml0ZS5wd2EuanMiLCAiY29uZmlncy92aXRlLmNvbXBvbmVudHMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9aU00gVGltZVRhYmxlIFJlbWFzdGVyZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL1pTTSBUaW1lVGFibGUgUmVtYXN0ZXJlZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9aU00lMjBUaW1lVGFibGUlMjBSZW1hc3RlcmVkL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCBiYW5uZXIgZnJvbSAndml0ZS1wbHVnaW4tYmFubmVyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcblxuLy8gVml0ZSBDb25maWdzXG5pbXBvcnQgc2VydmVyIGZyb20gJy4vY29uZmlncy92aXRlLnNlcnZlcic7XG4vLyBWaXRlIFRyYW5zZm9ybSBwbHVnaW5zXG5pbXBvcnQgeyBnZXROb3csIGdldEJhbm5lciwgcGFyc2VIVE1MLCBnZW5lcmF0ZUJyb3dzZXJDb25maWdYTUwsIGdlbmVyYXRlSFRBQ0NFU1MgfSBmcm9tICcuL2NvbmZpZ3Mvdml0ZS5wbHVnaW5zJztcbi8vIFBXQSBDb25maWdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHB3YUNvbmZpZyBmcm9tICcuL2NvbmZpZ3Mvdml0ZS5wd2EnO1xuXG4vLyBBdXRvIEltcG9ydHNcbmltcG9ydCB7IGNvbXBvbmVudHMsIGltcG9ydHMgfSBmcm9tICcuL2NvbmZpZ3Mvdml0ZS5jb21wb25lbnRzJztcblxuY29uc3Qgbm93ID0gZ2V0Tm93KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdGRlZmluZToge1xuXHRcdF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkoJ3YyLjAuMCcpLFxuXHR9LFxuXHRzZXJ2ZXIsXG5cdHByZXZpZXc6IHtcblx0XHRwb3J0OiA1MTczLFxuXHR9LFxuXHRwbHVnaW5zOiBbXG5cdFx0dnVlKCksXG5cdFx0Q29tcG9uZW50cyhjb21wb25lbnRzKSxcblx0XHRBdXRvSW1wb3J0KGltcG9ydHMpLFxuXHRcdHBhcnNlSFRNTCgpLFxuXHRcdGdlbmVyYXRlQnJvd3NlckNvbmZpZ1hNTCgpLFxuXHRcdGdlbmVyYXRlSFRBQ0NFU1MoKSxcblx0XHRWaXRlUFdBKHB3YUNvbmZpZyksXG5cdFx0YmFubmVyKChmaWxlTmFtZSkgPT4gZ2V0QmFubmVyKG5vdywgZmlsZU5hbWUpKSxcblx0XSxcblx0YnVpbGQ6IHtcblx0XHRtaW5pZnk6ICd0ZXJzZXInLFxuXHRcdGFzc2V0c0lubGluZUxpbWl0OiAxMDI0MCxcblx0XHRjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuXHRcdHJvbGx1cE9wdGlvbnM6IHt9LFxuXHR9LFxuXHRjc3M6IHtcblx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG5cdFx0XHRzY3NzOiB7XG5cdFx0XHRcdGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIkAvYXNzZXRzL21lZGlhXCI7QGltcG9ydCBcIkAvYXNzZXRzL3ZhcmlhYmxlc1wiOycsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0cG9zdGNzczoge1xuXHRcdFx0cGx1Z2luczogW2F1dG9wcmVmaXhlcih7fSldLFxuXHRcdH0sXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG5cdFx0XHQnQGJvb3RzdHJhcCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvYm9vdHN0cmFwL3Njc3MnKSxcblx0XHR9LFxuXHR9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3Jrc3BhY2VzL1pTTSBUaW1lVGFibGUgUmVtYXN0ZXJlZC9wdWJsaWNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL1pTTSBUaW1lVGFibGUgUmVtYXN0ZXJlZC9wdWJsaWMvc2Nob29sRGF0YS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9aU00lMjBUaW1lVGFibGUlMjBSZW1hc3RlcmVkL3B1YmxpYy9zY2hvb2xEYXRhLmpzXCI7ZXhwb3J0IGRlZmF1bHQge1xuXHRzY2hvb2xTaG9ydE5hbWU6ICdaU00nLFxuXHRzY2hvb2xIb21lVVJMOiAnaHR0cHM6Ly96c20ucmVzbWFuLnBsLycsXG5cdHNjaG9vbFRpbWVUYWJsZVJvb3RVUkw6ICcvcGxhbl92dWxjYW4vJyxcblx0c2Nob29sTG9nb0Rlc2NyaXB0aW9uOiAnU3prb2xuZSBMb2dvIFplc3BvXHUwMTQydSBTemtcdTAwRjNcdTAxNDIgTWVjaGFuaWN6bnljaCB3IFJ6ZXN6b3dpZScsXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9aU00gVGltZVRhYmxlIFJlbWFzdGVyZWQvY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvWlNNIFRpbWVUYWJsZSBSZW1hc3RlcmVkL2NvbmZpZ3Mvdml0ZS5zZXJ2ZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvWlNNJTIwVGltZVRhYmxlJTIwUmVtYXN0ZXJlZC9jb25maWdzL3ZpdGUuc2VydmVyLmpzXCI7aW1wb3J0IHNjaG9vbERhdGEgZnJvbSAnLi4vcHVibGljL3NjaG9vbERhdGEnO1xuY29uc3QgcHJveHlDb25maWd1cmUgPSAocHJveHksIF9vcHRpb25zKSA9PiB7XG5cdGNvbnN0IGhlYWRpbmdzID0ge1xuXHRcdEVSUk9SOiAnW1BST1hZXSBbRVJST1JdICAgJyxcblx0XHRSRVFVRVNUOiAnW1BST1hZXSBbUkVRVUVTVF0gJyxcblx0XHRSRVNQT05TRTogJ1tQUk9YWV0gW1JFU1BPTlNFXScsXG5cdH07XG5cdHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcblx0XHRjb25zb2xlLmxvZyhoZWFkaW5ncy5FUlJPUiwgZXJyKTtcblx0fSk7XG5cdHByb3h5Lm9uKCdwcm94eVJlcScsIChfcHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xuXHRcdGNvbnN0IG1ldGhvZCA9ICdbJyArIHJlcS5tZXRob2QgKyAnXScucGFkRW5kKDUsICcgJyk7XG5cdFx0Y29uc29sZS5sb2coaGVhZGluZ3MuUkVRVUVTVCwgbWV0aG9kLCByZXEudXJsKTtcblx0fSk7XG5cdHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG5cdFx0Y29uc3QgY29kZSA9ICdbJyArIHByb3h5UmVzLnN0YXR1c0NvZGUgKyAnXScucGFkRW5kKDUsICcgJyk7XG5cdFx0Y29uc29sZS5sb2coaGVhZGluZ3MuUkVTUE9OU0UsIGNvZGUsIHJlcS51cmwpO1xuXHR9KTtcbn07XG5cbmZ1bmN0aW9uIGdldFByb3h5KCkge1xuXHRjb25zdCBwcm94eSA9IHt9O1xuXHRjb25zb2xlLmxvZygnU2V0dGluZyB1cCBQUk9YWSBmb3I6Jywgc2Nob29sRGF0YS5zY2hvb2xUaW1lVGFibGVSb290VVJMKTtcblx0cHJveHlbc2Nob29sRGF0YS5zY2hvb2xUaW1lVGFibGVSb290VVJMXSA9IHtcblx0XHR0YXJnZXQ6IHNjaG9vbERhdGEuc2Nob29sSG9tZVVSTCxcblx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXG5cdFx0c2VjdXJlOiBmYWxzZSxcblx0XHR3czogdHJ1ZSxcblx0XHRjb25maWd1cmU6IHByb3h5Q29uZmlndXJlLFxuXHR9O1xuXHRyZXR1cm4gcHJveHk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0cHJveHk6IGdldFByb3h5KCksXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9aU00gVGltZVRhYmxlIFJlbWFzdGVyZWQvY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvWlNNIFRpbWVUYWJsZSBSZW1hc3RlcmVkL2NvbmZpZ3Mvdml0ZS5wbHVnaW5zLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL1pTTSUyMFRpbWVUYWJsZSUyMFJlbWFzdGVyZWQvY29uZmlncy92aXRlLnBsdWdpbnMuanNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHNjaG9vbERhdGEgZnJvbSAnLi4vcHVibGljL3NjaG9vbERhdGEnO1xuXG4vLyBVdGlsc1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vdygpIHtcblx0cmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdlbi1VUycsIHtcblx0XHR0aW1lWm9uZTogJ0V1cm9wZS9XYXJzYXcnLFxuXHRcdHdlZWtkYXk6ICdsb25nJyxcblx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0bW9udGg6ICdsb25nJyxcblx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0bWludXRlOiAnMi1kaWdpdCcsXG5cdFx0c2Vjb25kOiAnMi1kaWdpdCcsXG5cdH0pLmZvcm1hdChuZXcgRGF0ZSgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9icyhwYXR0ZXJuKSB7XG5cdHJldHVybiBnbG9iLnN5bmMocGF0dGVybik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFubmVyKG5vdywgZmlsZSkge1xuXHRjb25zdCBmaWxlbmFtZSA9IGZpbGUuc2xpY2UoMCwgZmlsZS5sYXN0SW5kZXhPZignLScpKTtcblx0Y29uc3QgZXh0ZW5zaW9uID0gZmlsZS5zbGljZShmaWxlLmxhc3RJbmRleE9mKCcuJykpO1xuXHRjb25zdCBiYW5uZXJUZW1wbGF0ZSA9IGBcXG5cXHRDcmVhdG9yOiBCYXJ0XHUwMTQyb21pZWogUmFkb1x1MDE0NCAoQEJhcnRlazIwKVxcblxcdEZpbGUgbmFtZTogJHtmaWxlbmFtZX0ke2V4dGVuc2lvbn1cXG5cXHRHZW5lcmF0ZWQ6ICR7bm93fVxcblxcdEFwcCBuYW1lOiBaU00gVGltZVRhYmxlXFxuYDtcblx0cmV0dXJuIGJhbm5lclRlbXBsYXRlO1xufVxuXG4vLyBQbHVnaW5zXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VIVE1MKCkge1xuXHRyZXR1cm4ge1xuXHRcdG5hbWU6ICdwYXJzZUhUTUwnLFxuXHRcdHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XG5cdFx0XHRjb25zdCBodG1sVmFyaWFibGVzID0ge1xuXHRcdFx0XHRzY2hvb2xST09UOiBzY2hvb2xEYXRhLnNjaG9vbFRpbWVUYWJsZVJvb3RVUkwsXG5cdFx0XHR9O1xuXHRcdFx0T2JqZWN0LmtleXMoaHRtbFZhcmlhYmxlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgJSR7a2V5fSVgLCAnZycpO1xuXHRcdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlKHJlZ2V4LCBodG1sVmFyaWFibGVzW2tleV0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaHRtbDtcblx0XHR9LFxuXHR9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQnJvd3NlckNvbmZpZ1hNTCgpIHtcblx0Y29uc3QgeG1sVGVtcGxhdGUgPVxuXHQnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwidXRmLThcIj8+PGJyb3dzZXJjb25maWc+PG1zYXBwbGljYXRpb24+PHRpbGU+PHNxdWFyZTcweDcwbG9nbyBzcmM9XCIke3Jvb3R9YXNzZXRzL2ltYWdlcy9tc3RpbGUtNzB4NzAucG5nXCIvPjxzcXVhcmUxNTB4MTUwbG9nbyBzcmM9XCIke3Jvb3R9YXNzZXRzL2ltYWdlcy9tc3RpbGUtMTUweDE1MC5wbmdcIi8+PHNxdWFyZTMxMHgzMTBsb2dvIHNyYz1cIiR7cm9vdH1hc3NldHMvaW1hZ2VzL21zdGlsZS0zMTB4MzEwLnBuZ1wiLz48d2lkZTMxMHgxNTBsb2dvIHNyYz1cIiR7cm9vdH1hc3NldHMvaW1hZ2VzL21zdGlsZS0zMTB4MTUwLnBuZ1wiLz48VGlsZUNvbG9yPiNkYTUzMmM8L1RpbGVDb2xvcj48L3RpbGU+PC9tc2FwcGxpY2F0aW9uPjwvYnJvd3NlcmNvbmZpZz4nO1xuXHRsZXQgYmFzZTtcblx0cmV0dXJuIHtcblx0XHRuYW1lOiAnZ2VuZXJhdGVCcm93c2VyQ29uZmlnWE1MJyxcblx0XHRjb25maWdSZXNvbHZlZChjb25maWcpIHtcblx0XHRcdGJhc2UgPSBjb25maWcuYmFzZTtcblx0XHR9LFxuXHRcdGFzeW5jIHdyaXRlQnVuZGxlKG91dHB1dE9wdGlvbnMsIF8pIHtcblx0XHRcdGNvbnN0IGRhdGEgPSB4bWxUZW1wbGF0ZS5yZXBsYWNlKC9cXCRcXHtyb290XFx9L2csIGJhc2UpO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYygob3V0cHV0T3B0aW9ucy5kaXIgfHwgb3V0cHV0T3B0aW9ucy5maWxlKSArICcvYnJvd3NlcmNvbmZpZy54bWwnLCBkYXRhLCAndXRmLTgnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0JcdTAxNDJcdTAxMDVkIHBvZGN6YXMgZ2VuZXJvd2FuaWEgYnJvd3NlcmNvbmZpZy54bWw6JywgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVIVEFDQ0VTUygpIHtcblx0Y29uc3QgaHRhY2Nlc3NUZW1wbGF0ZSA9ICc8SWZNb2R1bGUgbW9kX3Jld3JpdGUuYz5cXG5cXHRSZXdyaXRlRW5naW5lIE9uXFxuXFxue3J1bGV9XFxuXFxuXFx0UmV3cml0ZUNvbmQgJXtTRVJWRVJfUE9SVH0gODBcXG5cXHRSZXdyaXRlUnVsZSBeKC4qKSQgaHR0cHM6Ly8le0hUVFBfSE9TVH0le1JFUVVFU1RfVVJJfSBbUj0zMDEsTF1cXG5cXG5cXHRSZXdyaXRlQ29uZCAle1JFUVVFU1RfRklMRU5BTUV9ICEtZlxcblxcdFJld3JpdGVDb25kICV7UkVRVUVTVF9GSUxFTkFNRX0gIS1kXFxuXFx0UmV3cml0ZVJ1bGUgXiguKikkIC9pbmRleC5odG1sIFtRU0EsTF1cXG48L0lmTW9kdWxlPidcblx0cmV0dXJuIHtcblx0XHRuYW1lOiAnZ2VuZXJhdGVIVEFDQ0VTUycsXG5cdFx0YXN5bmMgd3JpdGVCdW5kbGUob3V0cHV0T3B0aW9ucywgXykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYygob3V0cHV0T3B0aW9ucy5kaXIgfHwgb3V0cHV0T3B0aW9ucy5maWxlKSArICcvLmh0YWNjZXNzLm5vbnd3dycsIGh0YWNjZXNzVGVtcGxhdGUucmVwbGFjZSgne3J1bGV9JywgJ1xcdFJld3JpdGVDb25kICV7SFRUUF9IT1NUfSBed3d3LiguKikkIFtOQ11cXG5cXHRSZXdyaXRlUnVsZSBeKC4qKSQgaHR0cHM6Ly8lMSV7UkVRVUVTVF9VUkl9IFtSPTMwMSxMXScpLCAndXRmLTgnKTtcblx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYygob3V0cHV0T3B0aW9ucy5kaXIgfHwgb3V0cHV0T3B0aW9ucy5maWxlKSArICcvLmh0YWNjZXNzLnd3dycsIGh0YWNjZXNzVGVtcGxhdGUucmVwbGFjZSgne3J1bGV9JywgJ1xcdFJld3JpdGVDb25kICV7SFRUUF9IT1NUfSAhXnd3d1xcLiBbTkNdXFxuXFx0UmV3cml0ZVJ1bGUgXiguKikkIGh0dHBzOi8vd3d3LiV7SFRUUF9IT1NUfSV7UkVRVUVTVF9VUkl9IFtSPTMwMSxMXScpLCAndXRmLTgnKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0JcdTAxNDJcdTAxMDVkIHBvZGN6YXMgZ2VuZXJvd2FuaWEgLmh0YWNjZXNzOicsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9aU00gVGltZVRhYmxlIFJlbWFzdGVyZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL1pTTSBUaW1lVGFibGUgUmVtYXN0ZXJlZC9hcHBDb25maWdzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL1pTTSUyMFRpbWVUYWJsZSUyMFJlbWFzdGVyZWQvYXBwQ29uZmlncy5qc1wiO2V4cG9ydCBkZWZhdWx0IHtcblx0cHdhTmFtZTogJ1pTTSBQbGFuIExla2NqaScsXG5cdHB3YVNob3J0TmFtZTogJ1pTTSBQbGFuIExla2NqaScsXG5cdHB3YURlc2NyaXB0aW9uOiAnQXBsaWthY2phIGRvIHByemVnbFx1MDEwNWR1IHBsYW51IGxla2NqaSB3IFplc3BvbGUgU3prXHUwMEYzXHUwMTQyIE1lY2hhbmljem55Y2ggdyBSemVzem93aWUnLFxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvWlNNIFRpbWVUYWJsZSBSZW1hc3RlcmVkL2NvbmZpZ3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL1pTTSBUaW1lVGFibGUgUmVtYXN0ZXJlZC9jb25maWdzL3ZpdGUucHdhLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL1pTTSUyMFRpbWVUYWJsZSUyMFJlbWFzdGVyZWQvY29uZmlncy92aXRlLnB3YS5qc1wiO2ltcG9ydCBhcHBDb25maWdzIGZyb20gJy4uL2FwcENvbmZpZ3MnO1xuXG5jb25zdCB0aW1ldGFibGVQYXJ0cyA9IFtcblx0Ly8gQ1NTXG5cdCdjc3MvbGlzdGEuY3NzJyxcblx0J2Nzcy9wbGFuLmNzcycsXG5cdC8vIEltYWdlc1xuXHQnaW1hZ2VzL2xvZ29fbWluLkpQRycsXG5cdCdpbWFnZXMvbWludXMuZ2lmJyxcblx0J2ltYWdlcy9wbGFuX2xvZ28uZ2lmJyxcblx0J2ltYWdlcy9wbHVzLmdpZicsXG5cdCdpbWFnZXMvcHVzdHkuZ2lmJyxcblx0Ly8gU2NyaXB0c1xuXHQnc2NyaXB0cy9wbGFuLmpzJyxcblx0J3NjcmlwdHMvcG93cm90LmpzJyxcblx0Ly8gSW5kZXhcblx0J2luZGV4Lmh0bWwnLFxuXHQvLyBMaXN0YVxuXHQnbGlzdGEuaHRtbCcsXG5cdC8vIFBsYW55XG5cdCdwbGFueS9bb25zXXsxfVxcXFxkKy5odG1sJyxcbl07XG5jb25zdCB0aW1ldGFibGVSZWdFeHAgPSBuZXcgUmVnRXhwKHRpbWV0YWJsZVBhcnRzLmpvaW4oJ3wnKSk7XG5cbmNvbnN0IGFyZ3ZzID0gcHJvY2Vzcy5hcmd2O1xuY29uc3QgYXJncyA9IFtdO1xuYXJndnMuZm9yRWFjaCgoYXJnKSA9PiBhcmdzLnB1c2goLi4uYXJnLnNwbGl0KCc9JykpKTtcbmNvbnN0IGJhc2VJbmRleCA9IGFyZ3MuaW5kZXhPZignLS1iYXNlJyk7XG5jb25zdCBiYXNlID0gYmFzZUluZGV4ICE9IC0xID8gYXJnc1tiYXNlSW5kZXggKyAxXSA6ICcvJztcbmNvbnN0IEJBU0VfVVJMID0gYmFzZSA/IGJhc2UgOiAnLyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG5cdGluY2x1ZGVNYW5pZmVzdEljb25zOiBmYWxzZSxcblx0d29ya2JveDoge1xuXHRcdGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MscG5nLHN2ZyxpY299JywgJ2luZGV4Lmh0bWwnXSxcblx0XHRnbG9iSWdub3JlczogWydzY2hvb2xEYXRhLmpzJywgJ3NjaG9vbERhdGEudGVtcGxhdGUuanMnLCAndGltZXRhYmxlRGF0YS5qcycsICd0aW1ldGFibGVEYXRhLnRlbXBsYXRlLmpzJ10sXG5cdFx0bmF2aWdhdGVGYWxsYmFjazogYCR7QkFTRV9VUkx9aW5kZXguaHRtbGAsXG5cdFx0bmF2aWdhdGVGYWxsYmFja0FsbG93bGlzdDogWy91Y3plbi8sIC9uYXVjenljaWVsL10sXG5cdFx0bmF2aWdhdGVGYWxsYmFja0RlbnlsaXN0OiBbdGltZXRhYmxlUmVnRXhwLCAvYXNzZXRzL10sXG5cdFx0cnVudGltZUNhY2hpbmc6IFtcblx0XHRcdHtcblx0XHRcdFx0dXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuXHRcdFx0XHRoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjYWNoZU5hbWU6ICdnb29nbGUtZm9udHMtY2FjaGUnLFxuXHRcdFx0XHRcdGV4cGlyYXRpb246IHtcblx0XHRcdFx0XHRcdG1heEVudHJpZXM6IDEwLFxuXHRcdFx0XHRcdFx0bWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2FjaGVhYmxlUmVzcG9uc2U6IHtcblx0XHRcdFx0XHRcdHN0YXR1c2VzOiBbMCwgMjAwXSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0dXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb21cXC8uKi9pLFxuXHRcdFx0XHRoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjYWNoZU5hbWU6ICdnc3RhdGljLWZvbnRzLWNhY2hlJyxcblx0XHRcdFx0XHRleHBpcmF0aW9uOiB7XG5cdFx0XHRcdFx0XHRtYXhFbnRyaWVzOiAxMCxcblx0XHRcdFx0XHRcdG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNhY2hlYWJsZVJlc3BvbnNlOiB7XG5cdFx0XHRcdFx0XHRzdGF0dXNlczogWzAsIDIwMF0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHVybFBhdHRlcm46IHRpbWV0YWJsZVJlZ0V4cCxcblx0XHRcdFx0aGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjYWNoZU5hbWU6ICd0aW1ldGFibGVzLWRhdGEnLFxuXHRcdFx0XHRcdG5ldHdvcmtUaW1lb3V0U2Vjb25kczogNSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU3luYzoge1xuXHRcdFx0XHRcdFx0bmFtZTogJ3RpbWV0YWJsZXMtZGF0YS1icycsXG5cdFx0XHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdG1heFJldGVudGlvblRpbWU6IDI0ICogNjAsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y2FjaGVhYmxlUmVzcG9uc2U6IHtcblx0XHRcdFx0XHRcdHN0YXR1c2VzOiBbMjAwXSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRdLFxuXHR9LFxuXHRtYW5pZmVzdDoge1xuXHRcdHN0YXJ0X3VybDogJz9QV0E9dHJ1ZScsXG5cdFx0bmFtZTogYXBwQ29uZmlncy5wd2FOYW1lLFxuXHRcdHNob3J0X25hbWU6IGFwcENvbmZpZ3MucHdhU2hvcnROYW1lLFxuXHRcdGRlc2NyaXB0aW9uOiBhcHBDb25maWdzLnB3YURlc2NyaXB0aW9uLFxuXHRcdHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG5cdFx0bGFuZzogJ3BsLVBMJyxcblx0XHRkaXI6ICdsdHInLFxuXHRcdG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuXHRcdGljb25zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHNyYzogJ2Fzc2V0cy9pbWFnZXMvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxuXHRcdFx0XHRzaXplczogJzE5MngxOTInLFxuXHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNyYzogJ2Fzc2V0cy9pbWFnZXMvYW5kcm9pZC1jaHJvbWUtMjU2eDI1Ni5wbmcnLFxuXHRcdFx0XHRzaXplczogJzI1NngyNTYnLFxuXHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNyYzogJ2Fzc2V0cy9pbWFnZXMvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxuXHRcdFx0XHRzaXplczogJzUxMng1MTInLFxuXHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNyYzogJ2Fzc2V0cy9pbWFnZXMvc2FmYXJpLXBpbm5lZC10YWIuc3ZnJyxcblx0XHRcdFx0dHlwZTogJ2ltYWdlL3N2ZycsXG5cdFx0XHRcdHB1cnBvc2U6ICdtYXNrYWJsZScsXG5cdFx0XHR9LFxuXHRcdF0sXG5cdH0sXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9aU00gVGltZVRhYmxlIFJlbWFzdGVyZWQvY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvWlNNIFRpbWVUYWJsZSBSZW1hc3RlcmVkL2NvbmZpZ3Mvdml0ZS5jb21wb25lbnRzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL1pTTSUyMFRpbWVUYWJsZSUyMFJlbWFzdGVyZWQvY29uZmlncy92aXRlLmNvbXBvbmVudHMuanNcIjtjb25zdCBjb21wb25lbnRzID0ge1xuXHRkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXG5cdGV4dGVuc2lvbnM6IFsndnVlJ10sXG59O1xuY29uc3QgaW1wb3J0cyA9IHtcblx0aW5jbHVkZTogWy9cXC5qcyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwuanNvbiQvXSxcblx0aW1wb3J0czogW1xuXHRcdCd2dWUnLFxuXHRcdCd2dWUtcm91dGVyJyxcblx0XHQncGluaWEnLFxuXHRcdCdAdnVldXNlL2NvcmUnLFxuXHRcdHtcblx0XHRcdCdAdnVldXNlL3JvdXRlcic6IFsndXNlUm91dGVQYXJhbXMnXSxcblx0XHRcdCd2aXJ0dWFsOnB3YS1yZWdpc3Rlcic6IFsncmVnaXN0ZXJTVyddLFxuXHRcdFx0J0Bub3piZS9taWNyb2Z1enonOiBbWydkZWZhdWx0JywgJ2NyZWF0ZUZ1enp5U2VhcmNoJ11dLFxuXHRcdFx0YXhpb3M6IFtbJ2RlZmF1bHQnLCAnYXhpb3MnXV0sXG5cdFx0XHQnc3RyaW5nLXRvLWNvbG9yJzogW1snZGVmYXVsdCcsICdzdGMnXV0sXG5cdFx0XHQnY2hyb21hLWpzJzogW1snZGVmYXVsdCcsICdjaHJvbWEnXV0sXG5cdFx0fSxcblx0XSxcblx0ZGlyczogWydzcmMvZnVuY3Rpb25zJywgJ3NyYy9zdG9yZXMnLCAnc3JjL2Fzc2V0cyddLFxuXHR2dWVUZW1wbGF0ZTogdHJ1ZSxcbn07XG5leHBvcnQgeyBjb21wb25lbnRzLCBpbXBvcnRzIH07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtTLE9BQU8sZ0JBQWdCO0FBQ3pULE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFFakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTOzs7QUNQcVMsSUFBTyxxQkFBUTtBQUFBLEVBQ25VLGlCQUFpQjtBQUFBLEVBQ2pCLGVBQWU7QUFBQSxFQUNmLHdCQUF3QjtBQUFBLEVBQ3hCLHVCQUF1QjtBQUN4Qjs7O0FDSkEsSUFBTSxpQkFBaUIsQ0FBQyxPQUFPLGFBQWE7QUFDM0MsUUFBTSxXQUFXO0FBQUEsSUFDaEIsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLEVBQ1g7QUFDQSxRQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ3RDLFlBQVEsSUFBSSxTQUFTLE9BQU8sR0FBRztBQUFBLEVBQ2hDLENBQUM7QUFDRCxRQUFNLEdBQUcsWUFBWSxDQUFDLFdBQVcsS0FBSyxTQUFTO0FBQzlDLFVBQU0sU0FBUyxNQUFNLElBQUksU0FBUyxJQUFJLE9BQU8sR0FBRyxHQUFHO0FBQ25ELFlBQVEsSUFBSSxTQUFTLFNBQVMsUUFBUSxJQUFJLEdBQUc7QUFBQSxFQUM5QyxDQUFDO0FBQ0QsUUFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM3QyxVQUFNLE9BQU8sTUFBTSxTQUFTLGFBQWEsSUFBSSxPQUFPLEdBQUcsR0FBRztBQUMxRCxZQUFRLElBQUksU0FBUyxVQUFVLE1BQU0sSUFBSSxHQUFHO0FBQUEsRUFDN0MsQ0FBQztBQUNGO0FBRUEsU0FBUyxXQUFXO0FBQ25CLFFBQU0s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
