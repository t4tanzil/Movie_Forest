const API_KEY = '04565bff03b7575bcd4dd06a8d2b5007';
const IMAGE_BASE = 'http://image.tmdb.org/t/p/w300';
const info = JSON.parse(localStorage.getItem("mediaInfo"));
const isTV = info.mediaType === "tv";
console.log(info.mediaType)
// Elements
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const overview = document.getElementById("overview");
const genres = document.getElementById("genres");
const cast = document.getElementById("cast");
const production = document.getElementById("production");
const country = document.getElementById("country");
const duration = document.getElementById("duration");
const watchBtn = document.getElementById("Watch");

// TV-only
const seriesControl = document.getElementById("seriesControl");
const seasonSelect = document.getElementById("seasonSelect");
const episodeList = document.getElementById("episodeList");

// Fetch main details
fetch(`https://api.themoviedb.org/3/${info.mediaType}/${info.tmdbId}?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    poster.src = IMAGE_BASE + data.poster_path;
    title.textContent = data.title || data.name;
    overview.textContent = data.overview;
    genres.textContent = data.genres.map(g => g.name).join(', ');
    production.textContent = (data.production_companies || []).map(p => p.name).join(', ');
    country.textContent = (data.production_countries || []).map(c => c.name).join(', ');
    duration.textContent = isTV ? `${data.episode_run_time[0]} m` : `${data.runtime} m`;

    if (isTV) {
      seriesControl.style.display = "block";
      populateSeasons(info.tmdbId, data.number_of_seasons);
    }
  });

// Fetch cast
fetch(`https://api.themoviedb.org/3/${info.mediaType}/${info.tmdbId}/credits?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    cast.textContent = data.cast.slice(0, 6).map(a => a.name).join(', ');
  });

  function populateSeasons(tvId, totalSeasons) {
    const seasonBoxes = document.getElementById("seasonBoxes");
    seasonBoxes.innerHTML = ''; // clear old boxes if any
  
    for (let i = 1; i <= totalSeasons; i++) {
      const box = document.createElement("div");
      box.className = "season-box";
      box.textContent = `Season ${i}`;
      box.addEventListener("click", () => {
        // Highlight active box
        document.querySelectorAll(".season-box").forEach(b => b.classList.remove("active"));
        box.classList.add("active");
  
        fetchEpisodes(tvId, i);
      });
  
      seasonBoxes.appendChild(box);
    }
  
    // Simulate click on first season
    seasonBoxes.firstChild.click();
  }
  

function fetchEpisodes(tvId, seasonNumber) {
    fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(season => {
        episodeList.innerHTML = '';
        season.episodes.forEach(ep => {
          const epDiv = document.createElement('div');
          epDiv.classList.add('episode-box');
          epDiv.innerHTML = `
            <img src="${ep.still_path ? IMAGE_BASE + ep.still_path : 'Img/No-Image-Placeholder.png'}" alt="Ep ${ep.episode_number}" />
            <div>
              <h4>Ep ${ep.episode_number}: ${ep.name}</h4>
              <p>${ep.overview || 'No summary available.'}</p>
            </div>
          `;
          epDiv.onclick = () => {
            const url = `https://vidsrc.icu/embed/tv/${tvId}/${seasonNumber}/${ep.episode_number}`;
            window.open(url, '_blank');
          };
          episodeList.appendChild(epDiv);
        });
      });
  }
  
if(!isTV){
    watchBtn.style="display=block;"
watchBtn.addEventListener("click", () => {
    console.log(info.tmdbId)
   const url=`https://vidsrc.icu/embed/movie/${info.tmdbId}`;
  window.open(url, '_blank');
});
}
