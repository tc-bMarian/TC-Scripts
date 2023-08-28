// ==UserScript==
// @name        Kiet 2.0
// @namespace   Violentmonkey Scripts
// @match       https://login.tigerconnect.com/app/messenger/
// @grant       none
// @version     1.0
// @author      -
// @description 3/20/2023, 10:04:16 AM
// ==/UserScript==

// pings a local Flask API
async function sendOpenAI(query){
  const url = 'http://localhost:3000/';
  //console.log(query)
  const data = { secret: '22', question: query, history: "" };
  //console.log("data");
  //console.log(data);
  let AIResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((response) => response.json())
  .then((responseJSON) => {
       // do stuff with responseJSON here...
       //console.log(responseJSON);
      sendMessage(responseJSON);
  });
  //.then(response => response.text())
  //.then(data => console.log(data))
  //.catch(error => console.error(error));
  console.log("data?");
  //console.log(data);
  //let AIResponseJSON = await AIResponse.json();
  return AIResponse;
  //console.log(response.text());
  //return Promise.resolve(response.text());
}

// string input. I guess JS isn't strongly typed?
// doesn't trigger the quickReply to be chat. Use sendMessage
function writeMessage(message){
  //adds text. Not sure if I want to pull the chatBox variable each time? Eh, if it works it works amirite
  chatBox = document.getElementsByClassName("tc-MessageBodyInput__input tc-MessageBodyInput__input--body--short");
  console.log(chatBox)
  var content = document.createTextNode(message);
  chatBox[0].appendChild(content)
}

function sendMessage(message){
  // tc-MessageForm__send-button tc-MessageForm__send-button--isSendable
  //btn.classList.remove("tc-MessageForm__send-button--quickReply")
  //btn.classList.add("tc-MessageForm__send-button--isSendable")
  console.log(message);
  btn = document.getElementsByClassName("tc-MessageForm__send-button tc-MessageForm__send-button--quickReply")[0] // will fail if you type before object declaration as the quickReply class becomes the send class. could add logic to catch that here. except try basically
  document.execCommand('insertText', false, message["answer"]);
  btn.click();
}

// didn't quite work?
async function waitAndSendLogic(message){
  console.log("I hate");
  response = await sendOpenAI(message);
  console.log("javascript");
  console.log(await response);
  sendMessage(await response);//.json()["answer"]);
}



(function() {
    //'use strict';
  const regex = /"Linkify\">(.*?)</;
  const keyWord = /Kiet 2.0:(.*?)$/;

  setTimeout(function() {
      console.log("loading Artificial Intelligence 0.005")



      let observer = new MutationObserver(mutationRecords => {
        //console.log("mutating");
        for (let mutation of mutationRecords) {
          //console.log(mutation);
          for(let node of mutation.addedNodes) {
            s = node.outerHTML // Any new nodes added. Aka new messages recieved.
            //console.log(s)
            l = s.match(regex) // Uses our regex matching to get the message content
            //console.log(l)
            if (keyWord.test(l)) {
              message = l[1].match(keyWord);
              waitAndSendLogic(message[1]); // replace just with sendOpenAI
              //response = sendOpenAI(message[1]);
              //sendMessage(response);
            }

          }
        }

      });
      elem = document.getElementsByClassName("tc-GroupedMessagesList__list")[0]
      console.log(elem)

      // observe everything except attributes
      observer.observe(elem, {
        childList: true, // observe direct children
        subtree: true, // and lower descendants too
        //characterDataOldValue: true // pass old data to callback
      });
  }, 90000);


})();





























