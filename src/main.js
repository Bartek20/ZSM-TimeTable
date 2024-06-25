// Floating tooltip css
import "floating-vue/dist/style.css";
// Toast css
import "../node_modules/vue-toastification/dist/index.css";
// App css
import "./assets/main.scss";

import { createApp } from "vue";
import { vTooltip } from "floating-vue";
import Toast, { useToast } from "vue-toastification";

import App from "./App.vue";
import router from "./router";

import appConfigs from "@/stores/configs";
import appPWA from "@/stores/pwa";
import log from "@/functions/logger";
import validateApp from "@/functions/appVersionControl";
import colorHandler from "@/functions/colorModeHandler";
import parseData from "@/functions/timetableDataHandler";

import {
  init as Sentry_init,
  browserTracingIntegration as Sentry_browserTracingIntegration,
  replayIntegration as Sentry_replayIntegration,
} from "@sentry/vue";

const app = createApp(App);

// Sentry Error Reporting
if (__SENTRY_DSN__) {
  Sentry_init({
    // Sentry config
    dsn: __SENTRY_DSN__,
    normalizeDepth: 10,
    tunnel: window.localStorage.getItem("isAd-Blocker")
      ? "https://sentry.tata2676.workers.dev/"
      : undefined,
    integrations: [
      Sentry_browserTracingIntegration({ router }),
      Sentry_replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1,
    tracePropagationTargets: [/^(?!.*cloudflareinsights\.com).*/],
    tracePropagationTargets: [/^(?!.*cloudflareinsights\.com).*/],
    // Session Replay
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    // Vue settings
    app,
    trackComponents: true,
    // App settings
    initialScope: (scope) => {
      const data = JSON.parse(localStorage.getItem("appConfigs"));
      scope.setTag("appVersion", __APP_VERSION__);
      scope.setContext("appConfigs", data);
      return scope;
    },
    beforeSend: (event, hint) => {
      const confs = JSON.stringify(
        JSON.parse(localStorage.getItem("appConfigs") ?? "{}"),
        null,
        "\t",
      );
      if (confs === "{}") return event;
      hint.attachments = [{ filename: "appConfigs.json", data: confs }];
      return event;
    },
  });
}

// Check custom css scrollbar support
function checkScrollStyllability() {
  const style = document.createElement("style");
  style.textContent = `
	.scrolltest {
		position: fixed;
		visibility: hidden;
		z-index: -1000;
		overflow: scroll;
		width: 100px;
		background: transparent;
		height: 100px;
		top: 0;
		left: 0;
	}
	.scrolltest::-webkit-scrollbar {
		width: 3px
	}
	.scrolltest::-webkit-scrollbar-track {
		background: red;
	}
	.scrolltest::-webkit-scrollbar-thumb {
		background: green;
	}`;
  const test = document.createElement("div");
  test.classList.add("scrolltest");
  document.head.appendChild(style);
  document.body.appendChild(test);
  if (test.clientWidth !== 97) {
    document.body.classList.add("notstyllablescroll");
  }
  if (test.clientWidth !== 97 && test.clientWidth !== 100) {
    document.body.classList.add("thinscroll");
  }
  log(
    "info",
    "[App] Test zakończony z wynikiem:\nCustomowy scrollbar: ",
    test.clientWidth !== 97
      ? test.clientWidth !== 100
        ? "Nie wspierany (Aktywny cienki scrollbar)"
        : "Nie wspierany (Aktywny normalny scrollbar)"
      : "Wspierany",
  );
  style.remove();
  test.remove();
}

// Set PWA eventlistener
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  appPWA.event.value = e;
  appPWA.installed.value = false;
});
window.addEventListener("appinstalled", () => {
  appPWA.event.value = undefined;
  appPWA.installed.value = true;
});
window.removeEventListener("beforeinstallprompt", window.installhandler);
if (window.installevent) {
  appPWA.event.value = window.installevent;
  appPWA.installed.value = false;
  window.installhandler = undefined;
  window.installevent = undefined;
}

