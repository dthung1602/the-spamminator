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
          get(value) {
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
const saveOptions = (event) => {
  const cleanSpamText = document.getElementById("text").value;
  const cleanSpamImage = document.getElementById("image").value;
  const clearSpamInterval = parseInt(document.getElementById("check-interval").value);
  const banDomains = serializeDomains(document.getElementById("ban-domain").value);
  console.log({clearSpamInterval, banDomains});
  browser.storage.local.set({ cleanSpamText, cleanSpamImage, clearSpamInterval, banDomains }).catch(console.error);
}
document.getElementById("image").addEventListener("change", saveOptions);
document.getElementById("text").addEventListener("change", saveOptions);
document.getElementById("check-interval").addEventListener("change", saveOptions);
document.getElementById("ban-domain").addEventListener("change", saveOptions);

// Advance
const showAdvance = () => {
  document.getElementById("basic").classList.add("hidden");
  document.getElementById("advance").classList.remove("hidden");
}
document.getElementById("advance-btn").addEventListener("click", showAdvance);

// Advance
const showBasic = () => {
  document.getElementById("advance").classList.add("hidden");
  document.getElementById("basic").classList.remove("hidden");
}
document.getElementById("basic-btn").addEventListener("click", showBasic);

// Self-destruct
function selfDestruct() {
  browser.management.uninstallSelf().catch(console.error);
}
document.querySelector(".self-destruct").addEventListener("click", selfDestruct);
