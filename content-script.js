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
        sellButton.id = "sellButton";

        let buttonText = document.createTextNode("SELL");
        sellButton.appendChild(buttonText);

        sellButton.addEventListener("click", _sellClicked)

        player.querySelector(".box-outercard").appendChild(sellButton);
    }

}


function _sellClicked(e) {

    let node = this.parentNode.parentNode

    let listItem = node.querySelector('.box-innercard .description ul li:nth-child(6)')

    // let sn2019 = listItem.querySelector('span:nth-child(1)').innerHTML
    let snMlbc = listItem.querySelector('span:nth-child(2)').innerHTML
    snMlbc = snMlbc.replace('MLBC SN# ', '')
    snMlbc = snMlbc.trim()


    let playerName = node.querySelector(".show-name").textContent;
    let name = playerName.substr(0, playerName.indexOf("#"));

    // let playerUrlString = name.replace(" ", "-");

    let iframes = document.querySelectorAll('iframe')
    for (let i of iframes) {
        i.remove()
    }



    var iframe = document.createElement('iframe');
    iframe.src  = chrome.extension.getURL ('iframe.html?name='+ name + '&sn='+ snMlbc);

    iframe.setAttribute("style", "position: fixed; bottom: 0; width: 100%; height: 500px");




    document.body.appendChild(iframe);


    // iframe.contentWindow.document.body.appendChild(iframeScript)

}
