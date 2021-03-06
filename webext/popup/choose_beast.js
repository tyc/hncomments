/*
Given the name of a beast, get the URL to the corresponding image.
*/
function beastNameToURL(beastName) {

  switch (beastName) {
    case "Show New Comments":
      return browser.extension.getURL("beasts/frog.jpg");
    case "Enter a New ID":
      return browser.extension.getURL("beasts/snake.jpg");
    case "About":
      return browser.extension.getURL("beasts/turtle.jpg");
  }
}


/*
Listen for clicks in the popup.

If the click is on one of the beasts:
  Inject the "beastify.js" content script in the active tab.

  Then get the active tab and send "beastify.js" a message
  containing the URL to the chosen beast's image.

If it's on a button which contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

document.addEventListener("click", (e) => {

  if (e.target.classList.contains("ShowComments")) {
    var chosenBeast = e.target.textContent;
    var chosenBeastURL = beastNameToURL(chosenBeast);

      // this sets up the listener.
      browser.tabs.executeScript(null, { 
        file: "/content_scripts/beastify.js" 
      });

      // this sends a message to bestify withe beastURL345
      var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
      gettingActiveTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {beastURL: chosenBeastURL});
      });
  }
  // clear everything, including the list of HN IDs
  //
  else if (e.target.classList.contains("clear")) {
    browser.storage.local.clear();
    browser.tabs.reload();
    window.close();
  }
  else if (e.target.classList.contains("GotoSite")) {
    window.open("https://hacker-news.firebaseio.com/v0/item/1.json",'_blank');

  }
});

document.addEventListener("submit", (e) => {
    var value = document.querySelector("#hn_id").value;
    var storingHNId = browser.storage.local.set({[value]:"HN_ID"});
    console.log("got the submit data" + value);
});  
