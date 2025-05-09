const API_KEY = '04565bff03b7575bcd4dd06a8d2b5007';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMAGE_BASE = 'http://image.tmdb.org/t/p/w300';
const latest_movie_search = document.getElementById('latest_movie_search');

//populate the latest page
function loadMovies(type) {
    let url;
    switch(type) {
        case 'trending':
            url = `${BASE_URL}trending/all/week?api_key=${API_KEY}`;
            break;
        case 'latest':
            url = `${BASE_URL}movie/now_playing?api_key=${API_KEY}`;
            break;
        case 'movie':
            url = `${BASE_URL}movie/popular?api_key=${API_KEY}`;
            break;
        case 'tv':
            url = `${BASE_URL}tv/top_rated?api_key=${API_KEY}`;
            break;
        default:
            return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const container = document.getElementById('movie-container');
            container.innerHTML = '';
            data.results.forEach(item => {
                const mediaType = item.media_type ? item.media_type : 'tv';
                const tmdbId = item.id;                
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <div>
                    <img src="${IMAGE_BASE}${item.poster_path}" alt="${item.title || item.name}" onclick="findFromGal('${mediaType}',${tmdbId})">
                    <h3>${item.title || item.name}</h3>
                    </div>
                    <div>
                    <p> ${item.release_date ? item.release_date: ''}</p>
                    <p id="popularity">${item.popularity ? item.popularity: ''}</p>
                    </div>
                `;
                container.appendChild(movieCard);
            });
        });
}
function findFromGal(ismovie, tmdbId) {
    const mediaType = ismovie === 'tv' ? 'tv' : 'movie';
    localStorage.setItem("mediaInfo", JSON.stringify({ tmdbId, mediaType }));
    window.location.href = "content.html";
}
//find details from search
function findById(externalId) {
    const externalSource = 'imdb_id';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDU2NWJmZjAzYjc1NzViY2Q0ZGQwNmE4ZDJiNTAwNyIsIm5iZiI6MTc0MzY1MjI2MS4wMjgsInN1YiI6IjY3ZWUwNWE1NWYzYmQ3MjQyZTYyOWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vi8-6LK5Z4uiJNG5_vTFL6HtKp72IQ8AFjCyzcpwGB4'
        }
    };
    fetch(`https://api.themoviedb.org/3/find/${externalId}?external_source=${externalSource}`, options)
        .then(res => res.json())
        .then(res => {
            const media = res.tv_results[0] || res.movie_results[0];
            if (media) {
                const tmdbId = media.id;
                const mediaType = res.tv_results[0] ? 'tv' : 'movie';
                localStorage.setItem("mediaInfo", JSON.stringify({ tmdbId, mediaType }));
                window.location.href = "content.html";
            }
        });
}

latest_movie_search.addEventListener("click",function(){
    const searchTb = document.createElement('div');

    searchTb.innerHTML = `
        <div id="searchTb" >
            <div id="search">
                <input type="text" id="searchQuery" placeholder="Search for a Movie or TV Show">
                <button id="searchBtn">Search</button>
                <div><button id="cancel">X</button></div>
            </div>
            <div id="results"></div>
        </div>
    `;
    document.body.appendChild(searchTb);
    searchTb.querySelector('#cancel').onclick = () => searchTb.remove();
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
//show google result
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
            <img src="${item.pagemap.cse_image[0].src}" alt="${item.pagemap.metatags[0]["og:type"]}")" onclick="findById('${extractMovieId(item.link)}')">
            <p>
            ${item.title}
            </p>`;
            
        resultsDiv.appendChild(resultItem);
    });
}
});

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
         document.getElementById("results").appendChild(importedNotice1);
         return null;
    }
}

// Load trending by default
loadMovies('trending');

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search') === 'true') {
      document.getElementById("latest_movie_search")?.click();
    }
  });