// get access to this page
// scroll down to the search bar
// enter player name in search bar

// console.log(playerName);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("doing stuff...");
      // alert("HELLO " + request.player);
      // sendResponse({farewell: request.player});
      playerName = request.player;
      doStuff();
    });

// window.onload = function() {
    function doStuff() {
        console.log("onload complete");
        // let body = document.getElementsByTagName("body")[0];
        //     console.log(body);

        // let appRoot = document.getElementsByTagName("app-root")[0];
        // console.log(appRoot);

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
          
          async function demo() {
            console.log('Taking a break...');
            await sleep(2000);
            console.log('Two seconds later');
            let searchBar = document.querySelector("input");
            console.log(searchBar);
            searchBar.scrollIntoView();
            searchBar.value = playerName.trim();
            var e = jQuery.Event("keydown");
            e.which = 32; // # Some key code value
            $("input").trigger(e);
            await sleep(1000);
            console.log($("fieldset > button")[0]);
            $("fieldset > button")[0].click();
            // document.querySelector("fieldset").querySelector("button").click();
            // var f = jQuery.Event("keydown");
            // f.which = 13; // # Some key code value
            // $("input").trigger(f);
          }
          
          demo();

    }

    var ev = new KeyboardEvent('keydown', {altKey:false,
        bubbles: true,
        cancelBubble: false, 
        cancelable: true,
        charCode: 0,
        code: " ",
        key: " ",
        ctrlKey: false,
        isComposing: false,
        isTrusted: true,
        key: " ",
        shiftKey: false,
        type: "keydown"
    });