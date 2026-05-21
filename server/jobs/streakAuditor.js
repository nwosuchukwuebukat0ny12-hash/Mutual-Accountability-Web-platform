const cron = require('node-cron');
const { runCheckStreaks } = require('../tasks/checkStreaks');

/**
 * Initialize the daily streak auditor job.
 * Runs at 00:01 every day in the configured timezone.
 * @param {string} timezone - IANA timezone string (defaults to process.env.SERVER_TIMEZONE or 'UTC')
 */
function initStreakAuditor(timezone) {
  const tz = timezone || process.env.SERVER_TIMEZONE || 'UTC';

  // Schedule at 00:01 every day
  const expression = '1 0 * * *'; // minute hour day month weekday

  // Do an immediate run for safety on startup as well (runCheckStreaks already invoked elsewhere, but harmless)
  try {
    runCheckStreaks().catch(err => console.error('[streakAuditor] initial run error:', err));
  } catch (e) {
    console.error('[streakAuditor] error running initial audit:', e);
  }

  cron.schedule(expression, () => {
    console.log(`[streakAuditor] Cron triggered at ${new Date().toISOString()} (tz=${tz})`);
    runCheckStreaks().catch(err => console.error('[streakAuditor] run error:', err));
  }, { timezone: tz });

  console.log(`[streakAuditor] Scheduled daily audit at 00:01 (${tz})`);
}

module.exports = { initStreakAuditor };
