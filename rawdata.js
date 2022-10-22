import getEntries from 'data.js';

const dataElem = document.getElementById('data-area');

visits = getEntries();

dataElem.innerHTML = `<p>${visits}</p>`;
