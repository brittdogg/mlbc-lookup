let playerName = getParameterByName("name")
let playerSn = getParameterByName("sn")
let season = getParameterByName("season")

playerName = playerName.trim()
playerSn = playerSn.trim()


loadCryptoslam(playerName, playerSn, season)




async function loadCryptoslam(playerName, playerSn, season) {

    let playerSales = await loadPlayerSales(playerName)
    let marketplace = await loadMarketplace(playerName)
    let mint = await loadMint(playerSn, season)
    let tokenSales = await loadTokenSales(playerSn)

    let tokenDiv = document.getElementById('token-tab')
    let itemDiv = document.getElementById('item-info')
    let playerSalesDiv = document.getElementById('player-sales-tab')
    let marketDiv = document.getElementById('market-tab')

    if (mint) {
        itemDiv.appendChild(buildInfo(mint.Items ? mint.Items[0] : null ))
    }
    

    if (playerSales.Items) {
        playerSalesDiv.appendChild(buildSalesTable("Player Sales", playerSales.Items))
    }

    if (tokenSales) {
        tokenDiv.appendChild(buildSalesTable("Token Sales", tokenSales))
    }
    
    if (marketplace) {
        marketDiv.appendChild(buildMarketplaceTable(marketplace))
    }
    

    document.getElementById('closeIframe').addEventListener('click', function() {
        closeIframe()
    })


    document.getElementById('spinner').remove()

    
}





function buildInfo(item) {

    let divElement = document.createElement("div")

    if (!item) {
        return divElement
    } 

    let div = `
        <div class="card-body">
            <h1 class="card-title">${item.Season} ${item.Name} (${item.Base}) <span class="badge badge-secondary">${item.TokenId}</span></h5>
            <h4 class="card-subtitle mb-2 text-muted">${item.Team} #${item.UniformNumber}</h4>

            <p>
                <a href="https://mlbc.app/figure/${item.TokenId}" target="blank">View on MLBC</a> - 
                <a href="https://cryptoslam.io/mint/${item.Season}/mlb-crypto-baseball/${item.TokenId}" target="blank">View card on Cryptoslam</a> - 
                <a href="https://cryptoslam.io/player/${item.Name.replace(" ", "-")}" target="blank">${item.Name} on Cryptoslam</a>
            </p>

            <ul>
                <li><strong>Position:</strong><span>${item.Position}</span> </li>    
                <li><strong>Stance:</strong><span>${item.Stance}</span> </li>
                <li><strong>Equipment:</strong><span>${item.Equipment}</span> </li>
                <li><strong>Uniform:</strong><span>${item.Uniform}</span> </li>
                <li><strong>Event:</strong><span>${item.Ability}</span> </li>
                <li><strong>Born On:</strong><span>${item.BornOn}</span> </li>
                <li><strong>Owner:</strong><span>${item.Owner}</span> </li>
            </ul>

        </div>
    `

    
    divElement.setAttribute("class",'card col-md-12')

    divElement.innerHTML = div 

    return divElement

}


function buildSalesTable(title, sales) {

    let divElement = document.createElement("div")

    if (!sales || !sales || sales.length < 1) {
        return divElement
    }

    let table = `
        <h3>${title}</h3>
        <table class="table table-striped table-bordered table-sm col-md-12 cryptoslam-table">
            <thead>
                <th>Date</th>
                <th>Crypto</th>
                <th>Owner</th>
                <th>Equipment</th>
                <th>Stance</th>
                <th>Uniform</th>
                <th>Price</th>
                <th>$ Price</th>
            </thead>
    `
    
    for (let sale of sales) {
        table += `
            <tr>
                <td>${moment(sale.SoldOnUtc).fromNow()}</td>
                <td class="crypto"><a href="https://mlbc.app/figure/${sale.TokenId}" target="blank">${sale.Season} ${sale.Name} (${sale.Base})</a></td>
                <td class="owner">${sale.SellerOwnerAddress}</td>
                <td>${sale.Equipment}</td>
                <td>${sale.StanceOpponent}</td>
                <td class="uniform">${sale.Uniform}</td>
                <td class="price">Ξ ${sale.SalesPriceEth.toFixed(5)}</td>
                <td class="price">$${sale.SalesPriceUsd.toFixed(2)}</td>
            </tr>
        `
    }
    table += "</table></div>"

    divElement.setAttribute("class", "table-responsive")

    divElement.innerHTML = table 

    return divElement
}



function buildMarketplaceTable(listings) {

    let table = `
        <h3>Marketplace</h3>
        <table class="table table-striped table-bordered table-sm col-md-12 cryptoslam-table">
            <thead>
                <th>Date</th>
                <th>Crypto</th>
                <th>Owner</th>
                <th>Equipment</th>
                <th>Stance</th>
                <th>Uniform</th>
                <th>Price</th>
            </thead>
    `
    
    for (let listing of listings) {
        table += `
            <tr>
                <td>${moment(listing.CreatedOn).fromNow()}</td>
                <td class="crypto"><a href="https://mlbc.app/figure/${listing.TokenId}" target="blank">${listing.Season} ${listing.Name} (${listing.Base})</a></td>
                <td class="owner">${listing.OwnerDisplay}</td>
                <td>${listing.Equipment}</td>
                <td>${listing.StanceOpponent}</td>
                <td class="uniform">${listing.Uniform}</td>
                <td class="price">Ξ ${listing.CurrentPriceEth.toFixed(5)}</td>
            </tr>
        `
    }
    table += "</table></div>"

    let divElement = document.createElement("div")
    divElement.setAttribute("class", "table-responsive")


    divElement.innerHTML = table 

    return divElement
}


/**
 * 
 * End view 
 */






/**
 * 
 * TODO: Create a service for these
 */


async function loadPlayerSales(playerName) {

    let url = `https://api.cryptoslam.io/api/player/${playerName}/sales?num=25&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    if (parsed.Message == "The request is invalid.") {
        return undefined
    }


    return parsed
}


async function loadMarketplace(playerName) {

    let url = `https://api.cryptoslam.io/api/player/${playerName}/marketplace?num=25&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    if (parsed.Message == "The request is invalid.") {
        return undefined
    }


    return parsed
}


async function loadMint(sn, season) {

    let url = `https://api.cryptoslam.io/mint?season=${season}&product=MLB%20Crypto%20Baseball&tokenId=${sn}&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)


    if (parsed.Message == "The request is invalid.") {
        return undefined
    }


    return parsed

}



async function loadTokenSales(sn) {

    let url = `https://api.cryptoslam.io/api/mints/sales?tokenId=${sn}&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()


    let parsed = JSON.parse(body)

    if (parsed.Message == "The request is invalid.") {
        return undefined
    }

    return parsed

}


/**
 * 
 * End service 
 */





function closeIframe() {
    window.parent.postMessage('closeiframe', '*');
}



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

