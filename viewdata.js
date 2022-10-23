const popularWordsDiv = document.getElementById('popular-words');
const wordCloudDiv = document.getElementById('word-cloud');

const wordBlacklick = [];

async function displayAll() {
  const entries = await getEntries();

  if (entries === undefined) {
    popularWordsDiv.innerHTML = '<p>Corrupted.</p>';
    wordCloudDiv.innerHTML = '<p>Corrupted</p>';
    alert('Storage is corrupt, will correct on close');
    entries = [];
    await chrome.storage.local.set({ entries });
  }

  if (entries === null || entries.length === 0) {
    popularWordsDiv.innerHTML = '<p>No Data.</p>';
    wordCloudDiv.innerHTML = '<p>No Data.</p>';
    return;
  }

  const timestats = getTimeStats(entries);
  const words = countAllWords(entries);

  displayCommonWords(words.sortedUniqueWords);
  displayWordCloud(words.sortedWords);

  displayGraphs(timestats);
}

displayAll();
