/* exported data, apiKey */

var data = {
  view: 'get-started',
  movies: [],
  nextMovieID: 1,
  introModalSeen: false,
  movieIndexToDelete: null
};

var apiKey = '40b47319';

window.addEventListener('beforeunload', saveData);

window.addEventListener('pagehide', saveData);

function saveData(event) {
  var movieData = JSON.stringify(data);
  localStorage.setItem('movieData', movieData);
}

var previousData = localStorage.getItem('movieData');
if (previousData !== null) {
  data = JSON.parse(previousData);
}
