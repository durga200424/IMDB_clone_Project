const API_KEY = "66334156";

// SEARCH
function searchMovies() {
    const query = document.getElementById("search").value;

    document.getElementById("loader").style.display = "block";
    document.getElementById("suggestions").innerHTML = "";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("loader").style.display = "none";

            if (data.Search) {
                displayMovies(data.Search);
            } else {
                document.getElementById("movies").innerHTML = "No results 😢";
            }
        });
}

// DISPLAY
function displayMovies(movies) {
    const container = document.getElementById("movies");
    container.innerHTML = "";

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    movies.forEach(movie => {
        const isAdded = watchlist.includes(movie.imdbID);

        container.innerHTML += `
            <div class="movie">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>

                <button onclick="getMovieDetails('${movie.imdbID}')">🎬 View</button>
                <button onclick="toggleWatchlist('${movie.imdbID}', event)">
                    ${isAdded ? "💔 Remove" : "❤️ Add"}
                </button>
            </div>
        `;
    });
}

// DETAILS
function getMovieDetails(id) {
    document.getElementById("loader").style.display = "block";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
        .then(res => res.json())
        .then(movie => {
            document.getElementById("loader").style.display = "none";

            document.getElementById("movies").style.display = "none";
            const details = document.getElementById("details");

            details.style.display = "block";

            details.innerHTML = `
                <h1>${movie.Title}</h1>
                <img src="${movie.Poster}" width="200">

                <p><b>⭐ Rating:</b> ${movie.imdbRating}</p>
                <p><b>🎭 Actors:</b> ${movie.Actors}</p>
                <p><b>🎬 Genre:</b> ${movie.Genre}</p>
                <p><b>📅 Year:</b> ${movie.Year}</p>

                <p><b>📝 Plot:</b> ${movie.Plot}</p>

                <button onclick="goBack()">⬅ Back</button>
            `;
        });
}

function goBack() {
    document.getElementById("details").style.display = "none";
    document.getElementById("movies").style.display = "grid";
}

// WATCHLIST
function toggleWatchlist(id, event) {
    event.stopPropagation();

    let list = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (list.includes(id)) {
        list = list.filter(x => x !== id);
    } else {
        list.push(id);
    }

    localStorage.setItem("watchlist", JSON.stringify(list));
    searchMovies();
}

function showWatchlist() {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];

    const container = document.getElementById("movies");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "No Watchlist 😢";
        return;
    }

    list.forEach(id => {
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
            .then(res => res.json())
            .then(movie => {
                container.innerHTML += `
                    <div class="movie">
                        <img src="${movie.Poster}">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                        <button onclick="getMovieDetails('${movie.imdbID}')">🎬 View</button>
                    </div>
                `;
            });
    });
}

// AUTOSUGGEST (FIXED)
function autoSearch() {
    const query = document.getElementById("search").value;
    const box = document.getElementById("suggestions");

    if (query.length < 3) {
        box.innerHTML = "";
        return;
    }

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
        .then(res => res.json())
        .then(data => {
            box.innerHTML = "";

            if (data.Search) {
                data.Search.forEach(movie => {
                    const div = document.createElement("div");
                    div.classList.add("suggestion-item");
                    div.innerText = movie.Title;

                    div.onclick = () => {
                        document.getElementById("search").value = movie.Title;
                        box.innerHTML = "";
                        getMovieDetails(movie.imdbID);
                    };

                    box.appendChild(div);
                });
            }
        });
}

// DARK MODE
function toggleMode() {
    document.body.classList.toggle("light-mode");
}