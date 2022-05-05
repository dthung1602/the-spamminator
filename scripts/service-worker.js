if ('function' === typeof importScripts) {
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
    cleanSpamAction: "replace-with-image",
    cleanSpamText: "",
    cleanSpamImage: "random",
  })
}

const migrations = [
  ["1.0", migrateToVer1]
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
