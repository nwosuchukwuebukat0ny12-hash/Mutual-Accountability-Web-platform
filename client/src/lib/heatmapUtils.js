/**
 * Generate heatmap data from an array of check-in records.
 * Returns an array of 30 objects (one per day, most recent last)
 * each with { date, status, count }.
 *
 * status values:
 *   "verified"  – at least one approved check-in that day
 *   "pending"   – check-in exists but not yet approved
 *   "missed"    – no check-in recorded
 */
export function generateHeatmapData(checkIns = []) {
  const days = 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a map of date-string → check-ins for quick lookup
  const checkInMap = {};
  for (const ci of checkIns) {
    const d = new Date(ci.createdAt || ci.date);
    const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (!checkInMap[key]) checkInMap[key] = [];
    checkInMap[key].push(ci);
  }

  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const entries = checkInMap[key] || [];

    let status = "missed";
    if (entries.length > 0) {
      // Backend uses "approved" (not "verified") for confirmed check-ins
      const hasApproved = entries.some(
        (e) => e.status === "approved"
      );
      status = hasApproved ? "verified" : "pending";
    }

    result.push({ date: key, status, count: entries.length });
  }

  return result;
}
