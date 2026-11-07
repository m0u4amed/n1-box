// ---------- Data (ratings are approximate) ----------
const movies = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8, desc: "A thief enters people's dreams to steal their secrets." },
  { id: 2, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, desc: "Batman faces the Joker, a criminal mastermind who wants chaos." },
  { id: 3, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 8.7, desc: "Explorers travel through a wormhole to save humanity." },
  { id: 4, title: "Parasite", year: 2019, genre: "Drama", rating: 8.5, desc: "A poor family slowly infiltrates the life of a wealthy one." },
  { id: 5, title: "Spirited Away", year: 2001, genre: "Animation", rating: 8.6, desc: "A girl enters a world of spirits to rescue her parents." },
  { id: 6, title: "The Godfather", year: 1972, genre: "Drama", rating: 9.2, desc: "The aging head of a crime family passes power to his son." },
  { id: 7, title: "Coco", year: 2017, genre: "Animation", rating: 8.4, desc: "A boy travels to the Land of the Dead to find his family's story." },
  { id: 8, title: "Whiplash", year: 2014, genre: "Drama", rating: 8.5, desc: "A young drummer is pushed to the limit by a ruthless teacher." },
];

const genreColors = {
  "Sci-Fi": "linear-gradient(135deg, #4f46e5, #06b6d4)",
  "Action": "linear-gradient(135deg, #dc2626, #f97316)",
  "Drama": "linear-gradient(135deg, #7c3aed, #db2777)",
  "Animation": "linear-gradient(135deg, #059669, #fbbf24)",
};

// ---------- State ----------
const state = { search: "", genre: "all", sort: "default", onlyFavorites: false, favorites: [] };

try {
  state.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
} catch (e) {
  state.favorites = [];
}

function saveFavorites() {
  try {
    localStorage.setItem("favorites", JSON.stringify(state.favorites));
  } catch (e) {}
}

// ---------- Elements ----------
const grid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search");
const genreSelect = document.getElementById("genre");
const sortSelect = document.getElementById("sort");
const favToggle = document.getElementById("fav-toggle");
const count = document.getElementById("count");

// ---------- Card component ----------
function MovieCard(movie) {
  const card = document.createElement("article");
  card.className = "card";

  const poster = document.createElement("div");
  poster.className = "poster";
  poster.style.background = genreColors[movie.genre];
  poster.textContent = movie.title.charAt(0);

  const heart = document.createElement("button");
  const isLiked = state.favorites.includes(movie.id);
  heart.className = "heart" + (isLiked ? " liked" : "");
  heart.textContent = "♥";
  heart.setAttribute("aria-label", "Add " + movie.title + " to favorites");
  heart.setAttribute("aria-pressed", String(isLiked));
  heart.addEventListener("click", () => toggleFavorite(movie.id));
  poster.appendChild(heart);

  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = movie.year + " · " + movie.genre;

  const rating = document.createElement("p");
  rating.className = "rating";
  rating.textContent = "★ " + movie.rating.toFixed(1);

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = movie.desc;

  info.append(title, meta, rating, desc);
  card.append(poster, info);
  return card;
}

// ---------- Logic ----------
function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index === -1) state.favorites.push(id);
  else state.favorites.splice(index, 1);
  saveFavorites();
  render();
}

function getVisibleMovies() {
  let list = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(state.search.toLowerCase());
    const matchesGenre = state.genre === "all" || m.genre === state.genre;
    const matchesFav = !state.onlyFavorites || state.favorites.includes(m.id);
    return matchesSearch && matchesGenre && matchesFav;
  });

  if (state.sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  if (state.sort === "year") list = [...list].sort((a, b) => b.year - a.year);
  return list;
}

function render() {
  const visible = getVisibleMovies();
  grid.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No movies found.";
    grid.appendChild(empty);
  } else {
    visible.forEach((m) => grid.appendChild(MovieCard(m)));
  }
  count.textContent = visible.length + " movie" + (visible.length === 1 ? "" : "s");
}

// ---------- Events ----------
[...new Set(movies.map((m) => m.genre))].forEach((g) => {
  const option = document.createElement("option");
  option.value = g;
  option.textContent = g;
  genreSelect.appendChild(option);
});

searchInput.addEventListener("input", (e) => { state.search = e.target.value; render(); });
genreSelect.addEventListener("change", (e) => { state.genre = e.target.value; render(); });
sortSelect.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
favToggle.addEventListener("click", () => {
  state.onlyFavorites = !state.onlyFavorites;
  favToggle.setAttribute("aria-pressed", String(state.onlyFavorites));
  render();
});

render();