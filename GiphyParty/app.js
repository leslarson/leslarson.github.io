const form = document.querySelector("form");
const query = document.querySelector("input");
const searchBtn = document.querySelector("#search");
const clearBtn = document.querySelector("#clear");
const baseUrl = "https://api.giphy.com/v1/gifs/search";
const trailing = "&limit=1&api_key=ZUmleWWZwczGUmNFU3V8NR44CIVqPKSE";
const h1 = document.querySelector("H1");
const title = "GIPHY Party!";
let tIdx = 0;

form.addEventListener("submit", function(evt){
    evt.preventDefault();
    if (!query.value) {
        alert("Search phrase is empty. Please try again.");
        return;
    }
    getGiphy(query.value);
    query.value = "";
})

clearBtn.addEventListener("click", function() {
    const gifbox = document.querySelector(".gifbox");
    gifbox.innerHTML = "";
});

async function getGiphy(query) {
    try {
        const response = await axios.get(`${baseUrl}?q=${query}${trailing}`);
        console.log(response);
        if (!response.data.data.length){
            alert("No results for that search. Please try again.");
            return;
        }        
        addGiphy(response.data.data[0].images.downsized_medium.url);
    } catch(err) {
        alert("Abnormal funkiness has occurred. Please try again.");
    }
}

function addGiphy(giphy) {
    const gifparent = document.querySelector(".gifbox");
    const gifdiv = document.createElement("div")
    const gifimg = document.createElement("img");
    gifdiv.classList.add("singlegif");
    gifimg.setAttribute("src", giphy);
    gifdiv.appendChild(gifimg);
    gifparent.appendChild(gifdiv);
}

function sparkle() {
    const mySparkle = setInterval(function() {
    let newH1 = "";
    for (let i = 0; i < title.length; i++){
        if (tIdx == title.length) {
            tIdx = 0;
            clearInterval(mySparkle);
            h1.innerHTML = title;
            return;
        }
        if (tIdx == i) {
            newH1 += `<span class = "letter">${title[i]}</span>`;
        } else {
            newH1 += title[i];
        }
    }
    tIdx++;
    h1.innerHTML = newH1;
    }, 50);
}

setInterval(sparkle, 2000);
