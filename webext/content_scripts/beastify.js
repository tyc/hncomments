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
  // fetch("https://hacker-news.firebaseio.com/v0/item/)


  // var JSON_text = getJSON("https://hacker-news.firebaseio.com/v0/item/1234.json");
  // console.log(JSON_text);

/*
  getJSONP('https://hacker-news.firebaseio.com/v0/item/1234.json', function(data){
    console.log(data);
  });  
*/

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

function getJSON(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] 
               || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}





/*
Assign beastify() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(beastify);
