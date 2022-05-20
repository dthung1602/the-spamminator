if ("function" === typeof importScripts) {
  importScripts("/vendor/browser-polyfill.min.js");
}

const DEFAULT_BAN_DOMAINS = [
  // Spam manga sites
  "giphy.com",
  "mangaweb.xyz",
  "arcanemanga.org",
  "manga-nato.com",
  "factmanga.com",
  "mangaeclipse.com",
  "mangameta.in",
  "mangaflam.com",
  "mangashark.com",
  "mangallama.com",
  "mangaeclipse.com",
  "mangalilo.com",
  "readerzoneclub.xyz",
  "manga4reader.com",
  "elitemanga.org",
  // Other stuff
  "bit.do",
  "minepi.com",
  "r.honeygain.me",
  "a.run.app",
  "crrnt.me"
];

async function migrateToVer1() {
  await browser.storage.local.set({
    version: "1.0",
    banDomains: DEFAULT_BAN_DOMAINS,
    enable: true,
    clearSpamInterval: 1500,
    cleanSpamAction: "replace-with-image",
    cleanSpamText: "",
    cleanSpamImage: "random",
  })
}

const NEW_BAN_DOMAINS_1 = [
  "mangadungeon.com",
  "manga4all.net",
  "wikiraw.net",

  "buzz15.com",
  "www.salarybaar.com",

  // This regex should cover:
  // Www.cashapp1.com
  // www.zcash4.com
  "/www[a-z0-9-.]*work[a-z0-9-.]*com/",

  // This regex should cover:
  // "www.works43.com",
  // "www.net.works39.com",
  // "www.fast.works39.com",
  // "www.easywork2.com",
  "/www[a-z0-9-.]*cash[a-z0-9-.]*com/",
]

DEFAULT_TEXT = "<i>Just a spam, nothing to see here</i>";

async function migrationToVer1_1_0() {
  let { banDomains, cleanSpamText, clearSpamInterval } = await browser.storage.local.get([
    "banDomains", "cleanSpamText", "clearSpamInterval"
  ]);
  banDomains = Array.from(new Set([...banDomains, ...NEW_BAN_DOMAINS_1]));
  cleanSpamText = cleanSpamText || DEFAULT_TEXT;
  clearSpamInterval = clearSpamInterval === 1500 ? 1000 : clearSpamInterval;
  await browser.storage.local.set({
    version: "1.1.0",
    banDomains,
    cleanSpamText,
    clearSpamInterval,
  })
}

const NEW_BAN_DOMAINS_2 = [
  "mangas20.com",
  "dreamjob",
  "vyvymanga",
  "mangadownloads.xyz"
]

async function migrationToVer1_2_0() {
  let { banDomains } = await browser.storage.local.get(["banDomains"]);
  banDomains = Array.from(new Set([...banDomains, ...NEW_BAN_DOMAINS_2]));
  await browser.storage.local.set({
    version: "1.2.0",
    banDomains,
  })
}

const migrations = [
  ["1.0", migrateToVer1],
  ["1.1.0", migrationToVer1_1_0],
  ["1.2.0", migrationToVer1_2_0],
];

browser.runtime.onInstalled.addListener(async () => {
    try {
      let { version: installedVersion } = await browser.storage.local.get("version");
      installedVersion = installedVersion || "0.1";
      for (let [ver, migrate] of migrations) {
        if (installedVersion < ver) {
          console.log(`Migrating to version ${ver}`);
          await migrate();
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
)
