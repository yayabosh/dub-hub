function getTimeStats(entries) {
  const timestats = {
    total: 0,
    hours: new Array(24).fill(0),
    dow: new Array(7).fill(0),
    months: new Array(12).fill(0)
  };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    const d = new Date(0);
    d.setUTCMilliseconds(entry.timestamp);

    const hour = d.getHours();
    const dow = d.getDay();
    const month = d.getMonth();

    timestats.hours[hour]++;
    timestats.dow[dow]++;
    timestats.months[month]++;
  }

  return timestats;
}

async function displayTimeData(timestats) {
  let lstr = '<ul>';

  for (let i = 0; i < timestats.hours.length; i++) {
    let disp = i % 12;
    if (disp === 0) disp = 12;
    lstr += `<li><b>${disp}:00 ${i < 12 ? 'am' : 'pm'}</b> - ${
      timestats.hours[i]
    }</li>`;
  }

  lstr += '</ul>';

  let com = 0;
  for (let i = 0; i < timestats.hours.length; i++) {
    if (timestats.hours[i] > timestats.hours[com]) com = i;
  }
  let hr = com % 12;
  if (hr === 0) hr = 12;

  commonTimesDiv.innerHTML =
    `<p>Your Peak Hour: ${hr}:00 ${com < 12 ? 'am' : 'pm'}</p>` + lstr;
}
