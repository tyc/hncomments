/*
beastify():
* removes every node in the document.body,
* then inserts the chosen beast
* then removes itself as a listener
*/
function beastify(request, sender, sendResponse) {
  removeEverything();
  insertBeast(request.beastURL);
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

/*
Given a URL to a beast image, create and style an IMG node pointing to
that image, then insert the node into the document.
*/
function insertBeast(beastURL) {

/*  var beastImage = document.createElement("img");
  beastImage.setAttribute("src", beastURL);
  beastImage.setAttribute("style", "width: 100vw");
  beastImage.setAttribute("style", "height: 100vh");
  document.body.appendChild(beastImage);
*/
  abc("HN Story 1", "https://news.ycombinator.com/item?id=14124328");
  abc("HN Story 2", "https://news.ycombinator.com/item?id=14124298");
}

function abc(text, link) {
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