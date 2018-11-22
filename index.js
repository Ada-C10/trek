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
  $('#status-message').html(message);
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
    .catch((error) => {
      console.log(error);
      reportStatus(`highly illogical: ${error.message}`);
    });
};

const tripDetails = (tripID) => {

  reportStatus('getting voyage details...');

  const tripInfo = $('#trip-info');

  tripInfo.empty();

  const tripURL = `${baseURL}/${tripID}`;

  axios.get(tripURL)
    .then((response) => {

      $('.trip-details').show();

      for (const detail in response.data) {
        if (detail != "id") {
        tripInfo.append(`
            <tr>
              <td><strong>${detail}<strong></td>
              <td>${response.data[detail]}</td>
            </tr>
            `)
          }
        }

      $('#reservation-form input[name="id"]').val(response.data.id)
      $('#reservation-form input[name="trip"]').val(response.data.name)

      reportStatus(`successfully loaded voyage #${tripID}`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`highly illogical: ${error.message}`);
    });

};

const readFormData = () => {

  console.log($('#reservation-form').serialize());

  return $('#reservation-form').serialize();
};

const createReservation = (event) => {
  event.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 'fast');

  reportStatus("requesting reservation...");

  const tripData = readFormData();
  const tripID = $(`#reservation-form input[name="id"]`).val();

  console.log(tripData);

  axios.post(baseURL + `/${tripID}/reservations`, tripData)
    .then((response) => {
      reportStatus('successfully reserved voyage!');

      clearForm();

    })

    .catch((error) => {
      console.log(error.response);

      if (error.response.data && error.response.data.errors) {
        reportError(
          `highly illogical: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`highly illogical: ${error.message}`);
      }
    });
};

const clearForm = () => {
  $(`#reservation-form input[name="name"]`).val("");
  $(`#reservation-form input[name="age"]`).val("");
  $(`#reservation-form input[name="email"]`).val("");
};

$(document).ready(() => {
  $('.current-trips').hide();
  $('.trip-details').hide();
  $('#load').click(loadTrips);

  $('#trip-list').on('click', 'li', function(event) {
    const tripID = $(this).data("id");

    tripDetails(tripID);
   });

  $('#reservation-form').submit(createReservation);
});
