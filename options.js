const clearDataButton = document.getElementById('clear-data');
const alertDiv = document.getElementById('alert-div');

clearDataButton.addEventListener('click', async function () {
  console.log('clicked');
  await clearData();
  alertDiv.innerHTML += '<p>Cleared!</p>';
});
