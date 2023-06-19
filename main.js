const apiKey = '73409487'; 
let currentMovies = [];
let currentPage = 1;
let totalPages = 1;
let currentSort = 'default';

// Fetching movies based on search query
function searchMovies(query) {
  const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Search) {
        return data.Search;
      } else {
        console.error('No movies found.');
        alert('No movies found')
        return [];
      }
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      return [];
    });
}

// Fetching additional movie details by IMDb ID
function fetchMovieDetails(imdbId) {
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      console.error('Error fetching movie details:', error);
      return null;
    });
}

// movie cards for a given page
function renderMovieCards(movies) {
  const movieCardsContainer = document.getElementById('movie-cards');
  movieCardsContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
     
      <img src="${movie.Poster}" alt="${movie.Title}">
      <div class='card-details'>
      <h2>${movie.Title}</h2>
      <div class="ratings">
        <p><b>Release Year:</b> ${movie.Year}</p>
      </div>
      </div>
      <button class="details-button" data-imdb-id="${movie.imdbID}">View More Details</button>
      
    `;
    movieCardsContainer.appendChild(movieCard);
  });

  // Attach event listeners to details buttons
  const detailsButtons = document.getElementsByClassName('details-button');
  Array.from(detailsButtons).forEach(button => {
    button.addEventListener('click', () => {
      const imdbId = button.getAttribute('data-imdb-id');
      displayMovieDetails(imdbId);
    });
  });
}

//  pagination
function renderPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.textContent = i;
    pageLink.href = '#';
    pageLink.classList.toggle('active', i === currentPage);
    pageLink.addEventListener('click', () => {
      currentPage = i;
      renderMovieCards(getMoviesForCurrentPage());
      renderPagination();
    });
    paginationContainer.appendChild(pageLink);
  }
}

// Get movies for the current page
function getMoviesForCurrentPage() {
  const startIndex = (currentPage - 1) * 4;
  const endIndex = startIndex + 4;
  return currentMovies.slice(startIndex, endIndex);
}

// Display additional movie details in modal
function displayMovieDetails(imdbId) {
  fetchMovieDetails(imdbId)
    .then(movieDetails => {
      if (movieDetails) {
        const modalTitle = document.getElementById('modal-title');
        const modalDetails = document.getElementById('modal-details');
        modalTitle.textContent = movieDetails.Title;
        modalDetails.innerHTML = `
          <p class='details'><span>Plot:</span> ${movieDetails.Plot}</p>
          <p class='details'><span>Cast:</span> ${movieDetails.Actors}</p>
          <p class='details'><span>Genre:</span> ${movieDetails.Genre}</p>
          <p class='details'><span>Rated:</span> ${movieDetails.Rated}</p>
          <p class='details'><span>Runtime:</span> ${movieDetails.Runtime}</p>
          <p class='details'><span>Director:</span> ${movieDetails.Director}</p>
          <p class='details'><span>Awards:</span> ${movieDetails.Awards}</p>
          <p class='details'><span>Ratings:</span> ${movieDetails.imdbRating}</p>
          <p class='details'><span>Votes:</span> ${movieDetails.imdbVotes}</p>
        `;
        document.getElementById('modal-container').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error fetching movie details:', error);
    });
}

// Event listener for search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  if (query !== '') {
    searchMovies(query)
      .then(movies => {
        currentMovies = movies;
        totalPages = Math.ceil(movies.length / 4);
        currentPage = 1;
        sortMovies();
        renderMovieCards(getMoviesForCurrentPage());
        renderPagination();
      });
  }
});

// Event listener for sort select
const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  sortMovies();
  renderMovieCards(getMoviesForCurrentPage());
});

// Sort movies based on selected option
function sortMovies() {
  switch (currentSort) {

    case 'year':
      currentMovies.sort((a, b) => b.Year - a.Year);
      break;
    default:
      break;
  }
}

// Close modal when close button is clicked
const closeButton = document.getElementsByClassName('close')[0];
closeButton.addEventListener('click', () => {
  document.getElementById('modal-container').style.display = 'none';
});

// Fetch movies for initial movie cards
searchMovies('') // Empty string to fetch all movies
  .then(movies => {
    currentMovies = movies;
    totalPages = Math.ceil(movies.length / 4);
    sortMovies();
    renderMovieCards(getMoviesForCurrentPage());
    renderPagination();
  });






// Carousel functionality
const carouselItems = document.querySelectorAll('.carousel-item');
let currentItemIndex = 0;

function showSlide(index) {
  carouselItems.forEach(item => {
    item.classList.remove('active');
  });

  carouselItems[index].classList.add('active');
}

function nextSlide() {
  currentItemIndex = (currentItemIndex + 1) % carouselItems.length;
  showSlide(currentItemIndex);
}

function previousSlide() {
  currentItemIndex = (currentItemIndex - 1 + carouselItems.length) % carouselItems.length;
  showSlide(currentItemIndex);
}

// Automatic slide change
let slideInterval = setInterval(nextSlide, 5000);

// Pause slide change on hover
const carousel = document.querySelector('.hero-carousel');
carousel.addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

carousel.addEventListener('mouseleave', () => {
  slideInterval = setInterval(nextSlide, 5000);
});

// Show initial slide
showSlide(currentItemIndex);


// // Carousel functionality
// const carouselItems = document.querySelectorAll('.carousel-item');
// let currentItemIndex = 0;

// function showSlide(index) {
//   carouselItems.forEach(item => {
//     item.classList.remove('active');
//   });

//   