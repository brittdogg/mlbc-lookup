// console.log("hello MLBC");

// playerNameAndNumber = document.getElementsByClassName("show-subheading")[0].textContent;

playerCards = document.querySelectorAll("section.es-assetcard");
for (let player of playerCards) {
    // console.log("player card: ", player);
    let sellButton = document.createElement("BUTTON");
    let buttonText = document.createTextNode("SELL");
    sellButton.appendChild(buttonText);
    sellButton.addEventListener("click", function() {
        playerName = this.parentNode.parentNode.querySelector(".show-name").textContent;
        name = playerName.substr(0, playerName.indexOf("#"));
        chrome.runtime.sendMessage({player: name});
    })
    player.querySelector(".box-outercard").appendChild(sellButton);
}