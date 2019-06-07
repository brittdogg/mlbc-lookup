window.addEventListener("load", async function() {
    await wait()
    decorateCards()
})




async function wait() {

    while(!document.querySelector(".mat-paginator-page-size-select .mat-select-value-text span")) {
        await new Promise(r => setTimeout(r, 500));
    }

    let pagingValue = document.querySelector(".mat-paginator-page-size-select .mat-select-value-text span");

    let count = parseInt(pagingValue.innerHTML) 

    let list
    do {
        await new Promise(r => setTimeout(r, 1000));
        list = document.querySelectorAll("section.es-assetcard")
    } while(list.length < count)

}


function decorateCards() {

    // add a SELL button to every player card on screen.
    let playerCards = document.querySelectorAll("section.es-assetcard");
    for (let player of playerCards) {

        // prevent adding multiple sell buttons to the same card.
        if (player.querySelector(".box-outercard").querySelector("#sellButton") != undefined) {
            break;
        }

        let sellButton = document.createElement("BUTTON");
        sellButton.id = "sellButton";

        let buttonText = document.createTextNode("SELL");
        sellButton.appendChild(buttonText);

        sellButton.addEventListener("click", sellClicked)

        player.querySelector(".box-outercard").appendChild(sellButton);
    }

}


function sellClicked(e) {

    let playerName = this.parentNode.parentNode.querySelector(".show-name").textContent;
    let name = playerName.substr(0, playerName.indexOf("#"));

    // let playerUrlString = name.replace(" ", "-");

    var iframe = document.createElement('iframe');
    iframe.src  = chrome.extension.getURL ('iframe.html');

    // iframe.setAttribute("src", "https://cryptoslam.io/player/" + playerUrlString );
    iframe.setAttribute("style", "position: fixed; bottom: 0; width: 100%; height: 100%");
    document.body.appendChild(iframe);

     // chrome.runtime.sendMessage({player: name});
}








