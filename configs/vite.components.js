const components = {
  dirs: ["src/components"],
  extensions: ["vue"],
};
const imports = {
  include: [/\.js$/, /\.vue$/, /\.vue\?vue/, /\.json$/],
  imports: [
    "vue",
    "vue-router",
    "@vueuse/core",
    {
      "@vueuse/router": ["useRouteParams"],
      "virtual:pwa-register": ["registerSW"],
      "@nozbe/microfuzz": [["default", "createFuzzySearch"]],
      axios: [["default", "axios"]],
      "string-to-color": [["default", "stc"]],
      "chroma-js": [["default", "chroma"]],
    },
  ],
  dirs: ["src/functions", "src/stores", "src/assets"],
  vueTemplate: true,
};
export { components, imports };
