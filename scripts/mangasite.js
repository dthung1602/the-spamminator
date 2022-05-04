const CHECK_INTERVAL = 2000;

function cleanSpams() {
  console.log(`Start checking for spams in ${window.location}`);
  browser.runtime.sendMessage("clean-spams").catch(console.error);
}

cleanSpams();
setInterval(cleanSpams, CHECK_INTERVAL);
