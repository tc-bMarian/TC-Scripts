// ==UserScript==
// @name         Memorialize TC
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://login.tigerconnect.com/app/messenger/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tigerconnect.com
// @grant        none
// ==/UserScript==

// need to add names for peer2peer chats. Since they don't default label titles.

// If you need images you can have JS download a .eml file with email detail & formatting
// https://stackoverflow.com/questions/5620324/mailto-link-with-html-body/46699855#46699855
// https://jsfiddle.net/seanodotcom/yd1n8Lfh/

/**
 * from:
 * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 * takes a string of html and turns it into a DOM element (nodelist technically) I can inject into the page. Used to create the button.
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

// Not using this since I want more detail + images babyyy. Could be useful for other projects though.
function archiveByEmail(){
    console.log("attempting to open email");

    var email   = 'email@xxxx.com';
    var subject = 'VCI Complaint Management Question';

    var emailBody = "VM";
    var mailto_link = 'mailto:'+email+'?subject='+subject+'&body='+encodeURIComponent(emailBody);

    window.open(mailto_link,'_self');
}

// uhh, takes a HTML element (<Div>, <button>, anything really) and writes it's CSS to the 'obj' varible. I also added a line to write the CSS inline, so hopefully that works.
// looks like it worked! Now Outlook is severely limited in the CSS it accepts. And the function I'm using unfortunately, you have to type out each tag you want to import. Kinda annoying but eh.
function forEachStyle(inputDiv){
// more code needed to handle rgba
const rgbToHex = rgb => '#' + (rgb.match(/[0-9|.]+/g).map((x, i) => i === 3 ? parseInt(255 * parseFloat(x)).toString(16) : parseInt(x).toString(16)).join('')).padStart(2, '0').toUpperCase();

let obj = {}
const style = getComputedStyle(inputDiv); //
  // ,"border-bottom-color","box-sizing","border-bottom-style","border-bottom-width","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left-color","border-left-style","border-left-width","border-right-color","border-right-style","border-right-width","border-top-color","border-top-style","border-top-width", "border-width", "border-style","cursor","display","outline","outline-color","outline-style","outline-width","overflow-wrap","margin","margin-bottom","margin-left","margin-right","margin-top","min-height","min-width","white-space","word-break","padding","padding-bottom","padding-left","padding-right","padding-top","vertical-align","line-height","line-style-image","line-syle-position", "border","float"
["background-color","border-width","border-style","color", "width", "max-width","font","font-family","font-size","font-weight"]
.forEach(rule => {
  const val = style.getPropertyValue(rule)
  obj[rule] = val.includes('rgb') ? rgbToHex(val) : val;
  inputDiv.style[rule] = val.includes('rgb') ? rgbToHex(val) : val; // this line is to write the CSS inline. Here's to hoping!
})
console.log(obj)
}

// trying to loop through the nested HTML tags, and inline all the CSS so that it's not wiped by Outlook. This loops through all the nested shit of a Node.. So you gotta use a 'for loop' on the NodeList we get, with this function.
function loopThroughDivs(node) {
  divs = node.childNodes
  divs.forEach(div => {
    //console.log(div.textContent);
    ////////////////////////////////////////////////////////////////
    //////////Logic for the loop to run here////////////////////////
    ////////////////////////////////////////////////////////////////
    try{
    //console.log(getComputedStyle(div));
    forEachStyle(div);
    }
    catch(err){
    console.log(err.message)
    }
    ////////////////////////////////////////////////////////////////
    loopThroughDivs(div); // recursively loop through nested divs
  });
}

// https://stackoverflow.com/questions/5620324/mailto-link-with-html-body/46699855#46699855
// https://jsfiddle.net/seanodotcom/yd1n8Lfh/
// eh. this is getting bloated as I put all my logic in it lol. fml.
function createEML() {
  // this section handles creating the textFile that we download (the .eml)
    var textFile = null,
    makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/plain'});
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      return textFile;
    };

    var create = document.getElementById('create');// create is the button we've added to the DOM.
    create.addEventListener('mouseover', function () {//updates the downloadlink & eml file attached to that link when you mouseover the button. creative right?
    //console.log('mouseover');
    d = document.getElementsByClassName("tc-MessageItem--isSelected"); //all selected messages, gets the entire nodelist tree I believe?
    // for (let i = 0; i < d.length; i++) { // I use this below. idk if I wanna loop twice. Timing is different but shouldn't matter?
    //loopThroughDivs(d[0]); // moved it below. These two lines can probably get deleted now? if not don't forget to make 0 and i for the loop.

    var link = document.getElementById('downloadlink'); // the button

    // string header for .eml file
    // poor formatting below is because of return carriages messing up .EML files lol. Can't be fucked to figure out how to \n it all!
    s = `To: User <user@domain.demo>
Subject: TC Archive
X-Unsent: 1
Content-Type: text/html

`;

    for (let i = 0; i < d.length; i++) { //loop through all selected ?nodes?
      loopThroughDivs(d[i]); //inline all the css
      s = s + d[i].outerHTML; //add them to the .eml file
    }
    //s = s + d[0].outerHTML; // single msg test case. was used before I had the for loop for all selected messages. ignore or delete.
    //console.log(s);
      // use regex on the images here! cid:48349-3425-2462-13535.png <-- like that I believe. Not sure how to manage multidownload in 1 click. Also might be best to host the images? Time will tell.
    const regex = /src="blob:https:\/\/login\.tigerconnect\.com\/(....................................)"/gm;
    const subst = `src="cid:$1.png"`;
    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('src="blob:https:\\/\\/login\\.tigerconnect\\.com\\/', 'gm')

    // The substituted value will be contained in the result variable
    //console.log('Substitution result: ', s);
    const h = s.replaceAll(regex, subst);
    //console.log('Substitution result: ', result);`

    link.href = makeTextFile(h); // create the downloadlink
    //link.style.display = 'block';
  }, false);
}

// sometimes the button moves. Might be firing twice? I think you can add a third param (bool) to make setTimeout only execute once. Might need. haven't had this issue again.
// lol fixed itself when I added functions above. gotta love JS
(function() {
    //'use strict';

// if you wanna play around with the icon https://yqnn.github.io/svg-path-editor/
// the circle is a little small. eh. I like it enough?
    htmlBlock = `<div class="tc-SidebarHeader__icon-container" aria-label="sidebar compose new message" id="compose"><div class="theme-light Button_module_button__5cb439c5"><a download="message.eml" id="downloadlink"><button id='create' class="Button_module_base__5cb439c5 Button_module_circle__5cb439c5 Button_module_primary__5cb439c5" type="button"><div class="Button_module_icon__5cb439c5"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"><g fill="currentColor" fill-rule="evenodd"><path d="M 12 1 c -1 0 -1 0 -1.072 1.01 v 3.1 c 0 0.56 -0.315 1.07 -0.874 1.07 H 2.84 c -0.559 0 -0.698 -0.51 -0.698 -1.07 V 3.628 c 0 -0.558 0.14 -0.485 0.698 -0.485 h 8.16 c 0.559 0 1 -0.143 1 -2.143 C 12 1 6.375 1 12 1 H 2.84 C 1.183 1 0 1.97 0 3.628 v 9.16 C 0 14.446 1.183 16 2.841 16 h 9.16 C 13.66 16 15 14.446 15 12.788 V 9.686 c 0 -0.558 0 -8.686 0 -5.686 L 9 11 C 9 13 6 13 6 11 C 6 9 9 9 9 11 L 15 4"></path></g></svg></div></button></a></div></div>`
    var addButton = htmlToElement(htmlBlock); //turns the htmlBlock string into a DOM element

    console.log("made it this far?");
    setTimeout(function() { //setTimeout helps with making sure the page loads so they button gets injected to the correct spot. it's currently 6s but you can play around with that if it starts erring out. Or could have a retry if fail?
        console.log("waited 2");
        document.getElementsByClassName("tc-SidebarHeader__sidebar-btn")[0].appendChild (addButton); //append the button we created to the DOM!
        createEML(); //turns on the event listener to the button to make it work.
        //addButton.addEventListener('click',archiveByEmail,false); // old direct email approach. Using downloaded EML instead for more features (images, ect)
    }, 6000);

})();



