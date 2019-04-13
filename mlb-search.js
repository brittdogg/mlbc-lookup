chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("doing stuff...");
      // alert("HELLO " + request.player);
      // sendResponse({farewell: request.player});
      playerName = request.player;
      lookup();
    });

    function lookup() {

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
          
          async function lookupSlowly() {
            await sleep(2000);
            let searchBar = document.querySelector("input");
            searchBar.value = playerName.trim();
            var inputEvent = new Event("input");
            searchBar.dispatchEvent(inputEvent);
            
            var button = document.querySelector("fieldset > button");
            var clickEvent = new Event("click");
            button.dispatchEvent(clickEvent);
            await sleep(500);
            searchBar.scrollIntoView();
          }
          
          lookupSlowly();

    }