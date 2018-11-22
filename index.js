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
  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(baseURL)
    .then((response) => {
      response.data.forEach((trip) => {
        const tripName = $(`<li class="list-group-item">${trip.name}</li>`);
        tripName.data("id", trip.id);

        tripName.addClass("trip-link");
        tripList.append(tripName);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });
};

const tripDetails = (tripID) => {

  reportStatus('Getting Trip Details...');

  const tripInfo = $('#trip-info');

  tripInfo.empty();

  const tripURL = `${baseURL}/${tripID}`;

  axios.get(tripURL)
    .then((response) => {
      $('.trip-details').show();

      tripInfo.append(`<li>Name: ${response.data.name}</li>`);
      tripInfo.append(`<li>About: ${response.data.about}</li>`);
      tripInfo.append(`<li>Continent: ${response.data.continent}</li>`);
      tripInfo.append(`<li>Category: ${response.data.category}</li>`);
      tripInfo.append(`<li>Weeks: ${response.data.weeks}</li>`);
      tripInfo.append(`<li>Price: ${response.data.cost}</li>`);
      tripInfo.append(`<li>Trip ID: ${response.data.id}</li>`);

      $('#reservation-form input[name="id"]').val(response.data.id)
      $('#reservation-form input[name="trip"]').val(response.data.name)

      reportStatus(`Successfully Loaded Trip #${tripID}`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
    });

};

const readFormData = () => {

  console.log($('#reservation-form').serialize());

  return $('#reservation-form').serialize();
};

const createReservation = (event) => {
  event.preventDefault();

  reportStatus("Requesting Reservation");

  const tripData = readFormData();
  const tripID = $(`#reservation-form input[name="id"]`).val();

  console.log(tripData);

  axios.post(baseURL + `/${tripID}/reservations`, tripData)
    .then((response) => {
      reportStatus('Successfully Reserved Trip!');

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
