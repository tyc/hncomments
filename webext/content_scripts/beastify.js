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
  // getJSONData('12323');
  // getJSONData('1411223');
  // getJSONData('14133037');
  
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

/*
 * get all the IDs stored in the local storage and
 * push them into the display routine. One link per line.
 */
function get_storage_id() {
  var gettingAllStoredHNIds = browser.storage.local.get(null);
  gettingAllStoredHNIds.then((results) => {
    var HNIds = Object.keys(results);

    // for each ID, we sent a link to it.
    for(HNId of HNIds) {
      var curValue = results[HNId];
      console.log(HNId + " " + curValue);

      getJSONData(HNId);

      // push_HN_link("HN ID = " + HNId, "https://news.ycombinator.com/item?id="+HNId);
    }
  }, onError);
}

function getJSONData(HNId) {

  var url_request = 'https://hacker-news.firebaseio.com/v0/item/' + HNId + '.json';

  var request = new Request(url_request, {
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
      JSON_data = JSON.parse(y);

      if (JSON_data.title != null) {
        console.log("JSON title data " + JSON_data.title);
        push_HN_link(JSON_data.title, "https://news.ycombinator.com/item?id="+HNId);
      } else if (JSON_data.text != null) {
        console.log("JSON text data " + JSON_data.text);
        push_HN_link(JSON_data.text, "https://news.ycombinator.com/item?id="+HNId);
      }
  });
}


/*
 * Given a URL to a beast image, create and style an IMG node pointing to
 * that image, then insert the node into the document.
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
  textImage.style.fontFamily="arial";
  textImage.style.fontSize="1em";
  textImage.appendChild(createAText);
  para.appendChild(textImage);
  document.body.appendChild(para);  
}


/*
Assign beastify() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(beastify);
