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

function cleanSpams(context) {
  return browser.tabs.executeScript(
    context.tab.id, {
      file: `/clean-spams.js`,
      allFrames: true
    }
  )
}