// Service Worker, Timetable caching
let fetching = false;
async function cacheTimeTables() {
  if (!appConfigs.value.school.timetableURL) return;
  if (import.meta.env.MODE === "development") return;
  if (fetching) return;
  fetching = true;
  const last = appConfigs.value.lastFetched;
  if (last != null && last + 86400000 > Date.now()) return;
  log(
    "info",
    "[Service Worker] Rozpoczęto pobieranie planów do pamięci cache.",
  );
  try {
    const res = await axios.get(
      `${appConfigs.value.school.timetableURL}lista.html`,
    );
    const list = new TimeTableList(res.data).getList();
    const classMap = list.classes.map((obj) =>
      axios
        .get(`${appConfigs.value.school.timetableURL}plany/o${obj.value}.html`)
        .catch(() => undefined),
    );
    const teacherMap = list.teachers.map((obj) =>
      axios
        .get(`${appConfigs.value.school.timetableURL}plany/n${obj.value}.html`)
        .catch(() => undefined),
    );
    const roomMap = list.rooms.map((obj) =>
      axios
        .get(`${appConfigs.value.school.timetableURL}plany/s${obj.value}.html`)
        .catch(() => undefined),
    );
    await Promise.all([...classMap, ...teacherMap, ...roomMap]);
    log(
      "info",
      "[Service Worker] Zakończono pobieranie planów do pamięci cache.",
    );
    appConfigs.value.lastFetched = Date.now();
    fetching = false;
  } catch (e) {
    log(
      "error",
      "[Service Worker] Wystąpił błąd przy zapisywaniu planów do pamięci cache:\n",
      e,
    );
    fetching = false;
  }
}
registerSW({
  immediate: true,
  onNeedRefresh() {
    log("info", "[Service Worker] Aplikacja oczekuje na odświeżenie strony.");
  },
  onOfflineReady() {
    log("info", "[Service Worker] Aplikacja jest gotowa do pracy offline.");
  },
  async onRegisteredSW(_, SW) {
    log("info", "[Service Worker] Zainstalowano Service Workera.");
    // Waiting for Service Worker to install
    await new Promise((resolve) => {
      const checkStatus = () => {
        if (SW.active) resolve();
        else setTimeout(checkStatus, 100);
      };
      checkStatus();
    });
    // Service Worker Installed working
    log("info", "[Service Worker] Service Worker został aktywowany.");
    await validateApp();
    cacheTimeTables();
    // Service Worker update detection and handle
    setInterval(async () => {
      try {
        const res = await axios.get(import.meta.env.BASE_URL + "sw.js");
        if (res.status === 200) SW.update();
      } catch (e) {
        log(
          "error",
          "Wystąpił błąd przy sprawdzaniu aktualizacji Service Workera:\n",
          e,
        );
      }
    }, 3600000);
  },
  onRegisterError(err) {
    log(
      "error",
      "[Service Worker] Wystąpił błąd przy rejestracji Service Workera:\n",
      err,
    );
  },
});

if (
  "serviceWorker" in navigator &&
  "addEventListener" in navigator.serviceWorker &&
  typeof navigator.serviceWorker.addEventListener === "function"
) {
  try {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (fetching) return;
      if (event.data !== "Timetable Update Available") return;
      log(
        "info",
        "[Service Worker] Wykryto aktualizację planu lekcji - pobieranie aktualnych planów...",
      );
      appConfigs.value.lastFetched = null;
      cacheTimeTables();
    });
  } catch (e) {
    log(
      "warn",
      "[Service Worker] Nie udało się zarejestrować eventlistenera:\n",
      e,
    );
  }
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.sessionStorage.setItem("swUpdate", "true");
      });
    }
  } catch (e) {
    log(
      "warn",
      "[Service Worker] Nie udało się zarejestrować eventlistenera:\n",
      e,
    );
  }
}

