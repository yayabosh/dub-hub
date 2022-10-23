async function displayAll() {
  const commonTimesDiv = document.getElementById('common-times');
  const popularWordsDiv = document.getElementById('popular-words');
  const wordCloudDiv = document.getElementById('word-cloud');

  const entries = await getEntries();
  console.log(entries);
  console.log(entries.length);

  if (entries === undefined) {
    commonTimesDiv.innerHTML = '<p>Corrupted.</p>';
    popularWordsDiv.innerHTML = '<p>Corrupted.</p>';
    wordCloudDiv.innerHTML = '<p>Corrupted</p>';
    alert('Storage is corrupt, will correct on close');
    entries = [];
    await chrome.storage.local.set({ entries });
  }

  if (entries === null || entries.length === 0) {
    commonTimesDiv.innerHTML = '<p>No Data.</p>';
    popularWordsDiv.innerHTML = '<p>No Data.</p>';
    wordCloudDiv.innerHTML = '<p>No Data.</p>';
    return;
  }

  async function displayTimeData() {
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
      lstr += `<li><b>${disp}:00 ${i < 12 ? 'am' : 'pm'}</b> - ${
        counts[i]
      }</li>`;
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

  const uniqueWordSet = new Set();
  let words = [];
  for (let i = 0; i < entries.length; i++) {
    const title = entries[i].title;
    console.log(title);
    const splitted = title.split();
    for (let j = 0; j < splitted.length; j++) {
      words.push(splitted[j]);
      uniqueWordSet.add(splitted[j]);
    }
  }

  function mapFun(word) {
    return {
      word: word,
      freq: Math.floor(Math.random() * 50) + 10
    };
  }

  function sortFun(a, b) {
    return -1 * (a.freq - b.freq);
  }

  let uniqueWordArray = [...uniqueWordSet.entries()];

  words.map(mapFun);
  uniqueWordArray.map(mapFun);

  words.sort(sortFun);
  uniqueWordArray.sort(sortFun);

  async function displayCommonWords() {
    let lstr = '<ol>';
    for (let i = 0; i < uniqueWordArray.length; i++) {
      lstr += `<li>${uniqueWordArray[i]}</li>`;
    }
    lstr += '</ol>';
    popularWordsDiv.innerHTML = lstr;
  }

  async function displayWordData() {
    /*  ======================= SETUP ======================= */
    const config = {
      trace: true,
      spiralResolution: 1, //Lower = better resolution
      spiralLimit: 360 * 5,
      lineHeight: 0.8,
      xWordPadding: 0,
      yWordPadding: 3,
      font: 'sans-serif'
    };

    var cloud = document.getElementById('word-cloud');
    cloud.style.position = 'relative';
    cloud.style.fontFamily = config.font;

    var traceCanvas = document.createElement('canvas');
    traceCanvas.width = cloud.offsetWidth;
    traceCanvas.height = cloud.offsetHeight;
    var traceCanvasCtx = traceCanvas.getContext('2d');
    cloud.appendChild(traceCanvas);

    var startPoint = {
      x: cloud.offsetWidth / 2,
      y: cloud.offsetHeight / 2
    };

    var wordsDown = [];
    /* ======================= END SETUP ======================= */

    /* =======================  PLACEMENT FUNCTIONS =======================  */
    function createWordObject(word, freq) {
      var wordContainer = document.createElement('div');
      wordContainer.style.position = 'absolute';
      wordContainer.style.fontSize = freq + 'px';
      wordContainer.style.lineHeight = config.lineHeight;
      /*    wordContainer.style.transform = "translateX(-50%) translateY(-50%)";*/
      wordContainer.appendChild(document.createTextNode(word));

      return wordContainer;
    }

    function placeWord(word, x, y) {
      cloud.appendChild(word);
      word.style.left = x - word.offsetWidth / 2 + 'px';
      word.style.top = y - word.offsetHeight / 2 + 'px';

      wordsDown.push(word.getBoundingClientRect());
    }

    function trace(x, y) {
      //     traceCanvasCtx.lineTo(x, y);
      //     traceCanvasCtx.stroke();
      traceCanvasCtx.fillRect(x, y, 1, 1);
    }

    function spiral(i, callback) {
      angle = config.spiralResolution * i;
      x = (1 + angle) * Math.cos(angle);
      y = (1 + angle) * Math.sin(angle);
      return callback ? callback() : null;
    }

    function intersect(word, x, y) {
      cloud.appendChild(word);

      word.style.left = x - word.offsetWidth / 2 + 'px';
      word.style.top = y - word.offsetHeight / 2 + 'px';

      var currentWord = word.getBoundingClientRect();

      cloud.removeChild(word);

      for (var i = 0; i < wordsDown.length; i += 1) {
        var comparisonWord = wordsDown[i];

        if (
          !(
            currentWord.right + config.xWordPadding <
              comparisonWord.left - config.xWordPadding ||
            currentWord.left - config.xWordPadding >
              comparisonWord.right + config.wXordPadding ||
            currentWord.bottom + config.yWordPadding <
              comparisonWord.top - config.yWordPadding ||
            currentWord.top - config.yWordPadding >
              comparisonWord.bottom + config.yWordPadding
          )
        ) {
          return true;
        }
      }

      return false;
    }
    /* =======================  END PLACEMENT FUNCTIONS =======================  */

    /* =======================  LETS GO! =======================  */
    (function placeWords() {
      for (var i = 0; i < words.length; i += 1) {
        var word = createWordObject(words[i].word, words[i].freq);

        for (var j = 0; j < config.spiralLimit; j++) {
          //If the spiral function returns true, we've placed the word down and can break from the j loop
          if (
            spiral(j, function () {
              if (!intersect(word, startPoint.x + x, startPoint.y + y)) {
                placeWord(word, startPoint.x + x, startPoint.y + y);
                return true;
              }
            })
          ) {
            break;
          }
        }
      }
    })();
    /* ======================= WHEW. THAT WAS FUN. We should do that again sometime ... ======================= */

    /* =======================  Draw the placement spiral if trace lines is on ======================= */
    (function traceSpiral() {
      traceCanvasCtx.beginPath();

      if (config.trace) {
        var frame = 1;

        function animate() {
          spiral(frame, function () {
            trace(startPoint.x + x, startPoint.y + y);
          });

          frame += 1;

          if (frame < config.spiralLimit) {
            window.requestAnimationFrame(animate);
          }
        }

        animate();
      }
    })();
  }

  displayTimeData();
  displayCommonWords();
  displayWordData();
}

displayAll();
