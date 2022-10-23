async function getEntries() {
  let data = await chrome.storage.sync.get('visits');
  return data.visits;
}

async function appendObject(obj) {
  let entries = await getEntries();
  if (!Array.isArray(entries)) {
    entries = [];
  }
  entries.push(obj);
  await chrome.storage.sync.set({ visits: entries });
}

async function addEntry(
  entryName,
  timestamp,
  sourceURL,
  pageTitle = null,
  contentTitle = null
) {
  const obj = {
    timestamp: timestamp,
    source: sourceURL,
    pageTitle: pageTitle,
    contentTitle: contentTitle
  };
  await appendObject(obj);
}

async function removeEntry(entryIndex) {}

async function clearData() {
  await chrome.storage.sync.set({ visits: [] });
}
