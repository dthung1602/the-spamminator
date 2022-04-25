console.log("_____ FROM BACKGROUND SCRIPT")

let tab;

browser.runtime.onMessage.addListener((message, context) => {
  console.log("Background script received: ", message, context)
  tab = context.tab.id
  console.log("Tab id: ", tab)

  console.log("Start inject executable script")
  browser.tabs.executeScript(tab, {
    code: `(function() {
    
console.log(">>>> FROM FACEBOOK <<<<<")
x = window.document.querySelectorAll("._5mdd")
console.log(x.length)
x.forEach((e) => {
  if (e.textContent.toLowerCase().includes("manhua")) {
    console.log("-- BANGER ALERT!", e)
    e.textContent = "FUCK THIS BANGER ALERT!"
  }
})

})()`,
    allFrames: true
  }).then((...args) => {
    console.log("Promise done: ", args)
  }).catch(console.error);
  console.log("Done inject executable script")
})

setTimeout(() => {
  console.log("Sending message to content from background")
  console.log("tabid: ", tab);
  browser.tabs.sendMessage(tab, "good night")
  console.log("DONE Sending message to content from background")
}, 4000)
