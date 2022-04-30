(function () {
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
         src="${browser.runtime.getURL("images/spam.png")}">
    </div>
  </a></div></div>
`;

  function containBanDomain(node) {
    const linkText = node.textContent.toLowerCase();
    return BAN_DOMAINS.some((domain) => linkText.includes(domain));
  }

  function replaceHTML(node) {
    node.innerHTML = REPLACEMENT_HTML;
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
      .forEach(replaceHTML);
  }

  function replaceLinksInComments() {
    const linksInComments = window.document.querySelectorAll("._5mdd a");
    log(linksInComments);
    Array.from(linksInComments)
      .filter(containBanDomain)
      .map((node) => getAncestor(node, 3))
      .forEach(replaceHTML);
  }

  replaceLinksInNestedComments();
  replaceLinksInComments();
})();
