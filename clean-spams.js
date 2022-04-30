(async function () {
  if (!window.location.hostname.includes("facebook")) {
    return;
  }

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
    "readerzoneclub.xyz",
    "bit.do",
    "minepi.com"
  ];

  const REPLACEMENT_HTML = `
  <div><div><a class="_2rn3 _4-eo">
    <div class="uiScaledImageContainer _4-ep" style="width: 225px; height: 225px">
         <img class="scaledImageFitHeight img" width="225" height="225" alt="Fuck banger alert" 
         src="${browser.runtime.getURL("images/spam-man.png")}">
    </div>
  </a></div></div>
`;

  const {
    cleanSpamAction,
    cleanSpamOptions
  } = await browser.storage.local.get(["cleanSpamAction", "cleanSpamOptions"]);

  console.log(cleanSpamAction, cleanSpamOptions);

  const actionMapping = new Map([
    ["replace-with-image", replaceWithImage],
    ["replace-with-text", replaceWithText],
  ]);

  const action = actionMapping.get(cleanSpamAction);

  function replaceWithImage(node) {
    const url = cleanSpamOptions.url === "random" ? getRandomLocalImage() : cleanSpamOptions.url;
    node.innerHTML = `
      <div><div><a class="_2rn3 _4-eo">
        <div class="uiScaledImageContainer _4-ep" style="height: 300px">
          <img src="${url}" class="scaledImageFitHeight img" height="300" alt="This spam was obliterated by the Spamminator">
        </div>
      </a></div></div>
    `
  }

  function getRandomLocalImage() {
    const LOCAL_IMAGES = [
      "spam.png",
      "spam-man.png"
    ];
    const index = Math.floor(Math.random() * LOCAL_IMAGES.length);
    return browser.runtime.getURL(`images/${LOCAL_IMAGES[index]}`);
  }

  function replaceWithText(node) {
    node.innerHTML = `<span>${cleanSpamOptions.text}</span>`
  }

  function containBanDomain(node) {
    const linkText = node.textContent.toLowerCase();
    return BAN_DOMAINS.some((domain) => linkText.includes(domain));
  }

  function getAncestor(node, num) {
    for (let i = 0; i < num; i++) {
      node = node.parentNode
    }
    return node;
  }

  function log(nodes) {
    console.log(`Found ${nodes.length} bangers in ${window.document.title}`);
  }

  function replaceLinksInNestedComments() {
    const linksInNestedComments = window.document.querySelectorAll(".UFIImageBlockContent .UFIImageBlockContent ._5mdd a");
    log(linksInNestedComments);
    Array.from(linksInNestedComments)
      .filter(containBanDomain)
      .map((node) => getAncestor(node, 11).querySelector("._3-8m"))
      .forEach(action);
  }

  function replaceLinksInComments() {
    const linksInComments = window.document.querySelectorAll("._5mdd a");
    log(linksInComments);
    Array.from(linksInComments)
      .filter(containBanDomain)
      .map((node) => getAncestor(node, 3))
      .forEach(action);
  }

  replaceLinksInNestedComments();
  replaceLinksInComments();
})();
