let playerName = getParameterByName("name")
let playerSn = getParameterByName("sn")

let h1 = document.getElementById("name")
let h2 = document.getElementById("sn")

h1.innerHTML = playerName
h2.innerHTML = playerSn


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}