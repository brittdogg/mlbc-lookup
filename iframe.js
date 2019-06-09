let playerName = getParameterByName("name")
let playerSn = getParameterByName("sn")
let season = getParameterByName("season")

playerName = playerName.trim()
playerSn = playerSn.trim()


loadCryptoslam(playerName, playerSn, season)




async function loadCryptoslam(playerName, playerSn, season) {


    //Show item info
    let mint = await fetchMint(playerSn, season);
    loadItemInfo(mint, playerSn, season);

    //Show token sales
    let tokenSales = await fetchTokenSales(playerSn);
    loadTokenSales(tokenSales, playerSn);

    //Show player sales
    let playerSales = await fetchPlayerSales(playerName);
    loadPlayerSales(playerSales, playerName);

    //Show marketplace
    let marketplace = await fetchMarketplace(playerName);
    loadMarketplace(marketplace, playerName);


    let playerStats = await fetchMlbStats(mint, playerName)
    loadPlayerStats(playerStats)

    document.getElementById('closeIframe').addEventListener('click', function () {
        closeIframe()
    })


    document.getElementById('spinner').remove()


}





function loadMarketplace(marketplace, playerName) {

    if (marketplace) {

        $('#market-table').DataTable({
            "order": [0, 'desc'],
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

        document.getElementById('market-table-wrapper').style.display = "block";
    }
}

function loadPlayerSales(playerSales, playerName) {


    if (playerSales) {

        $('#player-sales-table').DataTable({
            "order": [0, 'desc'],
            'searching': false,
            'lengthChange': false,
            'pagingType': 'simple_numbers',
            data: convertJsonArray(playerSales),
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
                { title: "$ Price", className: 'price' }
            ]
        });

        document.getElementById('player-sales-table-wrapper').style.display = "block";
    }

}

function loadTokenSales(tokenSales, playerSn) {

    if (tokenSales) {

        $('#token-table').DataTable({
            "order": [0, 'desc'],
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
                { title: "$ Price", className: 'price' }
            ]
        });

        document.getElementById('token-table-wrapper').style.display = "block";
    }

}

function loadItemInfo(mint, playerSn, season) {

    if (mint) {

        let itemDiv = document.getElementById('item-info');
        itemDiv.appendChild(buildInfo(mint.Items ? mint.Items[0] : null));

    }

}



