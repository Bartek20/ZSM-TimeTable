export default function checkBetween(start, end) {
  const start_el = start.split(':');
  const start_time = new Date();
  start_time.setHours(start_el[0], start_el[1], 0, 0);
  const end_el = end.split(':');
  const end_time = new Date();
  end_time.setHours(end_el[0], end_el[1] - 1, 59, 999);
  const current = new Date();
  return current >= start_time && current <= end_time;
}
