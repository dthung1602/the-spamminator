const messageToActionMapping = new Map([
  ["clean-spams", cleanSpams],
]);

browser.runtime.onMessage.addListener((message, context) => {
  console.log("Background script received: ", message);

  const action = messageToActionMapping.get(message);
  if (action) {
    action(context).catch((e) => console.error(`Error processing message ${message}`, e));
  } else {
    console.error(`Invalid message ${message}`);
  }
});

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

browser.storage.local.get("banDomains").then(({ banDomains }) => {
  if (!banDomains) {
    console.log("Set ban domains to default");
    browser.storage.local.set({ banDomains: DEFAULT_BAN_DOMAINS })
      .catch(console.error);
  }
});

browser.storage.local.set({
  enable: true,
  cleanSpamAction: "replace-with-image",
  cleanSpamOptions: {
    // url: browser.runtime.getURL("images/spam.png")
    url: "random"
  }
}).catch(console.error);

// browser.storage.local.set({
//   enable: true,
//   cleanSpamAction: "replace-with-text",
//   cleanSpamOptions: {
//     text: "🔫 This spam message has been obliterated by the Spamminator 🔫"
//   }
// }).catch(console.error);

// browser.storage.local.set({
//   enable: true,
//   cleanSpamAction: "remove",
// }).catch(console.error);

function cleanSpams(context) {
  return browser.tabs.executeScript(
    context.tab.id, {
      file: `/clean-spams.js`,
      allFrames: true
    }
  )
}
