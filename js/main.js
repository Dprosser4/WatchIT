
document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad(event) {
  if (data.introModalSeen === false) {
    $getStartedView.classList.remove('d-none');
    $navBar.classList.add('d-none');
    // eslint-disable-next-line no-undef
    gsap.to('.start-heading', { delay: 0.5, duration: 1.5, opacity: 0, display: 'none' });
    // eslint-disable-next-line no-undef
    gsap.from('.start-img', { display: 'none', duration: 2.5, delay: 2, opacity: 0, x: -150, y: -0, ease: 'bounce', scale: 0.25, rotation: -270 });
    // eslint-disable-next-line no-undef
    gsap.from('#get-started-btn', { duration: 1.5, delay: 4.5, opacity: 0 });

  }
}

var $getStartedBtn = document.querySelector('#get-started-btn');
var $getStartedView = document.querySelector('#get-started');
var $navBar = document.querySelector('.navbar-fixed-top');
var $searchView = document.querySelector('#search-form');
var $searchInputForm = document.querySelector('#search-input-form');
var $resultsView = document.querySelector('#results-page');
var $detailView = document.querySelector('#details-view');
var $watchListView = document.querySelector('#watchlist-view');
var $watchListInnerRow = document.querySelector('.watch-list-inner');
var $deleteModal = document.querySelector('.overlay');
var $spinner = document.querySelector('.spinner-overlay');

$getStartedBtn.addEventListener('click', getStarted);
$searchInputForm.addEventListener('submit', searchFormSubmit);
$navBar.addEventListener('click', navBarHandler);
$resultsView.addEventListener('click', resultsButtons);
$detailView.addEventListener('click', detailBtnHandler);
$watchListInnerRow.addEventListener('click', watchListBtnHandler);
$deleteModal.addEventListener('click', modalDelegation);

function getStarted(event) {
  data.introModalSeen = true;
  viewSwap('search-form');
}

function viewSwap(string) {
  if (string === 'results-page') {
    $searchView.classList.add('d-none');
    $detailView.classList.add('d-none');
    $resultsView.classList.remove('d-none');
    data.view = 'results-page';
  } else if (string === 'search-form') {
    $getStartedView.classList.add('d-none');
    $navBar.classList.remove('d-none');
    $searchView.classList.remove('d-none');
    $resultsView.classList.add('d-none');
    $detailView.classList.add('d-none');
    $watchListView.classList.add('d-none');
    data.view = 'search-form';
    $resultsView.replaceChildren();
    $watchListInnerRow.replaceChildren();
  } else if (string === 'details-view') {
    $resultsView.classList.add('d-none');
    $detailView.classList.remove('d-none');
    $watchListView.classList.add('d-none');
  } else if (string === 'watchlist-view') {
    $watchListView.classList.remove('d-none');
    $searchView.classList.add('d-none');
    $detailView.classList.add('d-none');
    data.view = 'watchlist-view';
    $resultsView.replaceChildren();
  }
}

function searchFormSubmit(event) {
  event.preventDefault();
  getMovieListData($searchInputForm.elements.search.value);
  viewSwap('results-page');
  $searchInputForm.reset();
}

function navBarHandler(event) {
  if (event.target.matches('.search-view')) {
    viewSwap('search-form');
    $detailView.replaceChildren();
  } else if (event.target.matches('.watch-list')) {
    $watchListInnerRow.replaceChildren();
    $detailView.replaceChildren();
    renderWatchlist(data.movies);
    viewSwap('watchlist-view');

  }
}

function getMovieListData(string) {
  var xhr = new XMLHttpRequest();
  // eslint-disable-next-line no-undef
  xhr.open('GET', 'https://www.omdbapi.com/?apikey=' + apiKey + '&s=' + string);
  xhr.responseType = 'json';
  $spinner.classList.remove('d-none');
  xhr.addEventListener('error', function () {
    var errorMessage = document.createElement('h6');
    errorMessage.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
    errorMessage.textContent = 'Sorry, there was an error connecting to the network! Please check your internet connection and try again.';
    $resultsView.appendChild(errorMessage);
    $spinner.classList.add('d-none');
  });
  xhr.addEventListener('load', function () {
    renderResultsHeaderDom(string);
    renderSearchResults(xhr.response);
    $spinner.classList.add('d-none');
  });
  xhr.send();
}

