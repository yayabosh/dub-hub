const commonTimesDiv = document.getElementById('common-times');

function sortWordOccurences(words) {
  const m = new Map();
  for (let i = 0; i < words; i++) {
    const word = words[i];
    if (m[word]) m[word] = m[word] + 1;
    else m[word] = 1;
  }
  const a = new Map([...m.entries()].sort());
  return [...a.entries()];
}

function getWords(strings) {}

async function displayData() {
  const entries = await getEntries();

  if (entries === undefined) {
    alert('Storage is corrupt, will correct on close');
    entries = [];
    await chrome.storage.local.set({ visits, entries });
  }

  if (entries === null || entries.length === 0) {
    commonTimesDiv.innerHTML = '<p>No Data</p><p>Try visiting a website</p>';
    return;
  }

  let counts = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    let d = new Date(0);
    d.setUTCMilliseconds(entry.timestamp);

    let hour = d.getHours();

    counts[hour]++;
  }

  let lstr = '<ul>';

  for (let i = 0; i < counts.length; i++) {
    const disp = i % 12;
    if (disp === 0) disp = 12;
    lstr += `<li><b>${disp}:00 ${i < 12 ? 'am' : 'pm'}</b> - ${counts[i]}</li>`;
  }

  lstr += '</ul>';

  let com = 0;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > counts[com]) com = i;
  }
  const hr = com % 12;
  if (hr === 0) hr = 12;

  commonTimesDiv.innerHTML =
    `<p>Your Peak Hour: ${hr}:00 ${com < 12 ? 'am' : 'pm'}</p>` + lstr;
}

commonTimesDiv.innerHTML = '<p>Loading data...</p>';
displayData();
