
document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad(event) {
  if (data.introModalSeen === false) {
    $getStartedView.classList.remove('d-none');
    $navBar.classList.add('d-none');
  }
}

var $getStartedBtn = document.querySelector('#get-started-btn');
var $getStartedView = document.querySelector('#get-started');
var $navBar = document.querySelector('.navbar-fixed-top');
var $searchView = document.querySelector('#search-form');
var $resultsView = document.querySelector('#results-page');
var $detailView = document.querySelector('#details-view');

$getStartedBtn.addEventListener('click', getStarted);

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
    data.view = 'search-form';
    $resultsView.replaceChildren();
  } else if (string === 'details-view') {
    $resultsView.classList.add('d-none');
    $detailView.classList.remove('d-none');
    data.view = 'details-view';
  }
}

var $searchInputForm = document.querySelector('#search-input-form');
$searchInputForm.addEventListener('submit', searchFormSubmit);

function searchFormSubmit(event) {
  event.preventDefault();
  getMovieListData($searchInputForm.elements.search.value);
  viewSwap('results-page');
  $searchInputForm.reset();
}

$navBar.addEventListener('click', navBarHandler);

function navBarHandler(event) {
  if (event.target.tagName === 'I') {
    viewSwap('search-form');
    $detailView.replaceChildren();
  }
}

function getMovieListData(string) {
  var xhr = new XMLHttpRequest();
  // eslint-disable-next-line no-undef
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=' + apiKey + '&s=' + string);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderResultsHeaderDom(string);
    renderSearchResults(xhr.response);
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
        showDetailsBtn.setAttribute('class', 'btn btn-green text-white mt-4 px-3 font-changa');
        showDetailsBtn.setAttribute('type', 'button');
        showDetailsBtn.setAttribute('data-movie-id', response.Search[i].imdbID);
        var addWatchListBtn = document.createElement('btn');
        addWatchListBtn.setAttribute('type', 'button');
        addWatchListBtn.setAttribute('class', 'btn btn-green text-white mt-4 px-3 font-changa');
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
    h6No.textContent = 'No Results Found';
    resultsInnerRow.appendChild(h6No);
  }
  $resultsView.appendChild(resultsRow);
}

$resultsView.addEventListener('click', showDetails);

function showDetails(event) {

  if (event.target.tagName === 'BTN') {
    viewSwap('details-view');
    var btnID = event.target;
    btnID = btnID.getAttribute('data-movie-id');
    getMovieDetailsData(btnID);
  }
}

function getMovieDetailsData(string) {
  var xhr = new XMLHttpRequest();
  // eslint-disable-next-line no-undef
  xhr.open('GET', 'http://www.omdbapi.com/?apikey=' + apiKey + '&i=' + string);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderDetailsView(xhr.response);
  });
  xhr.send();
}

function renderDetailsView(response) {
  var detailRow = document.createElement('div');
  detailRow.classList.add('row');
  var detailCol1 = document.createElement('div');
  detailCol1.setAttribute('class', 'col-12 col-md-6');
  var detailImg = document.createElement('img');
  detailImg.setAttribute('class', 'img-100 rounded mt-3');
  detailImg.setAttribute('src', response.Poster);
  var detailCol2 = document.createElement('div');
  detailCol2.setAttribute('class', 'col-12 col-md-6 mt-3');
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
  var backBtn = document.createElement('button');
  backBtn.setAttribute('class', 'back-btn btn btn-green text-white mt-4 px-3 font-changa float-end');
  var backIcon = document.createElement('i');
  backIcon.setAttribute('class', 'fa-solid fa-chevron-left');
  backBtn.appendChild(backIcon);
  var backBtnText = document.createElement('span');
  backBtnText.textContent = ' Back';
  backBtn.appendChild(backBtnText);

  detailCol2.appendChild(title);
  detailCol2.appendChild(director);
  detailCol2.appendChild(year);
  detailCol2.appendChild(plotSummary);
  detailCol2.appendChild(plotSummaryP);
  detailCol2.appendChild(awards);
  detailCol2.appendChild(awardsP);
  detailCol2.appendChild(backBtn);

  detailCol1.appendChild(detailImg);
  detailRow.appendChild(detailCol1);
  detailRow.appendChild(detailCol2);
  $detailView.appendChild(detailRow);
}

$detailView.addEventListener('click', backBtnHandler);

function backBtnHandler(event) {
  if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SPAN' || event.target.tagName === 'I') {
    viewSwap('results-page');
    $detailView.replaceChildren();
  }
}