function renderResultsHeaderDom(string) {
  var headerRow = document.createElement('div');
  headerRow.classList.add('row');
  var headerCol = document.createElement('div');
  headerRow.setAttribute('class', 'col-12 py-3');
  var headerH3 = document.createElement('h3');
  headerH3.setAttribute('class', 'text-custom-grey font-changa');
  headerH3.textContent = 'Results For: ' + string;
  headerCol.appendChild(headerH3);
  headerRow.appendChild(headerCol);
  $resultsView.appendChild(headerRow);
}

function renderSearchResults(response) {
  var resultsRow = document.createElement('div');
  resultsRow.classList.add('row');
  var resultsCol = document.createElement('div');
  resultsCol.classList.add('col-12');
  var resultsInnerRow = document.createElement('div');
  resultsInnerRow.classList.add('row');
  resultsRow.appendChild(resultsCol);
  resultsCol.appendChild(resultsInnerRow);

  if (response.Response !== 'False') {
    for (var i = 0; i < response.Search.length; i++) {
      if (response.Search[i].Poster !== 'N/A' && response.Search[i].Type === 'movie') {
        var imgCol = document.createElement('div');
        imgCol.setAttribute('class', 'col-6 col-md-3 pb-3');
        var img = document.createElement('img');
        img.setAttribute('src', response.Search[i].Poster);
        img.setAttribute('class', 'img-fluid rounded');
        imgCol.appendChild(img);
        resultsInnerRow.appendChild(imgCol);
        var h6Col = document.createElement('div');
        h6Col.setAttribute('class', 'col-6 col-md-3 pb-3');
        var h6 = document.createElement('h6');
        h6.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
        h6.textContent = response.Search[i].Title;
        h6Col.appendChild(h6);
        var showDetailsBtn = document.createElement('btn');
        showDetailsBtn.textContent = 'Show Details';
        showDetailsBtn.setAttribute('class', 'btn btn-green text-nowrap text-white mt-4 me-3 px-3 font-changa');
        showDetailsBtn.setAttribute('type', 'button');
        showDetailsBtn.setAttribute('data-movie-id', response.Search[i].imdbID);
        var addWatchListBtn = document.createElement('btn');
        addWatchListBtn.setAttribute('type', 'button');
        addWatchListBtn.setAttribute('data-movie-id', response.Search[i].imdbID);
        addWatchListBtn.setAttribute('data-movie-url', response.Search[i].Poster);
        addWatchListBtn.setAttribute('data-movie-title', response.Search[i].Title);
        addWatchListBtn.setAttribute('class', 'btn btn-green text-nowrap text-white mt-4 px-3 font-changa');
        var watchListBtnIcon = document.createElement('i');
        watchListBtnIcon.setAttribute('class', 'fa-solid fa-plus');
        addWatchListBtn.appendChild(watchListBtnIcon);
        addWatchListBtn.append(' Watch List');
        h6Col.appendChild(showDetailsBtn);
        h6Col.appendChild(addWatchListBtn);
        resultsInnerRow.appendChild(h6Col);
      }
    }
  } else if (response.Response === 'False') {
    var h6No = document.createElement('h6');
    h6No.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
    h6No.textContent = 'No Results Found. Try Searching Again...';
    resultsInnerRow.appendChild(h6No);
  }
  $resultsView.appendChild(resultsRow);
}

function resultsButtons(event) {

  if (event.target.textContent === 'Show Details') {
    viewSwap('details-view');
    var btnID = event.target;
    btnID = btnID.getAttribute('data-movie-id');
    getMovieDetailsData(btnID);
  } else if (event.target.textContent === ' Watch List') {
    addMovieToWatchList(event);
  }
}

function addMovieToWatchList(event) {
  var img = event.target;
  img = img.getAttribute('data-movie-url');
  var title = event.target;
  title = title.getAttribute('data-movie-title');
  var newMovieID = event.target;
  newMovieID = newMovieID.getAttribute('data-movie-id');
  var newMovie = {};
  newMovie.title = title;
  newMovie.img = img;
  newMovie.ID = data.nextMovieID;
  newMovie.imdbID = newMovieID;
  newMovie.watched = false;
  data.movies.unshift(newMovie);
  data.nextMovieID++;
  event.target.textContent = '  Added  ';
}

