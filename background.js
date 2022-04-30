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
})

browser.storage.local.set({
  cleanSpamAction: "replace-with-image",
  cleanSpamOptions: {
    // url: browser.runtime.getURL("images/spam.png")
    url: "random"
  }
}).catch(console.error)

browser.storage.local.set({
  cleanSpamAction: "replace-with-text",
  cleanSpamOptions: {
    text: "🔫 This spam message has been obliterated by the Spamminator 🔫"
  }
}).catch(console.error)

function cleanSpams(context) {
  return browser.tabs.executeScript(
    context.tab.id, {
      file: `/clean-spams.js`,
      allFrames: true
    }
  )
}
