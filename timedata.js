let SESSION_LENGTH = 1000 * 60 * 20; // length of a session

async function initialize() {
  const e = await chrome.storage.sync.get('dhSessionPeriod');
  if (e === undefined) SESSION_LENGTH = 1000 * 60 * 20;
  else {
    if (typeof e.dhSessionPeriod === 'number') {
      SESSION_LENGTH = e.dhSessionPeriod * 1000 * 60;
    } else {
      SESSION_LENGTH = Number.parseInt(e.dhSessionPeriod) * 1000 * 60;
    }
  }
}
initialize();

// Get statistics about time usage
function getTimeStats(entries) {
  const timestats = {
    total: entries.length,
    sessionTotal: 0,

    hours: new Array(24).fill(0),
    dow: new Array(7).fill(0),
    months: new Array(12).fill(0),

    sessionHours: new Array(24).fill(0),
    sessionDow: new Array(7).fill(0),
    sessionMonths: new Array(12).fill(0)
  };

  if (entries.length > 0) {
    const now = Date.now();
    const front = entries[0].timestamp;

    const MS_TO_DAY = 1 / (1000 * 60 * 60 * 24);
    const MS_TO_WEEK = 1 / (1000 * 60 * 60 * 24 * 7);
    const MS_TO_YEAR = 1 / (1000 * 60 * 60 * 24 * 365);

    const diff = now - front;
    const dayDiff = Math.ceil(diff * MS_TO_DAY);
    const weekDiff = Math.ceil(diff * MS_TO_WEEK);
    const yearDiff = Math.ceil(diff * MS_TO_YEAR);

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

          timestats.sessionTotal++;
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

    for (let i = 0; i < 24; i++) {
      timestats.hours[i] /= dayDiff;
      timestats.sessionHours[i] /= dayDiff;
    }

    for (let i = 0; i < 7; i++) {
      timestats.dow[i] /= weekDiff;
      timestats.sessionDow[i] /= weekDiff;
    }

    for (let i = 0; i < 12; i++) {
      timestats.months[i] /= yearDiff;
      timestats.sessionMonths[i] /= yearDiff;
    }
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
