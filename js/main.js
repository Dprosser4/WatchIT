
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

$getStartedBtn.addEventListener('click', getStarted);

function getStarted(event) {
  data.introModalSeen = true;
  viewSwap('search-form');
}

function viewSwap(string) {
  if (string === 'results-page') {
    $searchView.classList.add('d-none');
    $resultsView.classList.remove('d-none');
    data.view = 'result-page';
  } else if (string === 'search-form') {
    $getStartedView.classList.add('d-none');
    $navBar.classList.remove('d-none');
    $searchView.classList.remove('d-none');
    $resultsView.classList.add('d-none');
    data.view = 'search-form';
    $resultsView.replaceChildren();
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
