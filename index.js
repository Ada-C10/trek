const URL = 'https://trektravel.herokuapp.com/trips/';

const inputs = ['name', 'email', 'trip'];

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus('Loading trips...');

  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  // Actually load the trips
  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li><a href="${trip.id}">${trip.name}</a></li>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const loadDetail = (event) => {
  event.preventDefault();

  const tripID = $(event.currentTarget).attr('href');
  console.log(tripID);

  reportStatus('Loading trip details...');

  // Prep work
  const tripDetails = $('#trip-detail');
  tripDetails.empty();

  // Load the details
  axios.get(URL + tripID)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.name}`);
      tripDetails.append(`<li>Name: ${response.data.name}</li>`);
      tripDetails.append(`<li>Continent: ${response.data.continent}</li>`);
      tripDetails.append(`<li>Category: ${response.data.category}</li>`);
      tripDetails.append(`<li>Weeks: ${response.data.weeks}</li>`);
      tripDetails.append(`<li>Cost: ${response.data.cost}</li>`);
      tripDetails.append(`<li>About: ${response.data.about}</li>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const readFormData = () => {
  const parsedFormData = {};

  for (let currentInput of inputs) {
    const currentData = $(`#reservation-form input[name="${currentInput}"]`).val();
    parsedFormData[currentInput] = currentData ? currentData : undefined;
  }

  return parsedFormData;
};

const clearForm = () => {
  for (let currentInput of inputs) {
    $(`#reservation-form input[name="${currentInput}"]`).val('');
  }
}

const createReservation = (event) => {
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Sending reservation data...');

  axios.post(URL, reservationData)
    .then((response) => {
      reportStatus(`Successfully added a reservation for trip ${response.data.trip}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};


// ON LOAD...

$(document).ready(() => {
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'a', loadDetail);

  $('#trip-form').submit(createReservation);
});
