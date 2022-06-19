// Utils

function containBanDomain(node, banDomains) {
  const text = node.textContent.toLowerCase();
  for (let domain of banDomains) {
    if (domain.startsWith("/") && domain.endsWith("/")) {
      const regex = new RegExp(domain.slice(1, domain.length - 1), "i");
      if (text.match(regex)) {
        return true;
      }
    } else if (text.includes(domain.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function getAncestor(node, num, tillEncounterClass) {
  for (let i = 0; i < num; i++) {
    node = node.parentNode
    if (node.classList.contains(tillEncounterClass)) {
      break
    }
  }
  return node;
}

const spamComments = new Map();

function storeOriginalComment(node) {
  const restoreKey = Date.now();
  spamComments.set(restoreKey, node.innerHTML);
  return restoreKey;
}

function swapStoredContent(node, restoreKey) {
  const toStoreInnerHTML = node.innerHTML;
  node.innerHTML = spamComments.get(restoreKey);
  spamComments.set(restoreKey, toStoreInnerHTML);
}

// Ref https://stackoverflow.com/a/35385518/7342188
function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim(); // Never return a text node of whitespace as the result
  return template.content.firstChild;
}

let counter = 0;
const AVATAR_DATA_URI = "data:image/png;base64,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";

function highlightCommentAsSpam(node, restoreKey) {
  const commentRoot = getAncestor(node, 9, "_3-8y");
  commentRoot.classList.add("spam-comment-root");
  commentRoot.querySelector(".UFICommentActorName").innerHTML = `Spammer #${++counter}`;
  // facebook disallows external resources to be loaded -> must use data uri
  commentRoot.querySelector("img.img").src = AVATAR_DATA_URI;

  const buttonContainer = commentRoot.querySelector("._2vq9");
  buttonContainer.appendChild(htmlToElement(`<span aria-hidden="true"> · </span>`));
  buttonContainer.appendChild(createRestoreButton(node, restoreKey));
}

const restoreText = "⟲ Restore comment";
const hideText = "⟳ Hide spam"

function createRestoreButton(node, restoreKey) {
  const restoreButton = htmlToElement(`<span class="additional-button">${restoreText}</span>`);
  restoreButton.addEventListener("click", () => {
    swapStoredContent(node, restoreKey);
    restoreButton.innerText = restoreButton.innerText === restoreText ? hideText : restoreText;
  });
  return restoreButton;
}

function createBlackListButton(spamDomain) {
  const button = htmlToElement(`<span class="additional-button" title="Add this domain to The Spamminator's blacklist">✖ Blacklist domain</span>`);
  button.addEventListener("click", async () => {
    let { banDomains } = await browser.storage.local.get(["banDomains"]);
    banDomains = Array.from(new Set([...banDomains, spamDomain]));
    button.previousSibling.remove();
    button.remove();
    await browser.storage.local.set({ banDomains });
  });
  return button;
}

// Actions

function remove(node) {
  getAncestor(node, 6, "_3-8y").remove();
}

function replaceWithText(node, text) {
  const restoreKey = storeOriginalComment(node);
  node.innerHTML = `<span>${text}</span>`;
  highlightCommentAsSpam(node, restoreKey);
}

function replaceWithImage(node, url) {
  const restoreKey = storeOriginalComment(node);
  url = url === "random"
    ? getRandomLocalImage()
    : normalizeImageURL(url);
  node.innerHTML = `
      <div><div><a class="_2rn3 _4-eo">
        <div class="uiScaledImageContainer _4-ep" style="height: 250px">
          <img src="${url}" class="scaledImageFitHeight img" height="250" alt="This spam was obliterated by the Spamminator">
        </div>
      </a></div></div>
    `;
  highlightCommentAsSpam(node, restoreKey);
}

const LOCAL_IMAGES = [
  "behold-the-spamminator.jpg",
  "destroyed-by-spamminator.jpg",
  "just-spamming.jpg",
  "spam-everywhere.jpg",
  "spam-man.png",
  "spam.png",
  "spam-spam-spam.webp",
  "what-kind-of-spam-is-this.jpg",
  "you-shall-not-pass.jpeg"
];

function getRandomLocalImage() {
  const index = Math.floor(Math.random() * LOCAL_IMAGES.length);
  return browser.runtime.getURL(`images/${LOCAL_IMAGES[index]}`);
}

function normalizeImageURL(url) {
  if (!url.startsWith("http")) {
    url = browser.runtime.getURL(`images/${url}`);
  }
  return url;
}

// Main function

async function cleanSpams() {
  const {
    enable,
    banDomains,
    cleanSpamAction,
    cleanSpamText,
    cleanSpamImage,
  } = await browser.storage.local.get(["enable", "banDomains", "cleanSpamAction", "cleanSpamText", "cleanSpamImage"]);

  if (enable === false) {
    return;
  }

  const actionMapping = new Map([
    ["replace-with-image", (node) => replaceWithImage(node, cleanSpamImage)],
    ["replace-with-text", (node) => replaceWithText(node, cleanSpamText)],
    ["remove", remove]
  ]);

  const action = actionMapping.get(cleanSpamAction);
  const filterContainSpam = (node) => containBanDomain(node, banDomains);

  let spamCount = 0;
  const count = () => spamCount += 1;

  const performAction = (node) => {
    node.classList.add("spam-free");
    action(node);
  }

  // first, find the nested spam comments
  // if the outer comment & the nested comment belongs to the same account, perform action on the outer comment
  // the nested spammer comment is handled later
  const linksInNestedComments = window.document.querySelectorAll(".UFIImageBlockContent .UFIImageBlockContent ._5mdd a");
  Array.from(linksInNestedComments)
    .filter(filterContainSpam)
    .map((node) => {
      const spammerName = getAncestor(node, 5).querySelector(".UFICommentActorName").text;
      const outerComment = getAncestor(node, 11);
      const outerCommenterName = outerComment.querySelector(".UFICommentActorName").text;
      return spammerName === outerCommenterName ? outerComment.querySelector("._3-8m") : null;
    })
    .filter(Boolean)
    .map(performAction)
    .map(count);

  // find all spam comments, nested or not, and perform actions on them
  const uncheckedComments = window.document.querySelectorAll("._3-8m:not(.spam-free)");
  Array.from(uncheckedComments)
    .filter(filterContainSpam)
    .map(performAction)
    .map(count);

  console.log(`Found ${spamCount} spams`);

  addBlackListButtons();
}

function addBlackListButtons() {
  const links = window.document.querySelectorAll("._3-8y:not(.spam-comment-root) ._5mdd a");
  Array.from(new Set(links))
    .forEach((node) => {
      try {
        const spamLink = new URL(node.href).searchParams.get("u");
        const spamDomain = spamLink ? new URL(spamLink).host : node.href;

        // skip "See more" links
        if (spamDomain.includes("facebook.com")) {
          return
        }

        const buttonContainer = getAncestor(node, 9, "_3-8y").querySelector("._2vq9");
        if (!buttonContainer.querySelector(".additional-button")) {
          buttonContainer.appendChild(htmlToElement(`<span aria-hidden="true"> · </span>`));
          buttonContainer.appendChild(createBlackListButton(spamDomain));
        }

      } catch (e) {
        console.error(e);
        console.log(node.href);
      }
    })
}


cleanSpams().catch(console.error);
browser.storage.local.get(["clearSpamInterval"])
  .then(({ clearSpamInterval }) => setInterval(cleanSpams, clearSpamInterval))
  .catch(console.error);
