// index.js
const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus("loading trips...");

  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  // Actually load the trips
  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);

      // sort the trips

      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
};

// const createTrip = () => {
//
//   event.preventDefault();
//   const dataToSendWithPostRequest = {
//
//   };
//
//   axios.post(URL, dataToSendWithPostRequest)
//   .then((response) => {
//     console.log('post method workd');
//     console.log(response);
//   })
//
//   .catch((error) => {
//     console.log('post method nooo');
//     console.log(error);
//   });
// };


$(document).ready(() => {
  $('#load').click(loadTrips);
  // $('#trip-form').submit(createTrip);
  // we select something by the id of create trip button. when an event on this element called submit happens, we wil use the callback createTrip
});

// event
// parse the form on the HTML for user input
// make the POST request
// give UI feedback
