// This is a list of sites that are whitelisted for the extension.
const whitelist = ['youtube', 'twitter'];

// Stores the current tab's URL and title
let tabIdtoURLandTitle = {};

// Each time a tab is updated, we store the URL and title in the map if it's in the whitelist
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tabIdtoURLandTitle[tabId]) {
    tabIdtoURLandTitle[tabId] = {
      url: null,
      title: null
    };
  }

  const newURL = changeInfo.url;
  if (newURL) {
    tabIdtoURLandTitle[tabId].url = newURL;
  }

  const newTitle = changeInfo.title;
  if (newTitle) {
    tabIdtoURLandTitle[tabId].title = newTitle;
  }

  const url = tabIdtoURLandTitle[tabId].url;
  const title = tabIdtoURLandTitle[tabId].title;
  if (url && title) {
    for (const domain in whitelist) {
      if (url.startsWith(`https://${domain}`)) {
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
        break;
      }
    }

    tabIdtoURLandTitle[tabId] = undefined;
  }
});
