var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.sellButton { background: #cccccc; color: #000000; width: 100%; text-align: right; }';


document.head.appendChild(style)


window.addEventListener('message', function(e) {
    if (e.data == "closeiframe") {
        closeIframe()
    }
 });






// Select the node that will be observed for mutations
var targetNode = document.body;

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };


var observer = new MutationObserver(function(mutationsList) {
    for(var mutation of mutationsList) {

        if (mutation.type == 'childList') {

            let nodes = _getNodesWithName(mutation.addedNodes, "ES-ASSETVIEW-CARD")

            if (nodes.length > 0) {
                _decorateCards(nodes)
            }   
        }
    }
});

// Start observing the target node for configured mutations
observer.observe(targetNode, config);






function _getNodesWithName(nodes, name) {

    let matches = []

    for (let addedNode of nodes) {

        if (addedNode && addedNode.attributes) {
            let nodeName = addedNode.nodeName

            if (nodeName == name) {
                matches.push(addedNode)
            }
        }
    }

    return matches

}



function _decorateCards(playerCards) {

    for (let player of playerCards) {

        // prevent adding multiple sell buttons to the same card.
        if (player.querySelector(".box-outercard").querySelector("#sellButton") != undefined) {
            break;
        }

        let sellButton = document.createElement("BUTTON");
        sellButton.setAttribute("class", "sellButton");

        let buttonText = document.createTextNode("Lookup ⚾");
        sellButton.appendChild(buttonText);

        sellButton.addEventListener("click", _sellClicked)

        player.querySelector(".box-outercard").parentNode.appendChild(sellButton);
    }

}


function _sellClicked(e) {

    let node = this.parentNode.parentNode

    let listItem = node.querySelector('.box-innercard .description ul li:nth-child(6)')

    let yearElement = listItem.querySelector('span:nth-child(1)')
    let yearText = yearElement.innerHTML

    let season = yearText.substr(0, 4)

    let snElement = listItem.querySelector('span:nth-child(2)')

    let snMlbc
    if (snElement) {
        snMlbc = snElement.innerHTML
        snMlbc = snMlbc.replace('MLBC SN# ', '')
        snMlbc = snMlbc.trim()
    }

    let playerName = node.querySelector(".show-name").textContent;
    let name = playerName.substr(0, playerName.indexOf("#"));

    // let playerUrlString = name.replace(" ", "-");

    let iframes = document.querySelectorAll('iframe')
    for (let i of iframes) {
        i.remove()
    }



    var iframe = document.createElement('iframe');
    iframe.src  = chrome.extension.getURL ('iframe.html?name='+ name + '&sn='+ snMlbc + '&season=' + season);

    iframe.setAttribute("style", "position:fixed; top: 0; left: 0; bottom: 0; right: 0; height: 100%; width: 100%; margin: 0; padding: 0; background: #000000; z-index: 101;")

    document.body.appendChild(iframe);

}



function closeIframe() {
    let iframes = document.querySelectorAll('iframe')
    for (let i of iframes) {
        i.remove()
    }

}