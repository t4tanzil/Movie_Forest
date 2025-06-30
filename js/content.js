const API_KEY = '04565bff03b7575bcd4dd06a8d2b5007';
const IMAGE_BASE = 'http://image.tmdb.org/t/p/w300';
const info = JSON.parse(localStorage.getItem("mediaInfo"));
const isTV = info.mediaType === "tv";
// Elements
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const overview = document.getElementById("overview");
const genres = document.getElementById("genres");
const cast = document.getElementById("cast");
const production = document.getElementById("production");
const country = document.getElementById("country");
const duration_info = document.getElementById("duration_info");
const release_date_info=document.getElementById("release_date_info");
const duration = document.getElementById("duration");
const release_date=document.getElementById("release_date");
const body = document.querySelector("body");
const watchBtn = document.getElementById("Watch");
let useBackupServer = false;
const server1Btn = document.getElementById("server1Btn");
const server2Btn = document.getElementById("server2Btn");
// TV-only
const seriesControl = document.getElementById("seriesControl");
const seasonSelect = document.getElementById("seasonSelect");
const episodeList = document.getElementById("episodeList");

// Fetch main details
fetch(`https://api.themoviedb.org/3/${info.mediaType}/${info.tmdbId}?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(data => {
   //console.log(data)
   body.style.backgroundImage=`url("https://image.tmdb.org/t/p/original${data.backdrop_path}")`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPositionX = 'center';
  body.style.backgroundRepeat = 'no-repeat';
  //body.style.backgroundAttachment = 'fixed';
document.querySelector("nav").style.backgroundColor = "transparent";
    poster.src = IMAGE_BASE + data.poster_path;
    title.textContent = data.title || data.name;
    overview.textContent = data.overview;
    genres.textContent = data.genres.map(g => g.name).join(', ');
    production.textContent = (data.production_companies || []).map(p => p.name).join(', ');
    country.textContent = (data.production_countries || []).map(c => c.name).join(', ');
duration_info.textContent = `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`;
    const today = new Date();
    const releaseDateStr = data.release_date || data.first_air_date || '';
    const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;

    if (releaseDate && releaseDate > today ) {
      release_date.textContent = releaseDateStr;
      watchBtn.disabled = true;
      watchBtn.style.opacity = 0.5;
      watchBtn.style.cursor = "not-allowed";
      watchBtn.textContent = "This content is not released yet.";

    } else {
      release_date_info.textContent = releaseDateStr;
      watchBtn.disabled = false;
      watchBtn.style.opacity = 1;
      watchBtn.style.cursor = "pointer";
      watchBtn.title = "";
    }


    if (isTV) {
      duration.textContent=""
      if(data.next_episode_to_air){
      release_date.textContent="Next Episode To Air :"
      release_date_info.textContent=data.next_episode_to_air.air_date
    }
    else{
        release_date.textContent="Last Aired Episode:"
        release_date_info.textContent=data.last_air_date
    }  
      
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
            const id = useBackupServer ? info.imdbId || info.tmdbId : info.tmdbId;
            const base = useBackupServer ? "vidsrc.cc/v2" : "vidsrc.icu";
            const url = `https://${base}/embed/tv/${id}/${seasonNumber}/${ep.episode_number}?autoPlay=true`;
            window.open(url, "_blank");
          };

          episodeList.appendChild(epDiv);
        });
      });
  }
  
if (!isTV) {
  watchBtn.style.display = "block";
  watchBtn.addEventListener("click", () => {
    if (watchBtn.disabled) return;

    let url;
    if (useBackupServer) {
      const movieId = info.imdbId || info.tmdbId; // use imdb if available
      url = `https://vidsrc.cc/v2/embed/movie/${movieId}?autoPlay=true`;
    } else {
      url = `https://vidsrc.icu/embed/movie/${info.tmdbId}`;
    }

    window.open(url, "_blank");
  });
}
function updateServerButtons() {
  if (useBackupServer) {
    server2Btn.classList.add("server-btn-active");
    server1Btn.classList.remove("server-btn-active");
  } else {
    server1Btn.classList.add("server-btn-active");
    server2Btn.classList.remove("server-btn-active");
  }
}
// View toggle for episodes
document.getElementById("toggleViewBtn").addEventListener("click", function () {
  episodeList.classList.toggle("list-view");

  this.textContent = episodeList.classList.contains("list-view")
    ? "🔳 Grid View"
    : "📋 List View";
});
// handle server change
server1Btn.addEventListener("click", () => {
  useBackupServer = false;
  updateServerButtons();
});
server2Btn.addEventListener("click", () => {
  useBackupServer = true;
  updateServerButtons();
});
// Set initial state
updateServerButtons();