const CHECK_INTERVAL = 2000

async function pingBackgroundProcess() {
  try {
    console.log("Ping background process")
    await browser.runtime.sendMessage("check-comment")
  } catch (e) {
    console.error(e)
  }
}

// noinspection JSIgnoredPromiseFromCall
pingBackgroundProcess()
setInterval(pingBackgroundProcess, 5000)
