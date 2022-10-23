async function displayTimeData(entries) {
  if (entries === null || entries.length === 0) return;

  const counts = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    const d = new Date(0);
    d.setUTCMilliseconds(entry.timestamp);

    const hour = d.getHours();

    counts[hour]++;
  }

  let lstr = '<ul>';

  for (let i = 0; i < counts.length; i++) {
    let disp = i % 12;
    if (disp === 0) disp = 12;
    lstr += `<li><b>${disp}:00 ${i < 12 ? 'am' : 'pm'}</b> - ${counts[i]}</li>`;
  }

  lstr += '</ul>';

  let com = 0;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > counts[com]) com = i;
  }
  let hr = com % 12;
  if (hr === 0) hr = 12;

  commonTimesDiv.innerHTML =
    `<p>Your Peak Hour: ${hr}:00 ${com < 12 ? 'am' : 'pm'}</p>` + lstr;
}
