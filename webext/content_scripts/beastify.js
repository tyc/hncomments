/*
beastify():
* removes every node in the document.body,
* then inserts the chosen beast
* then removes itself as a listener
*/
function beastify(request, sender, sendResponse) {
  removeEverything();
  // insertBeast(request.beastURL);
  get_storage_id();
  browser.runtime.onMessage.removeListener(beastify);
}

/*
Remove every node under document.body
*/
function removeEverything() {
  while (document.body.firstChild) {
    document.body.firstChild.remove();
  }
}

/* generic error handler */
function onError(error) {
  console.log(error);
}

function get_storage_id() {
  var gettingAllStoredHNIds = browser.storage.local.get(null);
  gettingAllStoredHNIds.then((results) => {
    var HNIds = Object.keys(results);
    for(HNId of HNIds) {
      var curValue = results[HNId];
      console.log(HNId + " " + curValue);
      push_HN_link(HNId,curValue);
    }
  }, onError);
}

/*
Given a URL to a beast image, create and style an IMG node pointing to
that image, then insert the node into the document.
*/
function insertBeast(beastURL) {

  var request = new Request('https://hacker-news.firebaseio.com/v0/item/12411.json', {
    method: 'GET', 
    mode: 'cors', 
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });

// Now use it!
fetch(request).then( x => { 
    console.log("No data found!");
    return x.text();
}).then( y => {
    console.log("here is the json data!")
    console.log(y);
});

  push_HN_link("HN Story 1", "https://news.ycombinator.com/item?id=14124328");
  push_HN_link("HN Story 2", "https://news.ycombinator.com/item?id=14124298");

  console.log("hello from the content script");
}

function push_HN_link(text, link) {

  // for each link, it is abstracted into a paragraph.
  var para = document.createElement("p");
  var textImage = document.createElement("a");
  var createAText = document.createTextNode(text);
  textImage.setAttribute("href", link);
  textImage.appendChild(createAText);
  para.appendChild(textImage);
  document.body.appendChild(para);  
}


/*
Assign beastify() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(beastify);
