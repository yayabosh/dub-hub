function getEntries() {
  let result = null;
  chrome.storage.sync.get('visits', (data) => {
    Object.assign(result, data.visits);
  });

  return result;
}

function appendObject(obj) {
  let res = getEntries() + [obj];
  chrome.storage.sync.set({ visits: res });
}

function addEntry(
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

  appendObject(obj);
}

function removeEntry(entryIndex) {}

function clearData() {
  chrome.storage.sync.set({ visits: [] });
}
