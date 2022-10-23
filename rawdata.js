const dataElem = document.getElementById('data-area');

dataElem.innerHTML = '<p>Retrieving data...</p>';

async function updateData() {
  visits = await getEntries();
  if (visits.length == 0) dataElem.innerHTML = '<p>No Data.</p>';
  else
    dataElem.innerHTML = `<font face="Courier"><p>${JSON.stringify(
      visits
    )}</p></font>`;
}

updateData();