function loadPlayerStats(stats) {

    if (!stats) return

    if (stats.hitting && stats.hitting.length > 0) {

        $('#hitting-table').DataTable({
            "order": [0, 'asc'],
            'searching': false,
            'lengthChange': false,
            'paging': false,
            'info': false,
            data: convertJsonArray(stats.hitting),
            columns: [
                { title: "YEAR" },
                { title: "LG" },
                { title: "TM" },
                { title: "G" },
                { title: "AB" },
                { title: "R" },
                { title: "H" },
                { title: "2B" },
                { title: "3B" },
                { title: "HR" },
                { title: "RBI" },
                { title: "SB" },
                { title: "CS" },
                { title: "BB" },
                { title: "SO" },
                { title: "AVG" },
                { title: "OBP" },
                { title: "SLG" },
                { title: "OPS"}
            ]
        });

        document.getElementById('hitting-table-wrapper').style.display = "block";
    }

    if (stats.pitching && stats.pitching.length > 0) {

        $('#pitching-table').DataTable({
            "order": [0, 'asc'],
            'searching': false,
            'lengthChange': false,
            'paging': false,
            'info': false,
            data: convertJsonArray(stats.pitching),
            columns: [
                { title: "YEAR" },
                { title: "LG" },
                { title: "TM" },
                { title: "W" },
                { title: "L" },
                { title: "ERA" },
                { title: "G" },
                { title: "GS" },
                { title: "SV" },
                { title: "IP" },
                { title: "H" },
                { title: "R" },
                { title: "ER" },
                { title: "HR" },
                { title: "BB" },
                { title: "IBB" },
                { title: "SO" }
            ]
        });

        document.getElementById('pitching-table-wrapper').style.display = "block";
    }

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


    divElement.setAttribute("class", 'card col-md-12')

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


async function fetchPlayerSales(playerName) {

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


async function fetchMarketplace(playerName) {

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


async function fetchMint(sn, season) {

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



async function fetchTokenSales(sn) {

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


async function fetchMlbStats(mint, playerName) {

    if (!mint || !mint.Items || !mint.Items[0]) return undefined

    let mintItem = mint.Items[0]

    let playerInfo = await findPlayerId(playerName, mintItem.Season, mintItem.Team)

    let firstSeason = await getFirstSeason(playerInfo.player_id)

    let hittingSeasons = []
    let pitchingSeasons = []
    for (let season = firstSeason; season <= 2019; season++) {

        let hitting = await getHittingStats(playerInfo.player_id, season)
        hittingSeasons = hittingSeasons.concat(hitting)

        let pitching = await getPitchingStats(playerInfo.player_id, season)
        pitchingSeasons = pitchingSeasons.concat(pitching)
    }

    


    let hittingTranslated = []
    for (let row of hittingSeasons) {
        if (!row) continue
        hittingTranslated.push({
            season: row.season,
            league: row.league ,
            team: row.team_abbrev,
            g: row.g,
            ab: row.ab,
            r: row.r, 
            h: row.h,
            doubles: row.d,
            triples: row.t,
            hr: row.hr,
            rbi: row.rbi,
            sb: row.sb,
            cs: row.cs,
            bb: row.bb,
            so: row.so,
            avg: row.avg,
            obp: row.obp,
            slg: row.slg,
            ops: row.ops
        })
    }




    let pitchingTranslated = []
    for (let row of pitchingSeasons) {
        if (!row) continue
        pitchingTranslated.push({
            season: row.season,
            league: row.league ,
            team: row.team_abbrev,
            w: row.w,
            l: row.l,
            era: row.era,
            g: row.g,
            gs: row.gs,
            sv: row.sv,
            ip: row.ip,
            h: row.h,
            r: row.r,
            er: row.er,
            hr: row.hr,
            bb: row.bb,
            ibb: row.ibb,
            so: row.so
        })
    }

    return {
        hitting: hittingTranslated,
        pitching: pitchingTranslated
    }

}


async function findPlayerId(playerName, season, teamName) {

    let url = `https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code=%27mlb%27&active_sw=%27Y%27&name_part=%27${playerName}%25%27`

    let result = await fetch(url)
    let parsed = JSON.parse(await result.text())

    //Could have multiple results. If there's a single result it puts it in an object instead of an array. Fix that.
    let playerMatches = parsed.search_player_all.queryResults.row

    if (!isIterable(playerMatches)) {
        playerMatches = [playerMatches]
    }

    let matchingPlayer = false
    for (let playerMatch of playerMatches) {
        if (!playerMatch) continue
        let teams = await getTeamsForPlayerAndSeason(playerMatch.player_id, season)

        for (let team of teams) {
            if (team.team == teamName) {
                matchingPlayer = playerMatch
            }
        }
    }

    return matchingPlayer
}

async function getTeamsForPlayerAndSeason(playerId, season) {

    let url = `https://lookup-service-prod.mlb.com/json/named.player_teams.bam?season=${season}&player_id=${playerId}`
    let result = await fetch(url)
    let parsed = JSON.parse(await result.text())

    let results = parsed.player_teams.queryResults.row

    if (!isIterable(results)) {
        results = [results]
    }

    return results
}


async function getFirstSeason(playerId) {

    let url = `https://lookup-service-prod.mlb.com/json/named.player_teams.bam?player_id=${playerId}`
    let result = await fetch(url)
    let parsed = JSON.parse(await result.text())

    let results = parsed.player_teams.queryResults.row

    if (!isIterable(results)) {
        results = [results]
    }

    let firstSeason = 0

    for (let result of results) {

        if (result.league_season < firstSeason || !firstSeason) {
            firstSeason = result.league_season
        }

    }

    return firstSeason
}




async function getHittingStats(playerId, season) {

    if (!playerId) return []

    let url = `https://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season=${season}&player_id=${playerId}`
    let result = await fetch(url)
    let parsed = JSON.parse(await result.text())

    let results = parsed.sport_hitting_tm.queryResults.row

    if (!isIterable(results)) {
        results = [results]
    }

    return results
}

async function getPitchingStats(playerId, season) {

    if (!playerId) return []

    let url = `https://lookup-service-prod.mlb.com/json/named.sport_pitching_tm.bam?league_list_id='mlb'&game_type='R'&season=${season}&player_id=${playerId}`
    let result = await fetch(url)
    let parsed = JSON.parse(await result.text())

    let results = parsed.sport_pitching_tm.queryResults.row

    if (!isIterable(results)) {
        results = [results]
    }

    return results
}


/**
 * 
 * End service 
 */

function renderDate(data, type, row, meta) {

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


function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
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