// Main app functions
(async () => {
  // Console log app version
  log("info", "[App] Wczytywanie aplikacji w wersji:", __APP_VERSION__);
  // Console log user notification
  if (import.meta.env.MODE !== "development") {
    log(
      "info",
      "[App] Witaj użytkowniku!\nWidzę, że zainteresowało cię działanie mojej aplikacji.\nJeśli masz jakieś pomysły na udoskonalenie jej zapraszam do kontaktu poprzez wątek na githubie:\nhttps://github.com/Bartek20/ZSM-TimeTable/issues",
    );
    log(
      "warn",
      "[App] Jeśli jednak jesteś tu z innego powodu zalecam wycofanie się i zamknięcie tego okna.\nZ pozdrowieniami autor kodu.",
    );
  }

  // App setup
  app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 10,
    newestOnTop: true,
    filterBeforeCreate: (toast, toasts) => {
      if (toasts.filter((t) => t.content === toast.content).length !== 0) {
        return false;
      }
      return toast;
    },
    position: "top-right",
    timeout: 3000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: false,
    draggablePercent: 0.3,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: "button",
    rtl: false,
  });
  app.directive("tooltip", vTooltip);
  // Check for isPWA
  if (location.search.includes("PWA=true")) {
    window.isPWA = true;
  }
  // Check supported scrollbars
  checkScrollStyllability();
  // Setup cache headers
  axios.defaults.headers.get["Cache-Control"] = "no-cache";
  // Setup color mode handler
  colorHandler();
  // Setup global functions
  const toast = useToast();
  window.axios = axios;
  const unknownLessons = new Set();
  window.addUnknowns = (unknown) => unknownLessons.add(unknown);
  window.getUnknowns = (target = "all") => {
    if (target === "all" || target === "subjects") {
      console.warn("Nieznane przedmioty:\n", unknownLessons);
    }
    if (target === "all" || target === "classes") {
      console.warn(
        "Nieznane kierunki:\n",
        new Set(
          Object.values(appConfigs.value.database.classes)
            .filter((e) => e.isUnknown)
            .map((e) => [...e.isUnknown])
            .flat(),
        ),
      );
    }
    if (target === "all" || target === "teachers") {
      console.warn(
        "Nieznani nauczyciele:\n",
        Object.keys(appConfigs.value.database.teachers).filter(
          (e) => appConfigs.value.database.teachers[e].isUnknown,
        ),
      );
    }
    if (target === "all" || target === "rooms") {
      console.warn(
        "Nieznane sale:\n",
        Object.keys(appConfigs.value.database.rooms).filter(
          (e) => appConfigs.value.database.rooms[e].isUnknown,
        ),
      );
    }
  };

  // Fetch School Data
  try {
    const { default: schoolData } = await import(
      /* @vite-ignore */ `${import.meta.env.BASE_URL}schoolData.js?t=${Date.now()}`
    );
    appConfigs.value.school.homeURL = schoolData.schoolHomeURL;
    appConfigs.value.school.timetableURL = schoolData.schoolTimeTableRootURL;
    appConfigs.value.school.logoDescription =
      schoolData.schoolLogoDescription || "Logo Szkoły";
    appConfigs.value.school.allowStudentsOldView =
      schoolData.allowStudentsOldView ?? false;
    appConfigs.value.school.allowStrudentsViewTeachers =
      schoolData.allowStrudentsViewTeachers ?? true;
    appConfigs.value.school.allowStrudentsViewRooms =
      schoolData.allowStrudentsViewRooms ?? true;
  } catch (e) {
    log("error", "[App] Wystąpił błąd przy wczytywaniu danych szkoły:\n", e);
    toast.error("Wystąpił błąd przy wczytywaniu danych szkoły");
  }
  // Fetch TimeTable Data
  try {
    const { default: timetableData } = await import(
      /* @vite-ignore */ `${import.meta.env.BASE_URL}timetableData.js?t=${Date.now()}`
    );
    parseData("shortLessons", timetableData.shortLessons || []);
    parseData("levels", timetableData.levels || {});
    parseData("classes", timetableData.classes || {});
    parseData("teachers", timetableData.teachers || {});
    parseData("rooms", timetableData.rooms || {});
    parseData("subjects", timetableData.subjects || {});
  } catch (e) {
    log(
      "error",
      "[App] Wystąpił błąd przy wczytywaniu danych planu lekcji:\n",
      e,
    );
    toast.error("Wystąpił błąd przy wczytywaniu danych planu lekcji");
  }

  // Prevent app from running without required data
  if (!appConfigs.value.school.timetableURL) {
    const loader = document.body.querySelector("#loader");
    loader.querySelector("h1").innerText =
      "Wystąpił błąd przy wczytywaniu aplikacji";
    loader.querySelector("p").innerText =
      "Nie udało się wczytać wymaganych danych.\nSprawdź połączenie z siecią i spróbuj ponownie później.";
    toast.error("Wystąpił błąd przy wczytywaniu aplikacji");
    return;
  }

  // Try to lock screen orientation
  try {
    await screen.orientation.lock("portrait");
  } catch (e) {
    log("warn", "[App] Nie udało się zablokować orientacji ekranu:\n", e);
  }

  // Reset session configs
  appConfigs.value.shortLessons = false;
  if (window.sessionStorage.getItem("swUpdate") !== null) {
    window.sessionStorage.removeItem("swUpdate");
    toast.success("Zaktualizowano aplikację do najnowszej wersji");
  }

  // Render application
  app.use(router);
  app.mount("#app");
})();
