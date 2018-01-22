const formatter = Intl.DateTimeFormat([], {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});

const formatDate = date => `${formatter.format(date)} PST`;

module.exports = formatDate;