function getMovieDetailsData(string) {
  var xhr = new XMLHttpRequest();
  // eslint-disable-next-line no-undef
  xhr.open('GET', 'https://www.omdbapi.com/?apikey=' + apiKey + '&i=' + string);
  xhr.responseType = 'json';
  $spinner.classList.remove('d-none');
  xhr.addEventListener('error', function () {
    var errorMessage = document.createElement('h6');
    errorMessage.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
    errorMessage.textContent = 'Sorry, there was an error connecting to the network! Please check your internet connection and try again.';
    $detailView.appendChild(errorMessage);
    $spinner.classList.add('d-none');
  });
  xhr.addEventListener('load', function () {
    renderDetailsView(xhr.response);
    $spinner.classList.add('d-none');
  });
  xhr.send();
}

function renderDetailsView(response) {
  var detailRow = document.createElement('div');
  detailRow.classList.add('row');
  var detailCol1 = document.createElement('div');
  detailCol1.setAttribute('class', 'col-12 col-sm-6');
  var detailImg = document.createElement('img');
  detailImg.setAttribute('class', 'img-100 rounded mt-3');
  detailImg.setAttribute('src', response.Poster);
  var detailCol2 = document.createElement('div');
  detailCol2.setAttribute('class', 'col-12 col-sm-6 mt-3');
  var title = document.createElement('h3');
  title.setAttribute('class', 'text-custom-grey fw-light font-changa');
  title.textContent = response.Title;
  var director = document.createElement('h6');
  director.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
  director.textContent = response.Director;
  var year = document.createElement('h6');
  year.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
  year.textContent = response.Year;
  var plotSummary = document.createElement('h5');
  plotSummary.setAttribute('class', 'text-custom-grey text-decoration-underline font-wieght-normal font-changa');
  plotSummary.textContent = 'Plot Summary:';
  var plotSummaryP = document.createElement('p');
  plotSummaryP.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
  plotSummaryP.textContent = response.Plot;
  var awards = document.createElement('h5');
  awards.setAttribute('class', 'text-custom-grey text-decoration-underline font-wieght-normal font-changa');
  awards.textContent = 'Awards:';
  var awardsP = document.createElement('p');
  awardsP.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
  awardsP.textContent = response.Awards;
  if (data.view === 'results-page') {
    var addWatchListBtn = document.createElement('button');
    addWatchListBtn.setAttribute('type', 'button');
    addWatchListBtn.setAttribute('data-movie-id', response.imdbID);
    addWatchListBtn.setAttribute('data-movie-url', response.Poster);
    addWatchListBtn.setAttribute('data-movie-title', response.Title);
    addWatchListBtn.setAttribute('class', 'back-btn btn btn-green text-white mt-4 ms-2  px-3 font-changa float-end');
    var addWatchListBtnIcon = document.createElement('i');
    addWatchListBtnIcon.setAttribute('class', 'fa-solid fa-plus');
    addWatchListBtn.appendChild(addWatchListBtnIcon);
    addWatchListBtn.append(' Watch List');
  }
  var backBtn = document.createElement('button');
  backBtn.setAttribute('class', 'back-btn btn btn-green text-white mt-4 px-3 font-changa float-end');
  var backIcon = document.createElement('i');
  backIcon.setAttribute('class', 'fa-solid fa-chevron-left');
  backBtn.appendChild(backIcon);
  backBtn.append(' Back');

  detailCol2.appendChild(title);
  detailCol2.appendChild(director);
  detailCol2.appendChild(year);
  detailCol2.appendChild(plotSummary);
  detailCol2.appendChild(plotSummaryP);
  detailCol2.appendChild(awards);
  detailCol2.appendChild(awardsP);
  if (data.view === 'results-page') {
    detailCol2.appendChild(addWatchListBtn);
  }
  detailCol2.appendChild(backBtn);
  detailCol1.appendChild(detailImg);
  detailRow.appendChild(detailCol1);
  detailRow.appendChild(detailCol2);
  $detailView.appendChild(detailRow);
}

function detailBtnHandler(event) {
  if (event.target.textContent === ' Back') {
    viewSwap(data.view);
    $detailView.replaceChildren();
  } else if (event.target.textContent === ' Watch List') {
    addMovieToWatchList(event);
  }
}

