let playerName = getParameterByName("name")
let playerSn = getParameterByName("sn")
let season = getParameterByName("season")

playerName = playerName.trim()
playerSn = playerSn.trim()


loadCryptoslam(playerName, playerSn, season)




async function loadCryptoslam(playerName, playerSn, season) {

    //Show item info
    let mint = await loadMint(playerSn, season)
    
    if (mint) {
        let itemDiv = document.getElementById('item-info')
        itemDiv.appendChild(buildInfo(mint.Items ? mint.Items[0] : null ))
    }


    //Show token sales
    let tokenSales = await loadTokenSales(playerSn)

    if (tokenSales) {
        $('#token-table').DataTable( {
            "order": [ 0, 'desc' ],
            'searching': false,
            'lengthChange': false,
            'pagingType': 'simple_numbers',
            data: convertJsonArray(tokenSales),
            columns: [
                { 
                    title: "Date",
                    "render": renderDate
                },
                { title: "Crypto" },
                { title: "Owner", className: 'owner' },
                { title: "Equipment" },
                { title: "Stance" },
                { title: "Uniform", className: 'uniform' },
                { title: "Price", className: 'price' },
                { title: "$ Price", className: 'price'  }
            ]
        });
        document.getElementById('token-table-wrapper').style.display = "block"
    }



    //Show player sales
    let playerSales = await loadPlayerSales(playerName)
    if (playerSales) {

        $('#player-sales-table').DataTable( {
            "order": [ 0, 'desc' ],
            'searching': false,
            'lengthChange': false,
            'pagingType': 'simple_numbers',
            data: convertJsonArray(playerSales),
            columns: [
                { 
                    title: "Date",
                    "render":renderDate
                },
                { title: "Crypto" },
                { title: "Owner", className: 'owner' },
                { title: "Equipment" },
                { title: "Stance" },
                { title: "Uniform", className: 'uniform' },
                { title: "Price", className: 'price' },
                { title: "$ Price", className: 'price'  }
            ]
        });
        document.getElementById('player-sales-table-wrapper').style.display = "block"

    }




    //Show marketplace
    let marketplace = await loadMarketplace(playerName)

    if (marketplace) {

        $('#market-table').DataTable( {
            "order": [ 0, 'desc' ],
            'searching': false,
            'lengthChange': false,
            'pagingType': 'simple_numbers',
            data: convertJsonArray(marketplace),
            columns: [
                { 
                    title: "Date",
                    "render": renderDate
                },
                { title: "Crypto" },
                { title: "Owner", className: 'owner' },
                { title: "Equipment" },
                { title: "Stance" },
                { title: "Uniform", className: 'uniform' },
                { title: "Price", className: 'price' }            
            ]
        });

        document.getElementById('market-table-wrapper').style.display = "block"



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



/**
 * 
 * End view 
 */






/**
 * 
 * TODO: Create a service for these
 */


async function loadPlayerSales(playerName) {

    let url = `https://api.cryptoslam.io/api/player/${playerName}/sales?num=500&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    if (parsed.Message == "The request is invalid.") {
        return undefined
    }

    if (!parsed.Items) {
        return undefined
    }

    if (!isIterable(parsed.Items)) {
        return undefined
    }


    let records = []

    for (let record of parsed.Items) {
        records.push({
            Date: record.SoldOnUtc,
            Crypto: `<a href="https://mlbc.app/figure/${record.TokenId}" target="blank">${record.Season} ${record.Name} (${record.Base})</a>`,
            Owner: record.SellerOwnerAddress,
            Equipment: record.Equipment,
            StanceOpponent: record.StanceOpponent,
            Uniform: record.Uniform,
            PriceEth: `Ξ ${record.SalesPriceEth.toFixed(5)}`,
            PriceUSD: `$${record.SalesPriceUsd.toFixed(2)}`
        })
    }

    return records

}


async function loadMarketplace(playerName) {

    if (!playerName) return undefined

    let url = `https://api.cryptoslam.io/api/player/${playerName}/marketplace?num=500&_=${Math.floor(Date.now())}`

    let result = await fetch(url)

    let body = await result.text()

    let parsed = JSON.parse(body)

    if (parsed.Message == "The request is invalid.") {
        return undefined
    }

    if (!parsed || parsed.length == 0) {
        return undefined
    }

    if (!isIterable(parsed)) {
        return undefined
    }

    let records = []

    for (let record of parsed) {
        records.push({
            Date: record.CreatedOn,
            Crypto: `<a href="https://mlbc.app/figure/${record.TokenId}" target="blank">${record.Season} ${record.Name} (${record.Base})</a>`,
            Owner: record.OwnerDisplay,
            Equipment: record.Equipment,
            StanceOpponent: record.StanceOpponent,
            Uniform: record.Uniform,
            PriceEth: `Ξ ${record.CurrentPriceEth.toFixed(5)}`
        })
    }

    return records

}


async function loadMint(sn, season) {

    if (!sn) return undefined

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

    if (!isIterable(parsed)) {
        return undefined
    }


    let records = []

    for (let record of parsed) {
        records.push({
            Date: record.SoldOnUtc,
            Crypto: `<a href="https://mlbc.app/figure/${record.TokenId}" target="blank">${record.Season} ${record.Name} (${record.Base})</a>`,
            Owner: record.SellerOwnerAddress,
            Equipment: record.Equipment,
            StanceOpponent: record.StanceOpponent,
            Uniform: record.Uniform,
            PriceEth: `Ξ ${record.SalesPriceEth.toFixed(5)}`,
            PriceUSD: `$${record.SalesPriceUsd.toFixed(2)}`
        })
    }

    return records

}


/**
 * 
 * End service 
 */

function renderDate( data, type, row, meta ) {

    if (type == "sort") {
        return moment(data).unix()
    }

    var utc = moment.utc(data);
    var local = utc.local()

    return local.fromNow()
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


function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

function convertJsonArray(json) {

    let converted = []

    for (let row of json) {
        converted.push(json2array(row))
    }

    return converted
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }