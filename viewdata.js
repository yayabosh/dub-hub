const commonTimesDiv = document.getElementById('common-times');
const popularWordsDiv = document.getElementById('popular-words');
const wordCloudDiv = document.getElementById('word-cloud');

async function displayTimeData() {
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

async function displayWordData() {
  const myWords = ['Hello', 'how', 'are', 'you'];

  const margin = { top: 00, right: 100, bottom: 100, left: 100 };
  const width = 450 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const svg = d3
    .select('#word-cloud')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(
      myWords.map(function (d) {
        return { text: d };
      })
    )
    .padding(10)
    .fontSize(60)
    .on('end', draw);
  layout.start();

  function draw(words) {
    svg
      .append('g')
      .attr(
        'tranform',
        'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')'
      )
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', function (d) {
        return d.size + 'px';
      })
      .attr('text-anchor', 'middle')
      .attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .text(function (d) {
        return d.text;
      });
  }
}

//commonTimesDiv.innerHTML = '<p>Loading data...</p>';
//displayTimeData();
displayWordData();
