const viewDataButton = document.getElementById('view-data');
const clearDataButton = document.getElementById('clear-data');

viewDataButton.addEventListener('click', () => {
    
});

clearDataButton.addEventListener('click', async () => {
  await chrome.storage.sync.set({ visits: [] });
  alert('Your data has been cleared!');
});
