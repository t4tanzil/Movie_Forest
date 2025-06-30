const API_KEY = '04565bff03b7575bcd4dd06a8d2b5007';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMAGE_BASE = 'http://image.tmdb.org/t/p/w300';
const latest_movie_search = document.getElementById('latest_movie_search');
let currentPage = 1;
let currentType = 'trending';
let movietypePre="movie"

//populate the latest page
function loadMovies(type, page = 1) {
    let url;
    currentType = type;
    currentPage = page;

    switch (type) {
        case 'trending':
            url = `${BASE_URL}trending/all/week?api_key=${API_KEY}&page=${page}`;
            movietypePre = "movie";
            break;
        case 'latest':
            url = `${BASE_URL}movie/now_playing?api_key=${API_KEY}&page=${page}`;
            movietypePre = "movie";
            break;
        case 'movie':
            url = `${BASE_URL}movie/popular?api_key=${API_KEY}&page=${page}`;
            movietypePre = "movie";
            break;
        case 'tv':
            url = `${BASE_URL}tv/top_rated?api_key=${API_KEY}&page=${page}`;
            movietypePre = "tv";
            break;
        default:
            return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            updatePagination(data.total_pages);
            const container = document.getElementById('movie-container');
            container.innerHTML = '';
            data.results.forEach(item => {
                const mediaType = item.media_type ? item.media_type : movietypePre;
                const tmdbId = item.id;                
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <div>
                    <img src="${IMAGE_BASE}${item.poster_path}" alt="${item.title || item.name}" onclick="findFromGal('${mediaType}',${tmdbId})">
                    <h3>${item.title || item.name}</h3>
                    </div>
                    <div>
                    <p> ${item.release_date ? item.release_date:item.first_air_date}</p>
                    <p>Rating: <span class="rating" data-score="${item.vote_average}">${item.vote_average ? Math.round(item.vote_average * 10.5) + '%' : 'N/A'}</span></p>
                    </div>
                `;
                const ratingEl = movieCard.querySelector('.rating');
                const score = parseFloat(ratingEl.dataset.score);

                if (!isNaN(score)) {
                    if (score >= 7.5) {
                        ratingEl.classList.add('green');
                    } else if (score >= 5.5) {
                        ratingEl.classList.add('yellow');
                    } else {
                        ratingEl.classList.add('red');
                    }
                }

                container.appendChild(movieCard);
                
            });
           
            // Disable/enable prev/next buttons based on page and total_pages
            document.getElementById("prevPage").disabled = currentPage <= 1;
            document.getElementById("nextPage").disabled = currentPage >= data.total_pages;
        });
}
function findFromGal(ismovie, tmdbId) {
    const mediaType = ismovie;
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
        displayResults(data);
    } catch (error) {
        console.error("Error fetching search results:", error);
        resultsDiv.innerHTML = `<p>Error fetching results.</p>`;
    }
}

function displayResults(data) {
    resultsDiv.innerHTML = ""; // Clear previous results
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
function updatePagination(totalPages) {
    const pageNumbers = document.getElementById("pageNumbers");
    pageNumbers.innerHTML = "";

    let startPage = Math.max(1, currentPage - 5);
    let endPage = Math.min(startPage + 9, totalPages);

    if (endPage - startPage < 9) {
        startPage = Math.max(1, endPage - 9);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add("active-page");
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            loadMovies(currentType, currentPage);
        });
        pageNumbers.appendChild(pageBtn);
    }

    document.getElementById("firstPage").disabled = currentPage === 1;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
    document.getElementById("lastPage").disabled = currentPage === totalPages;
}
document.getElementById("firstPage").addEventListener("click", () => {
    currentPage = 1;
    loadMovies(currentType, currentPage);
});

document.getElementById("lastPage").addEventListener("click", () => {
    currentPage += 10; // or a large number; will get clamped by API
    loadMovies(currentType, currentPage);
});

document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    loadMovies(currentType, currentPage);
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadMovies(currentType, currentPage);
    }
});

