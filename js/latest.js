const API_KEY = '04565bff03b7575bcd4dd06a8d2b5007';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMAGE_BASE = 'http://image.tmdb.org/t/p/w300';

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
                const isMovie = item.media_type ? item.media_type === 'movie' : type !== 'tv';
                const tmdbId = item.id;
                const popularity = item.popularity;
                const embedUrl = isMovie ? 
                    `https://vidsrc.icu/embed/movie/${tmdbId}` :
                    `https://vidsrc.icu/embed/tv/${tmdbId}/1/1`;
                
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <div>
                    <img src="${IMAGE_BASE}${item.poster_path}" alt="${item.title || item.name}" onclick="askForEpisode('${embedUrl}', ${tmdbId},${isMovie})">
                    <h3>${item.title || item.name}</h3>
                    </div>
                    <div>
                    <p> ${item.release_date ? item.release_date: 'N/A'}</p>
                    <p id="popularity">${item.popularity ? item.popularity: 'N/A'}</p>
                    </div>
                `;
                container.appendChild(movieCard);
            });
        });
}
function askForEpisode(url,tmdbId,isMovie){
    console.log(isMovie)
    if(isMovie)
        {openMovie(url)}
    else
        {
            const popup = document.createElement('div');
            popup.innerHTML = `
                <div id="popUp" >
                    <div ">
                        <h3>Enter Episode</h3>
                        <div>
                            <input type="number" id="season" placeholder="Season" min="1" ">
                        </div>
                        <div>
                            <input type="number" id="episode" placeholder="Episode" min="1" ">
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <button id="cancel" s>Cancel</button>
                            <button id="watch" >Watch</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);

            popup.querySelector('#cancel').onclick = () => popup.remove();
            popup.querySelector('#watch').onclick = () => {
                const s = popup.querySelector('#season').value || 1;
                const e = popup.querySelector('#episode').value || 1;
                popup.remove();
                var newurl=`https://vidsrc.icu/embed/tv/${tmdbId}/${s}/${e}`;
                openMovie(newurl)
            };
        }
}


function openMovie(url) {
    window.open(url, '_blank');
}

// Load trending by default
loadMovies('trending');