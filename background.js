// This is a list of sites that are whitelisted for the extension.
const whitelist = ['youtube', 'twitter'];

const tracklist = new Set([
  // for testing
  'youtube',
  'twitter',

  'xVideos',
  'PornHub',
  'xHamster',
  'XNXX',
  'YouPorn',
  'HClips',
  'Porn',
  'TnaFlix',
  'Tube8',
  'Spankbang',
  'DrTuber',
  'Nuvid',
  'IXXX',
  'SunPorno',
  'PornHD',
  'Porn300',
  'PornOne',
  'SexVid',
  'Thumbzilla',
  'ZbPorn',
  'Fuq',
  'XXXBunker',
  'HDHole',
  '3Movs',
  'CumLouder',
  'PornDoe',
  'Xbabe',
  'VipWank',
  'PornDroids',
  'AlohaTube',
  'MatureTube',
  'TubeV',
  '4Tube',
  'Shameless',
  'MegaTube',
  'PornTube',
  'PornDig',
  'PornBurst',
  'BigPorn',
  'Fapster',
  'Porn.biz',
  'XXXVideo',
  'FapVidHD',
  'MelonsTube',
  'TastyBlacks',
  'LobsterTube',
  'ViviPorn',
  'PornRox',
  'PornMaki',
  'Pornid',
  'UpSkirt',
  'Slutload',
  'ProPorn',
  'Pornhost',
  'HotPornTubes',
  'TheMaturePorn',
  'XXXVideos247',
  'Its.Porn',
  'HandjobHub',
  'DansMovies',
  'Porn7',
  'ForHerTube',
  'PornHeed',
  'Orgasm',
  'PornRabbit',
  'Tiava',
  'Fux',
  'H2porn',
  'MetaPorn',
  'Here.XXX',
  'PornerBros',

  'Jasmin',
  'ImLive',
  'LivePrivates',
  'StripChat',
  'BetterMates',
  'LuckyCrush',
  'SlutRoulette',
  'SexedChat',
  'CamsFinder',
  'JerkMate',

  'Brazzers',
  'NaughtyAmerica',
  'Reality Kings',
  'AdultTime',
  'Digital Playground',
  'Mofos',
  '18ExGFs',
  'Twistys',
  'TeamSkeet',
  'BangBros',
  'Private',
  'NewSensations',
  '21Sextury',
  'ElegantAngel',
  'VideosZ',
  'Hustler',
  'Jav HD',
  'Tenshigao',
  'PornPros',
  'AgentRedGirl',
  'Perfect Gonzo',
  'Spizoo',
  'All Japanese Pass',
  '18Videoz',
  'Nubiles',
  'KinkyFamily',
  'DorcelClub',
  'ClubTug',
  'BestPayPornSites'
]);

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
    // console.log(url, title);
    for (let domain of tracklist) {
      domain = domain.toLowerCase();
      if (
        url.startsWith(`https://www.${domain}`) ||
        url.startsWith(`https://${domain}`)
      ) {
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
