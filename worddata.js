const MAX_DISPLAY_WORDS = 15;
const MAX_WORDCLOUD_WORDS = 32;

const DOMAINS = ['', 'com', 'net', 'info', 'xxx', 'tv', 'live', 'cc'];

function countWords(array) {
  const map = new Map();
  const set = new Set();

  for (let i = 0; i < array.length; i++) {
    const word = array[i];
    if (map.get(word) !== undefined) {
      map.get(word).freq += 1;
    } else {
      const obj = {
        word: word,
        freq: 1
      };
      map.set(word, obj);
      set.add(obj);
    }
  }

  const sortedWords = [];
  const sortedUniqueWords = [];

  map.forEach((value) => sortedWords.push(value));
  set.forEach((value) => sortedUniqueWords.push(value));

  const cmp = (a, b) => b.freq - a.freq;
  sortedWords.sort(cmp);
  sortedUniqueWords.sort(cmp);

  let maxwords = 0;
  for (let i = 0; i < sortedUniqueWords.length; i++) {
    maxwords = Math.max(maxwords, sortedUniqueWords[i].freq);
  }

  return {
    sortedWords,
    sortedUniqueWords,
    map,
    maxwords
  };
}

function countAllWords(entries) {
  const allWords = [];
  for (let i = 0; i < entries.length; i++) {
    const title = entries[i].title
      .replace(/\u2019/g, '')
      .replace(/\u2018/g, '')
      .trim()
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')
      .replace(/^\s+|\s+$/g, '')
      .toLowerCase();

    const splitted = title.split(/\s+/);
    for (let j = 0; j < splitted.length; j++) {
      // test against stoplist and tracklist
      let found = false;
      tracklist.forEach((elem) => {
        const s = elem
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')
          .toLowerCase();
        for (let k = 0; k < DOMAINS.length; k++) {
          if (s + DOMAINS[k] === splitted[j]) {
            found = true;
            return false;
          }
        }

        return true;
      });

      if (found) continue;

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
    lstr += `<li><b>${uniqueWords[i].word}</b> (${uniqueWords[i].freq})</li>`;
  }
  lstr += '</ol>';
  popularWordsDiv.innerHTML = lstr;
}

async function displayWordCloud(words, maxwords) {
  const config = {
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
  function createWordObject(word, size) {
    const wordContainer = document.createElement('div');
    wordContainer.style.position = 'absolute';
    wordContainer.style.fontSize = size + 'px';
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
    const scale = (words[i].freq * 50) / maxwords;
    const word = createWordObject(words[i].word, scale);

    for (let j = 0; j < config.spiralLimit; j++) {
      if (
        spiral(j, () => {
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
}
