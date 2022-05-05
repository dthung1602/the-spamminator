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

// Load value from storage to UI
async function loadSettings() {
  // TODO add ban domain settings
  let {
    enable,
    cleanSpamAction,
    cleanSpamText,
    cleanSpamImage
  } = await browser.storage.local.get(["enable", "cleanSpamAction", "cleanSpamText", "cleanSpamImage"]);

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
  browser.storage.local.set({ cleanSpamText, cleanSpamImage }).catch(console.error);
}
document.getElementById("image").addEventListener("change", saveOptions);
document.getElementById("text").addEventListener("change", saveOptions);

// self-destruct
function selfDestruct() {
  browser.management.uninstallSelf().catch(console.error);
}
document.querySelector(".self-destruct").addEventListener("click", selfDestruct);
