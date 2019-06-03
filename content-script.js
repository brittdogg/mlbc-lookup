// add a SELL button to every player card on screen.
playerCards = document.querySelectorAll("section.es-assetcard");
for (let player of playerCards) {
    // prevent adding multiple sell buttons to the same card.
    if (player.querySelector(".box-outercard").querySelector("#sellButton") != undefined) {
        break;
    }
    let sellButton = document.createElement("BUTTON");
    sellButton.id = "sellButton";
    let buttonText = document.createTextNode("SELL");
    sellButton.appendChild(buttonText);
    sellButton.addEventListener("click", function() {
        playerName = this.parentNode.parentNode.querySelector(".show-name").textContent;
        name = playerName.substr(0, playerName.indexOf("#"));
        chrome.runtime.sendMessage({player: name});
    })
    player.querySelector(".box-outercard").appendChild(sellButton);
}