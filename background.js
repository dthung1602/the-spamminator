const messageToActionMapping = new Map([
  ["check-comment", checkComment],
]);

browser.runtime.onMessage.addListener((message, context) => {
  console.log("Background script received: ", message, context);

  const action = messageToActionMapping.get(message);
  if (action) {
    action(context).catch((e) => console.error(`Error processing message ${message}`, e))
  } else {
    console.error(`Invalid message ${message}`)
  }
})

async function checkComment(context) {
  const tab = context.tab.id

  console.log("Start inject executable script")

  await browser.tabs.executeScript(tab, {
    code: "BAN_DOMAINS = " + JSON.stringify(BAN_DOMAINS) + ";" +
      "replacement = " + JSON.stringify(replacement) + ";" +
      "(" +
      function () {
        const linksInComments = window.document.querySelectorAll("._5mdd a")
        console.log(browser.runtime.getURL("images/spam.png"));
        console.log(`Found ${linksInComments.length} links in comment section`)
        linksInComments.forEach((aTag) => {
          const linkText = aTag.textContent.toLowerCase();
          for (let domain of BAN_DOMAINS) {
            if (linkText.includes(domain)) {
              console.log("-- BANGER ALERT!", aTag)
              aTag.innerHTML = `<span>HELLO</span>`
              aTag.parentElement.parentElement.parentElement.innerHTML = replacement;
              console.log("replaced")
              break
            }
          }
        })
      }
      + ")()",
    allFrames: true
  })
}
console.log(browser.runtime.getURL("images/spam.png"));

const replacement = `
  <div><div><a class="_2rn3 _4-eo">
    <div class="uiScaledImageContainer _4-ep" style="width: 225px; height: 225px">
         <img class="scaledImageFitHeight img" width="225" height="225" alt="Fuck banger alert"
            src="${browser.runtime.getURL("images/spam.png")}">
    </div>
  </a></div></div>
`

const BAN_DOMAINS = [
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
  "bit.do",
  "minepi.com"
];
