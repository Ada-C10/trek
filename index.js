const BASE_URL = 'https://trektravel.herokuapp.com/trips/';

//
// Status Management
//
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus('Loading inventory...');

  // Prep work
  const tripsList = $('#trips-list');
  tripsList.empty();

  // Actually load the trips
  axios.get(BASE_URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        const newTrip = $(`<li class="trip ">${trip.name}</li>`);
        tripsList.append(newTrip);
        const showTrip = tripShowHandler(trip);
        newTrip.click(showTrip);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const tripShowHandler = (trip) => {

  // Prep work
  const tripsShow = $('#trips-list');
  const tripID = trip.id;
  return () => {
    reportStatus('Loading trip...');
    tripsShow.empty();
  // Actually load the trips
  axios.get(BASE_URL + tripID)
    .then((response) => {
      reportStatus(`Found your get-away`);
        const newTrip = $(`<li>${response.data.name}, $${response.data.cost}</li><li>${response.data.continent}, ${response.data.weeks} weeks</li><li>Trip type:${response.data.category}</li><li>Details:${response.data.about}</li></ul>`);
        tripsShow.append(newTrip);
        const reserveButton = $(`<button class="reserve">Sign me up!</button>`)
        tripsShow.append(reserveButton);
      })

    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };
};

// const tripReserveHandler = (trip) => {
//
//   // Prep work
//   const tripsShow = $('#trips-list');
//   // const tripID = trip.id;
//   return () => {
//     reportStatus('Loading resevation...');
//     tripsShow.empty();
//   tripsShow.append('Reservation here');
//     }
//
// };

//
// OK GO!!!!!
//
$(document).ready(() => {
  $('#load').click(loadTrips);
});
