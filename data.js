async function getEntries() {
  let entryCount = 0;
  const data = await chrome.storage.sync.get('dhEntryCount');
  if (data === undefined) return [];
  entryCount = data.dhEntryCount;

  console.log(entryCount);

  let result = [];
  for (let i = 0; i < entryCount; i++) {
    const key = `dhEntry${i}`;
    const entdata = await chrome.storage.sync.get(key);
    if (entdata === undefined) continue;
    result.push(entdata[key]);
  }

  return result;
}

async function clearData() {
  let entryCount = 0;
  await chrome.storage.sync.get('dhEntryCount', (data) => {
    if (data === undefined) return;
    entryCount = data.dhEntryCount;
  });

  for (let i = 0; i < entryCount; i++) {
    const key = `dhEntry${i}`;
    await chrome.storage.sync.set(key, null);
  }

  await chrome.storage.sync.set({ dhEntryCount: 0 });
}
