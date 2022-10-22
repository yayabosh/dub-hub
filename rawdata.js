const dataElem = document.getElementById('data-area');

chrome.storage.sync.get(['visits'], function (result) {
  dataElem.innerHTML += result.key + ' ' + result.value;
});
