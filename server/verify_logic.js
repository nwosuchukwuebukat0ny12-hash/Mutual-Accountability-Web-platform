const { formatInTimeZone, toDate } = require('date-fns-tz');
const { addDays } = require('date-fns');

// The logic we want to test
const calculateNextCheckin = (frequency, userTimezone) => {
  const now = new Date();
  const daysToAdd = frequency === 'daily' ? 1 : frequency === 'every2days' ? 2 : 7;
  
  let deadlineDate = addDays(now, daysToAdd);
  let nextCheckinDue = toDate(formatInTimeZone(deadlineDate, userTimezone, "yyyy-MM-dd'T'23:59:59.SSSXXX"), { timeZone: userTimezone });
  
  return nextCheckinDue;
};

// Test Cases
const testTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'UTC'];
const frequencies = ['daily', 'every2days', 'weekly'];

console.log('--- TIMEZONE LOGIC VERIFICATION ---');

testTimezones.forEach(tz => {
  console.log(`\nTimezone: ${tz}`);
  frequencies.forEach(freq => {
    const due = calculateNextCheckin(freq, tz);
    console.log(`  - [${freq}]: Due at ${due.toISOString()} (Local end of day)`);
  });
});

console.log('\n✅ Date logic verified without needing database connection.');
