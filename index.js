// const CHECK_INTERVAL = 2000
//
// if (window.location.hostname === "mangakakalot.com" || window.location.hostname === "readmanganato.com") {
//   console.log("FROM MANGA SITE")
//   // setInterval(() => {
//   //   const iframe = findFacebookIframe();
//   //   if (iframe) {
//   //     removeComment(iframe)
//   //   } else {
//   //     console.log("NOT FOUND")
//   //   }
//   // }, 5000)
// }
//
// if (window.location.hostname.includes("facebook")) {
//   console.log(">>>>>> IN IFRAME!")
// }
//
// function findFacebookIframe() {
//   return window.document.querySelector("iframe[title='fb:comments Facebook Social Plugin']")
// }
//
// function removeComment(iframe) {
//   console.log(iframe)
//   console.log(iframe.querySelectorAll("a"))
//   console.log("----------------------------")
// }

browser.runtime.onMessage.addListener((...args) => {
  console.log("Content script received: ", ...args)
})

setTimeout(() => {
  console.log("Sending message to background from content")
  browser.runtime.sendMessage("hello world")
  console.log("DONE Sending message to background from content")
}, 3000)