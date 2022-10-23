const commonTimesDiv = document.getElementById('common-times');
const popularWordsDiv = document.getElementById('popular-words');
const wordCloudDiv = document.getElementById('word-cloud');

const MAX_WORDS = 10;

const wordBlacklick = [];

async function displayAll() {
  const entries = await getEntries();

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

  const timestats = getTimeStats(entries);
  const words = countAllWords(entries);

  displayTimeData(timestats);

  displayCommonWords(words.sortedUniqueWords);
  displayWordCloud(words.sortedWords);
}

displayAll();
