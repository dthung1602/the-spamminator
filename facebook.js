console.log(">>>> FROM FACEBOOK <<<<<")
x = window.document.querySelectorAll("._5mdd")
console.log(x.length)
x.forEach((e) => {
  if (e.textContent.toLowerCase().includes("manhua")) {
    console.log("-- BANGER ALERT!", e)
    e.textContent = "FUCK THIS BANGER ALERT!"
  }
})