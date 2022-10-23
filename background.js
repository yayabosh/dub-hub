
// CONTENT WARNING
// This file contains content that be considered offensive to some readers
// Browse at your own risk












































































// This is a list of sites that are whitelisted for the extension.
const whitelist = ['youtube', 'twitter'];

// From: https://toppornsites.com/
const tracklist = new Set([
  // for testing
  //'youtube',
  //'twitter',
  // "Top Porn Tube Sites"
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
  // "Live Cam Sites"
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
  // "Paid Porn Sites"
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
  'BestPayPornSites',
  'Blacked',
  'BlackedRaw',
  'Vixen',
  'Tushy',
  'TushyRaw',
  // "Top VR Porn Sites"
  'VrPorn',
  'VRSmash',
  'BadoinkVR',
  'WankzVR',
  'CzechVR',
  'SexLikeReal',
  'StripChatVR',
  'BaberoticaVR',
  // "Gay Porn Sites"
  'GayMaleTube',
  'ManPorn',
  'YouPornGay',
  'GayFuror',
  'JustUsBoys',
  'MyPornGay',
  // "Amateur Porn Sites"
  'WatchMyExGF',
  'Fantasti',
  'Amateurest',
  'WatchMyGF.me',
  // "Adult Online Shops"
  'SiliconWives',
  'YourDoll',
  'JSDolls',
  'AcSexDolls',
  'SexySexDoll',
  'SexyRealSexDolls',
  'SexMachine',
  'JoyLoveDolls',
  'Sohimi',
  // "Hentai Porn Sites"
  'Hentaigasm',
  'Fakku',
  'Gelbooru',
  'HentaiPulse',
  'Porcore',
  'CartoonPorno',
  // User-recommended sites
  'Bellesa', // Kelly
  'OnlyFans',
  'twitch.tv/amouranth'
]);

// Stores the current tab's URL and title
let tabIdtoURLandTitle = {};

async function initialize() {
  const e = await chrome.storage.sync.get('dhSessionPeriod');
  const v = e.dhSessionPeriod;
  if (typeof v !== 'number') {
    await chrome.storage.sync.set({
      dhSessionPeriod: 20
    });
  }

  let s = await chrome.storage.sync.get('dhEntryCount');
  let v = s.dhEntryCount;
  if (typeof v !== 'number') {
    await chrome.storage.sync.set({
      dhEntryCount: 0
    });
  }
}
initialize();

// Each time a tab is updated, we store the URL and title in the map if it's in the whitelist
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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

        let s = await chrome.storage.sync.get('dhEntryCount');
        let entryCount = s.dhEntryCount;
        let all = await chrome.storage.sync.get(null);

        const key = `dhEntry${entryCount}`;
        all[key] = {
          url,
          title,
          timestamp: Date.now()
        };

        chrome.storage.sync.set(all);
        chrome.storage.sync.set({ dhEntryCount: entryCount + 1 });

        break;
      }
    }

    tabIdtoURLandTitle[tabId] = undefined;
  }
});
