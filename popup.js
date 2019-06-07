/**
 * Based on current asset screen:
 * 1. Show player name in pop-up
 * 2. Show button to open the other views
 * 
 * When clicked:
 * - grab the player name from this page
 * - send player name to the extension to open tabs & do further actions
 */

 console.log('fired')


let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {

    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
        {file: 'content-script.js'}
          );
    });
  };