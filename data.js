export function getEntries() {
  let result = null;
  chrome.storage.sync.get('visits', (data) => {
    Object.assign(result, data.visits);
  });

  return result;
}

export function appendObject(obj) {
  let res = getEntries() + [obj];
  chrome.storage.sync.set({ visits: res });
}

export function addEntry(
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

export function removeEntry(entryIndex) {}

export function clearData() {
  chrome.storage.sync.set({ visits: [] });
}
