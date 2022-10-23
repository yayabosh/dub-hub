const clearDataButton = document.getElementById('clear-data');
const alertDiv = document.getElementById('alert-div');

const sessionPeriodInput = document.getElementById('session-period');

async function initialize() {
  const e = await chrome.storage.sync.get('dhSessionPeriod');
  if (e === undefined) sessionPeriodInput.value = 20;
  else sessionPeriodInput.value = e.dhSessionPeriod;
}
initialize();

sessionPeriodInput.addEventListener('input', async (e) => {
  await chrome.storage.sync.set({
    dhSessionPeriod: Number.parseInt(e.target.value)
  });
});

clearDataButton.addEventListener('click', async function () {
  await clearData();
  alert('Cleared!');
});
