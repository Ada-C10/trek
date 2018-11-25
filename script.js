// move to its own folder?
const baseURL = 'https://trektravel.herokuapp.com/trips/';

const reportStatus = (message) => {
  $('.status-message').html(message);
}

const loadTrips = () => {
  reportStatus('Loading trips...')

// wrap up into one function?
const tripList = $('.trip-list');
tripList.empty();
//

axios.get(baseURL)
  .then((response) => {
    reportStatus(`All ${response.data.length} trips.`)

    response.data.forEach((trip) => {
    $(tripList).append(`<a class="btn btn-info" role="button" href=${baseURL}${trip.id}>${trip.name}</a>`);
  });
  });


  // .catch((error) => {
  //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
  // });
};

$(document).ready(() => {
  $('body').click(loadTrips);

});

// TODO:
// determine button colors (create custom class for buttons)
// scroll down to show more / pagination?
// main button - increase size, create custom class for button
// = get error message .catch working
// bootstrap grid for the three sections
// bg image
// successful status message != header or ok?
