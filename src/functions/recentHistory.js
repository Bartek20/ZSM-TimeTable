import appConfigs from "@/stores/configs";

export function addHistory(mode, id) {
  if (!mode || !id) return;
  let historyRecords = appConfigs.value.history;
  // Filter added path
  historyRecords = historyRecords.filter(
    (record) => !(record.mode === mode && record.id === id),
  );
  // Change history size to 24 records
  historyRecords = historyRecords.slice(0, 24);
  // Add newest record
  historyRecords = [{ mode, id }, ...historyRecords];
  // Save history
  appConfigs.value.history = historyRecords;
}

export function getHistory(mode, count = 5) {
  const history = mode === "nauczyciel"
  ? appConfigs.value.history
  : appConfigs.value.history.filter((record) => {
      // Exclude record not accessible for user based on school config
      if (
        (record.mode === "n" &&
          !appConfigs.value.school.allowStrudentsViewTeachers) ||
        (record.mode === "s" &&
          !appConfigs.value.school.allowStrudentsViewRooms)
      ) {
        return false;
      }
      return true;
    })
  return history.length <= count ? history : history.slice(0, count);
}
