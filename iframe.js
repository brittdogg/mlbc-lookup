

let playerName = getParameterByName("name")
let playerSn = getParameterByName("sn")

let h1 = document.getElementById("name")
// let h2 = document.getElementById("sn")

playerName = playerName.trim()
playerSn = playerSn.trim()

h1.innerHTML = playerName
// h2.innerHTML = playerSn



loadCryptoslam(playerName, playerSn)




async function loadCryptoslam(playerName, playerSn) {

    let sales = await loadSales(playerName)

    let marketplace = await loadMarketplace(playerName)

    let salesDiv = document.getElementById('sales-tab')
    let marketDiv = document.getElementById('market-tab')

    salesDiv.appendChild(buildSalesTable(sales))
    marketDiv.appendChild(buildMarketplaceTable(marketplace))

    document.getElementById('closeIframe').addEventListener('click', function() {
        closeIframe()
    })
    
}


function buildSalesTable(sales) {

    let table = `
        <div class="table-responsive">
            <table>
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
    
    for (let sale of sales.Items) {
        table += `
            <tr>
                <td>${moment(sale.SoldOnUtc).fromNow()}</td>
                <td class="crypto">${sale.Season} ${sale.Name} (${sale.Base})</td>
                <td class="owner">${sale.SellerOwnerAddress}</td>
                <td>${sale.Equipment}</td>
                <td>${sale.StanceOpponent}</td>
                <td>${sale.Uniform}</td>
                <td class="price">Ξ ${sale.SalesPriceEth.toFixed(5)}</td>
                <td class="price">$${sale.SalesPriceUsd.toFixed(2)}</td>
            </tr>
        `
    }
    table += "</table></div>"

    let tableElement = document.createElement("table")
    tableElement.setAttribute("class",'table table-striped table-bordered table-sm col-md-12 cryptoslam-table')

    tableElement.innerHTML = table 

    return tableElement
}



function buildMarketplaceTable(listings) {

    let table = `
        <div class="table-responsive">
            <table>
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
                <td class="crypto">${listing.Season} ${listing.Name} (${listing.Base})</td>
                <td class="owner">${listing.OwnerDisplay}</td>
                <td>${listing.Equipment}</td>
                <td>${listing.StanceOpponent}</td>
                <td>${listing.Uniform}</td>
                <td class="price">Ξ ${listing.CurrentPriceEth.toFixed(5)}</td>
            </tr>
        `
    }
    table += "</table></div>"

    let tableElement = document.createElement("table")
    tableElement.setAttribute("class",'table table-striped table-bordered table-sm col-md-12 cryptoslam-table')


    tableElement.innerHTML = table 

    return tableElement
}



async function loadSales(playerName) {

    let url = `https://api.cryptoslam.io/api/player/${playerName}/sales?num=25&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    return parsed
}


async function loadMarketplace(playerName) {

    let url = `https://api.cryptoslam.io/api/player/${playerName}/marketplace?num=25&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    return parsed
}




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

