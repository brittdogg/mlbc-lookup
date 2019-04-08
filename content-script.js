console.log("hello MLBC");
playerNameAndNumber = document.getElementsByClassName("show-subheading")[0].textContent;
playerName = playerNameAndNumber.substr(0, playerNameAndNumber.indexOf("#"));
console.log(playerName);

// chrome.runtime.sendMessage({player: playerName}, function(response) {
//     console.log("I got a response, here it is: ", response);
// });

chrome.runtime.sendMessage({player: playerName});