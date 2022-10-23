const SESSION_LENGTH = 1000 * 60 * 20; // length of a session

// Get statistics about time usage
function getTimeStats(entries) {
  const timestats = {
    total: 0,
    sessionCount: 0,
    hours: new Array(24).fill(0),
    dow: new Array(7).fill(0),
    months: new Array(12).fill(0),

    sessionHours: new Array(24).fill(0),
    sessionDow: new Array(7).fill(0),
    sessionMonths: new Array(12).fill(0)
  };

  if (entries.length > 0) {
    let d;
    for (let i = 0; i < entries.length; i++) {
      d = new Date(0);
      d.setUTCMilliseconds(entries[i].timestamp);

      timestats.hours[d.getHours()]++;
      timestats.dow[d.getDay()]++;
      timestats.months[d.getMonth()]++;

      if (i !== 0) {
        let diff = entries[i].timestamp - entries[i - 1].timestamp;
        if (diff >= SESSION_LENGTH) {
          d = new Date(0);
          d.setUTCMilliseconds(entries[i - 1].timestamp);

          timestats.sessionCount++;
          timestats.sessionHours[d.getHours()]++;
          timestats.sessionDow[d.getDay()]++;
          timestats.sessionMonths[d.getMonth()]++;
        }
      }
    }

    d = new Date(0);
    d.setUTCMilliseconds(entries[entries.length - 1].timestamp);

    timestats.sessionCount++;
    timestats.sessionHours[d.getHours()];
    timestats.sessionDow[d.getDay()];
    timestats.sessionMonths[d.getMonth()];
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
