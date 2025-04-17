const input = document.getElementById("movieUrl");
const movie = document.getElementById("movie");
const series = document.getElementById("series");
const Watch = document.getElementById("Watch");
const inputs=document.querySelector(".inputs")
const seriesCreds=document.querySelector("#seriesControl")

let movieselected = true;
document.querySelector("#buttonLatest").addEventListener("click",function(){
    window.location.href = "./latest.html";
});
document.querySelector("#buttonTutorial").addEventListener("click",function(){
    window.location.href = "./tutorial.html";
});
document.querySelector("#buttonCoffee").addEventListener("click",function(){
    window.location.href = "https://buymeacoffee.com/t4tanzil";
});
function watchmovie() {
    const rawUrl = input.value.trim(); // Get value when the button is clicked
    console.log(rawUrl);
    
    const movieId = extractMovieId(rawUrl);
    if (movieId) {
        const finalUrl = `https://vidsrc.icu/embed/movie/${movieId}`;

        window.open(finalUrl, '_blank'); 
    }
};
function watchseries() {
    const rawUrl = input.value.trim(); // Get value when the button is clicked
    console.log(rawUrl);
    var season = document.getElementById("season").value.trim();
    var episode = document.getElementById("episode").value.trim();
    const movieId = extractMovieId(rawUrl);
    if (movieId) {
        const finalUrl = `https://vidsrc.icu/embed/tv/${movieId}/${season}/${episode}`;
        window.open(finalUrl, '_blank'); // Open the URL in a new tab
    }
};


Watch.addEventListener("click",sentToVdo);
function sentToVdo(){
    console.log(movieselected);
    if(movieselected){
        watchmovie() 
    }
    else{
        watchseries();
        
    }
    const existingSeason = document.getElementById("season");
    const existingEpisode = document.getElementById("episode");
    movieselected = false;
    if (existingSeason) {
        existingSeason.remove();
    }
    if (existingEpisode) {
        existingEpisode.remove();
    }
}




movie.addEventListener("click",movieinput);
function movieinput(){
    movieselected = true;
    console.log("1");
    const existingSeason = document.getElementById("season");
    const existingEpisode = document.getElementById("episode");

    if (existingSeason) {
        existingSeason.remove();
    }
    if (existingEpisode) {
        existingEpisode.remove();
    }
    
}

series.addEventListener("click",seriesinputs);
function seriesinputs() {
    console.log("2");
    // Check if the inputs already exist before creating them
    const existingSeason = document.getElementById("season");
    const existingEpisode = document.getElementById("episode");
    movieselected = false;
    if (existingSeason) {
        existingSeason.remove();
    }
    if (existingEpisode) {
        existingEpisode.remove();
    }


        var season = document.createElement("input");
        season.type = "number";
        season.id = "season";
        season.value = 1;
        season.placeholder = "Season";

        var episode = document.createElement("input");
        episode.type = "number";
        episode.id = "episode";
        episode.value = 1;
        episode.placeholder = "Episode";

        
        seriesCreds.appendChild(season);
        seriesCreds.appendChild(episode);
    
}

function extractMovieId(url) {
    const imdbMatch = url.match(/tt\d+/);
    const tmdbMatch = url.match(/\/(\d+)$/);

    if (imdbMatch) {
        return imdbMatch[0];  // IMDb ID
    } else if (tmdbMatch) {
        return tmdbMatch[1];  // TMDb ID
    } else {
        const existingimportedNotice1 = document.getElementById("importedNotice1");
                
        if (existingimportedNotice1) {
            existingimportedNotice1.remove();
        }
         var importedNotice1 = document.createElement("p");
         importedNotice1.id = "importedNotice1";
         importedNotice1.textContent = "Invalid Link , Input/Select The Correct Link."
         inputs.appendChild(importedNotice1);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        let target = event.target;
        let targetImg = event.target;

        // Ensure the clicked element is an anchor tag inside the search results
        while (target && target.tagName !== "A") {
            target = target.parentElement;
        }


        if (target && target.href) {
            console.log(target.href)
            event.preventDefault();
            navigator.clipboard.writeText(target.href).then(() => {
                //console.log("Copied to clipboard:", target.href);
                input.value = extractMovieId(target.href);
                resultsDiv.innerHTML = "";
                 // Trigger the close button click to close the search results
                 var tempImg = document.createElement("img");
                 tempImg.setAttribute("src",`${targetImg.src}`);
                 tempImg.alt = targetImg.alt;
                 tempImg.id = "poster";


                 if(targetImg.alt==="video.tv_show"){
                    movieselected=false;
                    console.log(movieselected);
                    seriesinputs();
                 }
                 else{
                    movieselected=true; 
                    
                 }
                 inputs.appendChild(tempImg);

                 
                 Watch.scrollTo({
                    top: Watch.offsetTop,
                    behavior: "smooth"
                });
                 const existingimportedNotice = document.getElementById("importedNotice");
                
                if (existingimportedNotice) {
                    existingimportedNotice.remove();
                }
                 var importedNotice = document.createElement("p");
                 importedNotice.id = "importedNotice";
                 importedNotice.textContent = "ID Import successful"
                 inputs.appendChild(importedNotice);
       
            }).catch(err => {
                console.error("Failed to copy:", err);
            });
        }
    });
});


const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const resultsDiv = document.getElementById("results");

const apiKey = "AIzaSyDZ6Rq43iVhjpeRWqbafT-dWSf0WC7F_bo";  
const cx = "f747e2c76044f4249"; 

searchBtn.addEventListener("click", function () {
    const query = searchQuery.value.trim();
    if (query) {
        fetchSearchResults(query);
    }
});

async function fetchSearchResults(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error("Error fetching search results:", error);
        resultsDiv.innerHTML = `<p>Error fetching results.</p>`;
    }
}

function displayResults(data) {
    resultsDiv.innerHTML = ""; // Clear previous results
console.log(data)
    if (!data.items) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.items.forEach(item => {
        let resultItem = document.createElement("div");
        resultItem.innerHTML = `
            
            <a href="${item.link}" target="_blank">
            <img src="${item.pagemap.cse_image[0].src}" alt="${item.pagemap.metatags[0]["og:type"]}")">
            </a>
            <p>
            ${item.title}
            </p>`;
            
        resultsDiv.appendChild(resultItem);
    });
}

fetch('a.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('latestBody').innerHTML = html;
  });