function renderWatchlist(moviesArray) {
  if (moviesArray.length < 1) {
    var h6No = document.createElement('h6');
    h6No.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
    h6No.textContent = 'No movies have been added yet.';
    $watchListInnerRow.appendChild(h6No);
  }
  for (var i = 0; i < moviesArray.length; i++) {
    var imgCol = document.createElement('div');
    imgCol.setAttribute('class', 'col-6 col-sm-3 pb-3');
    var img = document.createElement('img');
    img.setAttribute('src', moviesArray[i].img);
    img.setAttribute('class', 'img-fluid rounded');
    imgCol.appendChild(img);
    var h6Col = document.createElement('div');
    h6Col.setAttribute('class', 'col-6 col-sm-3 pb-3 d-flex flex-column justify-content-between');
    var h6 = document.createElement('h6');
    h6.setAttribute('class', 'text-custom-grey font-wieght-normal font-changa');
    h6.textContent = moviesArray[i].title;
    h6Col.appendChild(h6);
    var showDetailsBtn = document.createElement('btn');
    showDetailsBtn.textContent = 'Show Details';
    showDetailsBtn.setAttribute('class', 'btn text-nowrap btn-green text-white mt-4 me-3 px-3 align-self-start font-changa');
    showDetailsBtn.setAttribute('type', 'button');
    showDetailsBtn.setAttribute('data-movie-id', moviesArray[i].imdbID);
    h6Col.appendChild(showDetailsBtn);

    var watchedBtn = document.createElement('btn');
    watchedBtn.setAttribute('type', 'button');
    watchedBtn.setAttribute('data-current-movie-index', i);
    if (data.movies[i].watched) {
      watchedBtn.setAttribute('class', 'btn btn-green mt-2 text-nowrap text-custom-grey align-self-start font-changa');
      watchedBtn.textContent = 'Watched';
    } else {
      watchedBtn.setAttribute('class', 'btn btn-green mt-2 text-nowrap text-white align-self-start font-changa');
      watchedBtn.textContent = 'Watch?';
    }

    h6Col.appendChild(watchedBtn);

    var deleteBtn = document.createElement('btn');
    deleteBtn.setAttribute('class', 'delete-btn btn btn-green mt-4 text-white align-self-end font-changa');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('data-current-movie-index', i);
    var deleteBtnIcon = document.createElement('i');
    deleteBtnIcon.setAttribute('class', 'fa-solid fa-trash-can');
    deleteBtnIcon.setAttribute('data-current-movie-index', i);
    deleteBtn.appendChild(deleteBtnIcon);
    h6Col.appendChild(deleteBtn);
    $watchListInnerRow.appendChild(imgCol);
    $watchListInnerRow.appendChild(h6Col);
  }
}

function watchListBtnHandler(event) {
  if (event.target.textContent === 'Show Details') {
    viewSwap('details-view');
    var btnID = event.target;
    btnID = btnID.getAttribute('data-movie-id');
    getMovieDetailsData(btnID);
  }
  if (event.target.matches('.delete-btn') || event.target.matches('.fa-trash-can')) {
    $deleteModal.classList.remove('d-none');
    $navBar.classList.add('d-none');
    data.movieIndexToDelete = Number(event.target.getAttribute('data-current-movie-index'));
  }
  if (event.target.textContent === 'Watch?') {
    var currentMovie = data.movies[Number(event.target.getAttribute('data-current-movie-index'))];
    currentMovie.watched = true;
    data.movies.splice(Number(event.target.getAttribute('data-current-movie-index')), 1);
    data.movies.push(currentMovie);
    $watchListInnerRow.replaceChildren();
    renderWatchlist(data.movies);
  }

}

function modalDelegation(event) {
  if (event.target.textContent === 'CANCEL') {
    $deleteModal.classList.add('d-none');
    $navBar.classList.remove('d-none');
  }
  if (event.target.textContent === 'CONFIRM') {
    $deleteModal.classList.add('d-none');
    $navBar.classList.remove('d-none');
    deleteMovie();
    $watchListInnerRow.replaceChildren();
    renderWatchlist(data.movies);
  }

}

function deleteMovie() {
  data.movies.splice(data.movieIndexToDelete, 1);
  data.movieIndexToDelete = null;
}
