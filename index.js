const URL = 'https://trektravel.herokuapp.com/trips/';

const reservationInputs = ['name', 'email', 'trip', 'id'];
const tripInputs = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];

const tripsList = $('section.trips-list');
const tripDetails = $('section.trip-details');
const reserveTrip = $('section.reserve-trip');
const addTrip = $('section.add-trip');
const alert = $('#status-message');

const reportStatus = (message, type) => {
  alert.html(message);
  alert.removeClass().addClass(`alert alert-${type}`);
};

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  reportStatus('Loading trips...', 'warning');

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`, 'success');
      tripsList.show();
      response.data.forEach((trip) => {
        tripList.append(`<li><a href="#" data-trip-id="${trip.id}">${trip.name}</a></li>`);
      });
      addTrip.show();
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`, 'danger');
      console.log(error);
    });
};

const loadDetail = (event) => {
  event.preventDefault();

  const tripID = $(event.currentTarget).attr('data-trip-id');
  const tripDetail = $('#trip-detail');

  reportStatus('Loading trip details...', 'warning');

  // Prep work
  tripDetail.empty();

  // Load the details
  axios.get(URL + tripID)
    .then((response) => {
      const tripInfo = ['name', 'continent', 'category', 'weeks', 'cost', 'about']
      for (let info of tripInfo) {
        let currentData = response.data[info]
        currentData = (info === 'cost') ? `$${currentData.toFixed(2)}` : currentData;
        if (info === 'name') {
          $('#trip-header').html(currentData);
        } else {
          const listElement = $(`<li><span class="info-label">${info}</span>: ${currentData}</li>`);
          tripDetail.append(listElement);
        }
      }
      tripDetails.show();

      clearForm('reservation', reservationInputs);
      $(`#reservation-form input[name="trip"]`).val(response.data.name);
      $(`#reservation-form input[name="id"]`).val(response.data.id);
      reserveTrip.show();

      reportStatus(`Successfully loaded ${response.data.name}`, 'success');
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`, 'danger');
      console.log(error);
    });
};

const readFormData = (form, inputs) => {
  const parsedFormData = {};

  for (let currentInput of inputs) {
    const currentData = $(`#${form}-form input[name="${currentInput}"]`).val();
    parsedFormData[currentInput] = currentData ? currentData : undefined;
  }

  return parsedFormData;
};

const clearForm = (form, inputs) => {
  for (let currentInput of inputs) {
    $(`#${form}-form input[name="${currentInput}"]`).val('');
  }
};

const createReservation = (event) => {
  event.preventDefault();

  const reservationData = readFormData('reservation', reservationInputs);
  const tripID = reservationData.id;

  reportStatus('Sending reservation data...', 'warning');

  axios.post(URL + tripID + '/reservations', reservationData)
    .then((response) => {
      reportStatus(`Successfully added a reservation for trip ${reservationData.trip}!`, 'success');
      clearForm('reservation', reservationInputs);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}, 'danger'`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}, 'danger'`);
      }
    });
};

const addATrip = (event) => {
  event.preventDefault();

  const tripData = readFormData('trip', tripInputs);
  tripData['weeks'] = parseInt(tripData.weeks);
  tripData['cost'] = parseFloat(tripData.cost);

  reportStatus('Sending trip data...', 'warning');

  axios.post(URL, tripData)
    .then((response) => {
      clearForm('trip', tripInputs);
      reportStatus(`Successfully added trip: ${tripData.name}!`, 'success');
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}, 'danger'`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}, 'danger'`);
      }
    });
};


// ON LOAD...

$(document).ready(() => {
  tripsList.hide();
  tripDetails.hide();
  reserveTrip.hide();
  addTrip.hide();

  $('#load').click(loadTrips);

  $('#trip-form').submit(addATrip);

  $('#trip-list').on('click', 'a', loadDetail);

  $('#reservation-form').submit(createReservation);
});
