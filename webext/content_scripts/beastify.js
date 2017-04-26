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

/*
 * for each HN IDs, I need the drill down tree structure. If it is
 * the first, it will need to traverse all the three it as a
 * reference.
 * 
function 

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

    var rank = 0;

    // for each ID, we sent a link to it.
    for(HNId of HNIds) {
      var curValue = results[HNId];
      console.log(HNId + " " + curValue);

      rank = rank + 1;
      
      getJSONData(rank, HNId);

      // push_HN_link("HN ID = " + HNId, "https://news.ycombinator.com/item?id="+HNId);
    }
  }, onError);
}

function getJSONData(rank, HNId) {

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
        push_HN_link(rank+"--", JSON_data.title, "https://news.ycombinator.com/item?id="+HNId);
      } else if (JSON_data.text != null) {
        console.log("JSON text data " + JSON_data.text);
        push_HN_link(rank+"--", JSON_data.text, "https://news.ycombinator.com/item?id="+HNId);
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


function unicodeToChar(text) {
   return text.replace(/\\x[\dA-F]{4}/gi, 
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\x/g, ''), 16));
          });
}


/*
 * convertion routine from a hexadecimal value to a character
 * borrowed it from http://www.rishida.net/tools/conversion/conversionfunctions.js
 */
function hex2char ( hex ) {
	// converts a single hex number to a character
	// note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
	// hex: string, the hex codepoint to be converted
	var result = '';
	var n = parseInt(hex, 16);
    if (n <= 0xFFFF) { result += String.fromCharCode(n); } 
	else if (n <= 0x10FFFF) {
		n -= 0x10000
		result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    	} 
	else { result += 'hex2Char error: Code point out of range: '+dec2hex(n); }
	return result;
	}

/*
 * borrowed from http://www.rishida.net/tools/conversion/conversionfunctions.js
 */
function convertHexNCR2Char ( str ) { 
	// converts a string containing &#x...; escapes to a string of characters
	// str: string, the input
	
	// convert up to 6 digit escapes to characters
	str = str.replace(/&#x([A-Fa-f0-9]{1,6});/g, 
					function(matchstr, parens) {
            var ch = hex2char(parens);
            return ch;
						}
						); 
	return str;
	}

function truncate(string,length){

    // string = unicodeToChar(string);
    // string = string.replace(/&#x27;/g, '\'');
    // string = decodeURIComponent(JSON.parse(string));
    string = convertHexNCR2Char(string);
    string = string.replace(/&gt;/g, '>');
    string = string.replace(/&lt;/g, '<');
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/&apos;/g, "'");
    string = string.replace(/&amp;/g, '&');

   if (string.length > length)
      return string.substring(0,length)+'...';
   else
      return string;
};



function push_HN_link(number, text, link) {

  // for each link, it is abstracted into a paragraph.
  var row = document.createElement("tr");
  
  var col1 = document.createElement("td");
  var indexText = document.createTextNode(number);
  col1.style.fontFamily="Verdana, Geneva, sans-serif";
  col1.style.fontSize="10pt";
  col1.appendChild(indexText);

  var col2 = document.createElement("td")
  var textImage = document.createElement("a");
  var createAText = document.createTextNode(truncate(text,75));
  textImage.setAttribute("href", link);
  textImage.style.fontFamily="Verdana, Geneva, sans-serif";
  textImage.style.fontSize="10pt";
  textImage.appendChild(createAText);
  col2.appendChild(textImage);

  row.appendChild(col1);
  row.appendChild(col2);
  document.body.appendChild(row);  
}


/*
Assign beastify() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(beastify);
