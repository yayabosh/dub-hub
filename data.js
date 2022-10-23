async function getEntries() {
  return chrome.storage.sync.get('entries').entries || [];
}

async function addEntry(timestamp, title, url) {
  // Get the current entries
  const entries = await getEntries();
  // Add the new entry
  entries.push({
    timestamp,
    title,
    url
  });
  // Save the new entries
  chrome.storage.sync.set({ entries });
}

async function clearData() {
  await chrome.storage.sync.set({ entries: [] });
}
