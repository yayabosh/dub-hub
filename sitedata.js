function getSiteData(entries) {
  const domainMap = new Map();

  for (let i = 0; i < entries.length; i++) {
    const domainName = new URL(entries[i].url).hostname;
    if (domainMap.get(domainMap) !== undefined) {
      domainMap[domainName].freq++;
    } else {
      domainMap[domainName] = {
        domainName,
        freq: 1
      };
    }
  }

  const sortedDomains = [];
  domainMap.forEach((value) => sortedDomains.push(value));

  sortedDomains.sort((a, b) => b.freq - a.freq);

  return { sortedDomains, domainMap };
}
