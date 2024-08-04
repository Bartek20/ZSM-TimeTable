import { createRouter, createWebHistory } from "vue-router";

import appConfigs from "@/stores/configs";
import appData from "@/stores/data";
import appPWA from "@/stores/pwa";
import log from "@/functions/logger";
import setTitle from "@/functions/setTitle";
import { useToast } from "vue-toastification";

import AppView from "@/views/AppView.vue";

function checkHoliday() {
  const today = new Date();
  const begin = new Date(today.getFullYear(), 6, 1);
  const end = new Date(today.getFullYear(), 7, 24);
  return (
    today >= begin && today <= end && appConfigs.value.school.showHolidaysView
  );
}

function addHistory(mode, id) {
  let historyRecords = appConfigs.value.history;
  // Filter added path
  historyRecords = historyRecords.filter(
    (record) => !(record.mode === mode && record.id === id),
  );
  // Change history size to 24 records
  historyRecords = historyRecords.filter((_, idx) => idx < 24);
  // Add newest record
  historyRecords = [{ mode, id }, ...historyRecords];
  // Save history
  appConfigs.value.history = historyRecords;
}

const toast = useToast();

const selected = appConfigs.value.history?.[0];

const isHoliday = checkHoliday();
let redirectHoliday = false;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/plany/:plan([ons]\\d+.html)",
      name: "redirector",
      redirect: (to) => {
        const plan = to.params.plan.replace(".html", "");
        const mode = plan.charAt(0);
        const id = plan.replace(mode, "");
        return `/uczen/${mode}/${id}`;
      },
    },
    {
      path: "/:user(uczen|nauczyciel)/:mode([ons])/:id(\\d+)",
      name: "plan",
      component: AppView,
    },
    {
      path: "/:user?",
      name: "home",
      redirect: (to) =>
        `/${["uczen", "nauczyciel"].includes(to.params.user) ? to.params.user : "uczen"}/${["o", "n", "s"].includes(selected?.mode) ? selected.mode : "o"}/${
          typeof selected?.id === "string" && !isNaN(selected?.id)
            ? selected.id
            : 1
        }`,
    },
    {
      path: "/wakacje",
      name: "holidays",
      component: () => import("@/views/HolidaysView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "404",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from) => {
  log("info", "[Vue Router]", from.fullPath, "->", to.fullPath);

  // Check if summer holidays are active
  if (to.name !== "holidays" && isHoliday && !redirectHoliday) {
    redirectHoliday = true;
    return { name: "holidays" };
  }
  if (to.name === "holidays") {
    redirectHoliday = true;
    if (!isHoliday) return { name: "home" };
  }

  // Prevent redirection loop
  if (to.name === "404" || to.name === "home" || to.name === "redirector") {
    if (
      to.redirectedFrom.name === "404" ||
      to.redirectedFrom.name === "home" ||
      to.redirectedFrom === "redirector"
    ) {
      log("warn", "[Vue Router] Doszło do pętli przekierowań:", to);
      return { name: "plan", params: { user: "uczen", mode: "o", id: "1" } };
    }
    return undefined;
  }

  if (to.name !== "plan") return undefined;
  if (appPWA.status.value !== "standalone") {
    appConfigs.value.app.isTeacher = to.params.user === "nauczyciel";
  }
  if (
    appPWA.status.value === "standalone" &&
    appConfigs.value.app.isTeacher &&
    to.params.user === "uczen"
  ) {
    return {
      name: "plan",
      params: { user: "nauczyciel", mode: to.params.mode, id: to.params.id },
    };
  }
  // Prevent students from using old view
  if (
    !appConfigs.value.school.allowStudentsOldView &&
    to.params.user === "uczen"
  ) {
    appConfigs.value.user.viewMode = "new";
  }
  // Check if student is allowed to view requested timetable
  if (
    !appConfigs.value.school.allowStrudentsViewTeachers &&
    to.params.user === "uczen" &&
    to.params.mode === "n"
  ) {
    toast.error("Uczniowie nie mają dostępu do planów nauczycieli");
    return { name: "plan", params: { user: "uczen", mode: "o", id: "1" } };
  }
  if (
    !appConfigs.value.school.allowStrudentsViewRooms &&
    to.params.user === "uczen" &&
    to.params.mode === "s"
  ) {
    toast.error("Uczniowie nie mają dostępu do planów sal lekcyjnych");
    return { name: "plan", params: { user: "uczen", mode: "o", id: "1" } };
  }
  if (
    !appConfigs.value.school.allowStrudentsViewRooms &&
    to.params.user === "uczen" &&
    to.params.mode === "s"
  ) {
    toast.error("Uczniowie nie mają dostępu do planów sal lekcyjnych");
    return { name: "plan", params: { user: "uczen", mode: "o", id: "1" } };
  }

  // Add current timetable to history
  addHistory(to.params.mode, to.params.id);
  // Force loading status
  appData.timetable.value = { status: 0 };
});
router.afterEach((to, _from, failure) => {
  if (failure) {
    log("error", "[Vue Router] Wystąpił błąd przy przekierowaniu:", failure);
    return;
  }
  if (to.name === "plan") setTitle("Wczytywanie planu lekcji.");
});
router.onError((e) =>
  log("error", "[Vue Router] Wystąpił błąd przy przekierowaniu:", e),
);

export default router;
