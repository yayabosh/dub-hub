const commonTimesDiv = document.getElementById('common-times');

async function displayData() {
  const entries = getEntries();

  if (entries.length == 0) {
    commonTimesDiv.innerHTML = '<p>No Data</p>';
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

  let resultstr = '<ul>';

  for (let i = 0; i < counts.length; i++) {
    resultstr += `<li>${i}:00 - ${counts[i]}</li>`;
  }

  resultstr += '</ul>';
  commonTimesDiv.innerHTML = resultstr;
}

commonTimesDiv.innerHTML = '<p>Loading data...</p>';
displayData();
