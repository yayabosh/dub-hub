export function addEntry(
  entryName,
  timestamp,
  sourceURL,
  pageTitle = null,
  contentTitle = null
) {
  obj = {
    timestamp: timestamp,
    source: sourceURL,
    pageTitle: pageTitle,
    contentTitle: contentTitle
  };

  chrome.storage.sync.get('visits', (data) => {
    let visits = data.visits + [obj];
    chrome.storage.sync.set({ visits: visits });
  });
}

export function removeEntry(entryIndex) {}

export function clearData() {
  chrome.storage.sync.set({ visits: [] });
}
