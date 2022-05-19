// debug code
if (window.browser === undefined) {
  if (window.chrome) {
    window.browser = window.chrome;
  } else {
    window.__storage__ = {};
    browser = {
      storage: {
        local: {
          set(value) {
            window.__storage__ = { ...window.__storage__, ...value }
            console.debug("Storage is set to: ", window.__storage__);
            return Promise.resolve(window.__storage__)
          },
          get() {
            return Promise.resolve(window.__storage__)
          }
        }
      }
    }
  }
}

// Util
function serializeDomains(text) {
  return text.split("\n").map(x => x.trim().toLowerCase()).filter(Boolean);
}

function deserializeDomains(domains) {
  return domains.join("\n");
}

function debounce(func, time) {
  let timeoutHandler;
  return function (...args) {
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => func(...args), time);
  }
}

function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    return "firefox";
  } else if (userAgent.match(/safari/i)) {
    return "safari";
  } else if (userAgent.match(/opr\//i)) {
    return "opera";
  } else if (userAgent.match(/edg/i)) {
    return "edge";
  } else {
    return "none";
  }
}

// Load value from storage to UI
async function loadSettings() {
  // TODO add ban domain settings
  let {
    enable,
    clearSpamInterval,
    cleanSpamAction,
    cleanSpamText,
    cleanSpamImage,
    banDomains
  } = await browser.storage.local.get([
    "enable", "clearSpamInterval", "cleanSpamAction",
    "cleanSpamText", "cleanSpamImage", "banDomains"
  ]);

  // simple
  document.getElementById("toggle").checked = enable;
  document.getElementById("action").value = cleanSpamAction;
  document.getElementById("image").value = cleanSpamImage;
  document.getElementById("text").value = cleanSpamText;

  if (enable) {
    document.querySelector("body").classList.add("on");
  } else {
    document.querySelector("body").classList.remove("on");
  }

  document.getElementById(cleanSpamAction).classList.remove("hidden");

  // advance
  document.getElementById("check-interval").value = clearSpamInterval;
  document.getElementById("ban-domain").value = deserializeDomains(banDomains);
}

loadSettings().catch(console.error);

// Enable / disable
// https://codepen.io/agoodwin/pen/JBvBPr
const toggleOnOff = () => {
  const enable = document.querySelector("body").classList.toggle("on");
  browser.storage.local.set({ enable }).catch(console.error);
  return false;
}
document.getElementById("toggle").addEventListener("click", toggleOnOff);

// Select action
const selectAction = (event) => {
  const cleanSpamAction = event.target.value;

  document.querySelectorAll(".clean-spam-option").forEach((node) => node.classList.add("hidden"));
  document.getElementById(cleanSpamAction).classList.remove("hidden");

  browser.storage.local.set({ cleanSpamAction }).catch(console.error);

  return false
}
document.getElementById("action").addEventListener("change", selectAction);

// Save options
const saveOptions = debounce(() => {
  const cleanSpamText = document.getElementById("text").value;
  const cleanSpamImage = document.getElementById("image").value;
  const clearSpamInterval = parseInt(document.getElementById("check-interval").value);
  const banDomains = serializeDomains(document.getElementById("ban-domain").value);
  browser.storage.local.set({ cleanSpamText, cleanSpamImage, clearSpamInterval, banDomains }).catch(console.error);
}, 1000);
document.getElementById("image").addEventListener("input", saveOptions);
document.getElementById("text").addEventListener("input", saveOptions);
document.getElementById("check-interval").addEventListener("input", saveOptions);
document.getElementById("ban-domain").addEventListener("input", saveOptions);

// Switch between sections
const changeSection = (sectionId) => {
  document.querySelectorAll("section").forEach(node => node.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}
document.getElementById("advance-btn").addEventListener("click", () => changeSection("advance"));
document.getElementById("basic-btn").addEventListener("click", () => changeSection("basic"));
let isAboutPageShown = false;
document.getElementById("about-btn").addEventListener("click", () => {
  changeSection(isAboutPageShown ? "basic" : "about")
  document.getElementById("about-btn").innerHTML = isAboutPageShown ? "&#x24D8; About" : "&#12296; Back";
  isAboutPageShown = !isAboutPageShown;
});

// Rating
const openRatingPage = () => {
  const browser = detectBrowser();
  const url = browser === "firefox"
    ? "https://addons.mozilla.org/en-US/firefox/addon/thespamminator/"
    : "https://chrome.google.com/webstore/detail/thespamminator/dnpihknfmkmoldifndaajhcceejniabd";
  window.open(url, '_blank').focus();
}
document.getElementById("rate-me").addEventListener("click", openRatingPage);

// Self-destruct
function selfDestruct() {
  browser.management.uninstallSelf().catch(console.error);
}

document.querySelector(".self-destruct").addEventListener("click", selfDestruct);
