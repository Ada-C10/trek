// move to its own folder?
const baseURL = 'https://trektravel.herokuapp.com/';
const getTripsURL = 'trips';

const reportStatus = (message) => {
  $('.status-message').html(message);
}

const loadTrips = () => {
  reportStatus('Loading trips...')

// wrap up into one function?
const tripList = $('.trip-list');
tripList.empty();
//

axios.get(baseURL+getTripsURL)
  .then((response) => {
    // reportStatus(`Successfully loaded ${response.data.length} trips.`)
    $(tripList).append(`<p>${response.data.length}</p>`);

    response.data.forEach((trip) => {
    $(tripList).append(`<p>${trip.name}</p>`);
  });
  });


  // .catch((error) => {
  //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
  // });
};

$(document).ready(() => {
  $('body').hover(loadTrips);

});
