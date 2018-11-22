const baseURL = 'https://trektravel.herokuapp.com/trips';

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const reportStatus = (message) => {
  $('html, body').animate({ scrollTop: 0 }, 'fast');
  $('#status-message').html(message);
};

const handleError = (error) => {
  console.log(error.response);

  if (error.response.data && error.response.data.errors) {
    reportError(
      `highly illogical: ${error.message}`,
      error.response.data.errors
    );
  } else {
    reportStatus(`highly illogical: ${error.message}`);
  }
};

const loadTrips = () => {
  $('.current-trips').show();
  reportStatus('loading voyages...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(baseURL)
    .then((response) => {
      tripList.append("<li class='list-group-item list-group-item-dark trek-font text-center'>STRANGE NEW WORLDS</li>")
      response.data.forEach((trip) => {
        const tripName = $(`<li class="list-group-item list-group-item-action">${trip.name}</li>`);
        tripName.data("id", trip.id);
        tripName.addClass("trip-link");

        tripList.append(tripName);
      });
      reportStatus(`successfully loaded ${response.data.length} voyages`);
    })
    .catch(handleError);
};

const tripDetails = (tripID) => {
  reportStatus('getting voyage details...');

  const tripInfo = $('#trip-info');
  const tripURL = `${baseURL}/${tripID}`;
  tripInfo.empty();

  axios.get(tripURL)
    .then((response) => {
      $('.trip-details').show();

      for (const detail in response.data) {
        if (detail != "id") {
        tripInfo.append(`<tr><td><strong>${detail}<strong></td><td>${response.data[detail]}</td></tr>`)
        }
      }
      $('#reservation-form input[name="id"]').val(response.data.id)
      $('#reservation-form input[id="form-trip-name"]').val(response.data.name)

      reportStatus(`successfully loaded voyage #${tripID}`);
    })
    .catch(handleError);
};

const readFormData = (formObject) => {
  return formObject.serialize();
};

const createReservation = (event) => {
  event.preventDefault();
  reportStatus("requesting reservation...");

  const tripData = readFormData($('#reservation-form'));
  const tripID = $(`#reservation-form input[name="id"]`).val();

  axios.post(baseURL + `/${tripID}/reservations`, tripData)
    .then((response) => {
      reportStatus('successfully reserved voyage!');
      clearForm($('#reservation-form'));
    })
  .catch(handleError);
};

const createTrip = (event) => {
  event.preventDefault();
  reportStatus("registering new voyage...");

  const tripData = readFormData($('#new-trip-form'));

  axios.post(baseURL, tripData)
    .then((response) => {
      reportStatus(`successfully registered new voyage #${response.data.id}!`);
      clearForm($('#new-trip-form'));
      setTimeout(loadTrips, 1500);
    })
    .catch(handleError);
};

const clearForm = (form) => {
  form[0].reset();
};

$(document).ready(() => {
  $('.current-trips').hide();
  $('.trip-details').hide();
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'li', function(event) {
    tripDetails($(this).data("id"));
   });

  $('#reservation-form').submit(createReservation);
  $('#new-trip-form').submit(createTrip);
});
