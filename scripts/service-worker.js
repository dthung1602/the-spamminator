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
  "zcash4.com",
  "buzz15.com",
  "www.salarybaar.com",

  "/www[a-z0-9-.]*work[a-z0-9-.]*com/",
  // This regex should cover:
  // "www.works43.com",
  // "www.net.works39.com",
  // "www.fast.works39.com",
  // "www.easywork2.com",
]

async function migrationToVer1_0_1() {
  let { banDomains } = await browser.storage.local.get(["banDomains"]);
  banDomains = Array.from(new Set([...banDomains, ...NEW_BAN_DOMAINS_1]));
  await browser.storage.local.set({
    version: "1.0.1",
    banDomains
  })
}

const migrations = [
  ["1.0", migrateToVer1],
  ["1.0.1", migrationToVer1_0_1],
];

browser.runtime.onInstalled.addListener(async () => {
    try {
      let { version: installedVersion } = browser.storage.local.get("version");
      installedVersion = installedVersion || "0.1";
      for (let [ver, migrate] of migrations) {
        if (installedVersion < ver) {
          console.log(`Migrating to version ${ver}`)
          await migrate()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
)
