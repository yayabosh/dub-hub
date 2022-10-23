const MAX_DISPLAY_WORDS = 15;
const MAX_WORDCLOUD_WORDS = 32;

function countWords(array) {
  const map = new Map();
  const set = new Set();

  for (let i = 0; i < array.length; i++) {
    const word = array[i];
    if (map.get(word) !== undefined) {
      map.get(word).freq += 10;
    } else {
      const obj = {
        word: word,
        freq: 10
      };
      map.set(word, obj);
      set.add(obj);
    }
  }

  const sortedWords = [];
  const sortedUniqueWords = [];

  map.forEach((value) => sortedWords.push(value));
  set.forEach((value) => sortedUniqueWords.push(value));

  console.log(sortedWords);
  console.log(sortedUniqueWords);

  const cmp = (a, b) => b.freq - a.freq;
  sortedWords.sort(cmp);
  sortedUniqueWords.sort(cmp);

  return {
    sortedWords,
    sortedUniqueWords,
    map
  };
}

function countAllWords(entries) {
  const allWords = [];
  for (let i = 0; i < entries.length; i++) {
    console.log(entries[i].title);
    const title = entries[i].title
      .replace(/\u2019/g, '')
      .replace(/\u2018/g, '')
      .trim()
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')
      .replace(/^\s+|\s+$/g, '')
      .toLowerCase();
    console.log(title);

    const splitted = title.split(/\s+/);
    for (let j = 0; j < splitted.length; j++) {
      // test against stoplist and tracklist
      if (STOPWORDS.has(splitted[j]) || tracklist.has(splitted[j])) continue;
      if (splitted[j].match(/^\d+$/g) && splitted[j] !== '69') continue;
      allWords.push(splitted[j]);
    }
  }

  return countWords(allWords);
}

async function displayCommonWords(uniqueWords) {
  let lstr = '<ol>';
  for (let i = 0; i < uniqueWords.length && i < MAX_DISPLAY_WORDS; i++) {
    lstr += `<li>${uniqueWords[i].word}</li>`;
  }
  lstr += '</ol>';
  popularWordsDiv.innerHTML = lstr;
}

async function displayWordCloud(words) {
  const config = {
    trace: true,
    spiralResolution: 1, //Lower = better resolution
    spiralLimit: 360 * 5,
    lineHeight: 0.8,
    xWordPadding: 0,
    yWordPadding: 3,
    font: 'sans-serif'
  };

  wordCloudDiv.style.position = 'relative';
  wordCloudDiv.style.fontFamily = config.font;

  var traceCanvas = document.createElement('canvas');
  traceCanvas.width = wordCloudDiv.offsetWidth;
  traceCanvas.height = wordCloudDiv.offsetHeight;
  var traceCanvasCtx = traceCanvas.getContext('2d');
  wordCloudDiv.appendChild(traceCanvas);

  const startPoint = {
    x: wordCloudDiv.offsetWidth / 2,
    y: wordCloudDiv.offsetHeight / 2
  };

  const wordsDown = [];
  /* ======================= END SETUP ======================= */

  /* =======================  PLACEMENT FUNCTIONS =======================  */
  function createWordObject(word, freq) {
    const wordContainer = document.createElement('div');
    wordContainer.style.position = 'absolute';
    wordContainer.style.fontSize = freq + 'px';
    wordContainer.style.lineHeight = config.lineHeight;
    /*    wordContainer.style.transform = "translateX(-50%) translateY(-50%)";*/
    wordContainer.appendChild(document.createTextNode(word));

    return wordContainer;
  }

  function placeWord(word, x, y) {
    wordCloudDiv.appendChild(word);
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
    wordCloudDiv.appendChild(word);

    word.style.left = x - word.offsetWidth / 2 + 'px';
    word.style.top = y - word.offsetHeight / 2 + 'px';

    const currentWord = word.getBoundingClientRect();

    wordCloudDiv.removeChild(word);

    for (let i = 0; i < wordsDown.length; i += 1) {
      const comparisonWord = wordsDown[i];

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

  for (let i = 0; i < words.length && i < MAX_DISPLAY_WORDS; i++) {
    const word = createWordObject(words[i].word, words[i].freq);

    for (let j = 0; j < config.spiralLimit; j++) {
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

  traceCanvasCtx.beginPath();

  if (config.trace) {
    let frame = 1;

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
}
