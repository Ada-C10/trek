const FORM_FIELDS = ['name', 'email'];

const URL = 'https://trektravel.herokuapp.com/trips';
const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${getTripURL(tripId)}/reservations` };

const formFieldHTMLString = (field) => {
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
  let resFormString = `<section id='book'><h4>Reserve Trip</h4><form id='reservation-form'>`;
  FORM_FIELDS.forEach((field) => { resFormString += formFieldHTMLString(field) });
  resFormString +=
  `<br /><input type='submit' name='add-reservation' value='Add Reservation' /></form></section>`;
  return resFormString;
};

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) => {
    formData[field] = getInput(field);
  });

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
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
  .then((response) => {
    tripInfo.append(response.data.about)
    .append(loadForm());
    $('#reservation-form').submit(function(event) { createReservation(event, tripID); });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`);
  });
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
