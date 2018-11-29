const FORM_FIELDS = ['name', 'email'];

const INFO_FIELD = ['about','continent', 'category', 'weeks', 'cost'];

const URL = 'https://trektravel.herokuapp.com/trips';
const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${getTripURL(tripId)}/reservations` };

const getInfo = (info) => {
  let requestedInfo = `<section id='trip-info'><h3>${info['name']}</h3>`;
  INFO_FIELD.forEach((infoField) => {
    requestedInfo +=
    `<p><strong>${infoField}: </strong><span class='info-field'>${info[`${infoField}`]}</span></p>`;
  });
  requestedInfo += `</section>`;
  return requestedInfo;
};

const getFieldName = (field) => {
  return `<label for=${field}>${field}</label><input type='string' name=${field} id=${field} />`;
};

const inputField = name => $(`#reservation-form input[name='${name}']`);
const getInput = name => { return inputField(name).val() || undefined };

const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field) });
  return formData;
};

const loadForm = () => {
  let formData = `<section id='book'><h4>Reserve Trip</h4><form id='reservation-form'>`;
  FORM_FIELDS.forEach((field) => { formData += getFieldName(field) });
  formData +=
  `<br /><input type='submit' name='add-reservation' value='Add Reservation' /></form></section>`;
  return formData;
};

const clearForm = () => { FORM_FIELDS.forEach((field) => { inputField(field).val(''); }) };

const reportStatus = (message) => { $('#status-message').html(message); };

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripsList.append(`<li class='trip ${trip.id}'>${trip.name}</li>`)
    });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`);
  });
};

const getTrip = (tripID) => {
  const tripInfo = $('#right-side-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
  .then((response) => {
    tripInfo.append(getInfo(response.data))
    .append(loadForm());
    $('#reservation-form').submit(function(event) { createReservation(event, tripID); });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`);
  });
};

const createReservation = (event, tripID) => {
  event.preventDefault();
  axios.post(getReservationURL(tripID), reservationFormData())
  .then((response) => {
    reportStatus(`Successfully added a reservation with ID ${response.data.trip_id}!`);
  })
  .catch((error) => {
    console.log(error.response);
    reportStatus(`Encountered an error while creating a reservation: ${error.message}`);
  });
  clearForm();
};

$(document).ready(() => {
  $('.hidden-at-start').hide();

  $('#load-trips-button').on('click', function() {
    $('#list').slideDown('slow');
    loadTrips(null);
  });

  $('#trips-list').on('click', function(event) {
    $('.side-info').slideUp('slow')
    .promise().done(function() {
      getTrip(event.target.classList[1]);
      $('.side-info').slideDown('slow');
    });
  });
});
