chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("hello world");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            // pageUrl: {urlMatches: 'https://mlbc.app/figure/*'},
            pageUrl: {urlMatches: 'https://mlbc.app/profile/figures'}
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  });

  // When receiving a message (that includes player name), it should:
  // - replace strings in the player name with dashes for use in urls
  // - create two tabs: 1 for cryptoslam w/player name url, 1 for mlbc marketplace
  // - send the player name to the mlbc marketplace tab
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // alert("HELLO " + request.player);
      // sendResponse({farewell: request.player});

      let playerNameAndNumber;
      let playerName;
      let playerUrlString = request.player.replace(" ", "-");

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // TODO Instead, create a custom page with two frames & pass the player name to it.
        chrome.tabs.create({url: "https://cryptoslam.io/player/" + playerUrlString}, function(tab){console.log("hello create tab")});
        chrome.tabs.create({url: "https://mlbc.app/marketplace"}, function(newTab) {
          chrome.tabs.executeScript(newTab.id, {file: "lib/jquery-3.3.1.min.js"}, function(result) {
          chrome.tabs.executeScript(newTab.id, {file: "mlb-search.js"}, function(result) {
            chrome.tabs.sendMessage(newTab.id, {player: request.player});
          });
        });
        });
        // chrome.tabs.sendMessage(tabs[1].id, {greeting: hello}, function(response) {
        //   console.log("Hi, I sent a message I guess");
        // });
      })
    });
