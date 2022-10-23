async function getEntries() {
  let e = await chrome.storage.sync.get('entries');
  return e.entries || [];
}

async function addEntry(timestamp, title, url) {
  console.log(`Adding entry for ${title} (${url})`);
  chrome.storage.sync.get('entries', (data) => {
    const entries = data.entries || [];
    entries.push({
      url,
      title,
      timestamp: Date.now()
    });
    chrome.storage.sync.set({ entries });
  });

  chrome.storage.sync.get('entries', (data) => console.log(data));
}

async function clearData() {
  await chrome.storage.sync.set({ entries: [] });
}
