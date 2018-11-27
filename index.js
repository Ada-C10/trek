const URL = 'https://trektravel.herokuapp.com/trips';


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

//
// Loading Trips
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        const oneTrip = $(`<li>${trip.name}</li>`)
        tripList.append(oneTrip);

        oneTrip.on('click', () => {getOneTrip(`${trip.id}`)});
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.messmessage}`);
      console.log(error);
    });
};

// Single trip detail
//

const getOneTrip = (id) => {
  const tripURL = URL + '/' + id;

  axios.get(tripURL)
    .then((response) => {
      $('#trip-details').empty();
      const data = response.data;
      $('#trip-details').append(`<h2>Trip Details</h2>`);
      $('#trip-details').append(`<li><strong>Trip ID:</strong> ${data.id}`);
      $('#trip-details').append(`<li><strong>Destination:</strong> ${data.name}`);
      $('#trip-details').append(`<li><strong>Continent:</strong> ${data.continent}`);
      $('#trip-details').append(`<li><strong>Duration:</strong> ${data.weeks}`);
      $('#trip-details').append(`<li><strong>Cost:</strong> $${data.cost}`);
      $('#trip-details').append(`<li><strong>About This Trip:</strong> ${data.about}`);

      $('#new-reservation').empty();
      $('#new-reservation').append(`
        <h1>Create A New Reservation</h1>
        <div>
          <label for="reservationName">Name</label>
          <input type="text" name="reservationName" />
        </div>
        <div>
          <label for="age">Age</label>
          <input type="text" name="age" />
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" name="email" />

        </div>
        <input type="submit" name="create-reservation" value="Add reservation" />
        <input type="hidden" name="trip-id" value="${data.id}"/>
      `);
    })
    .catch((error) => {
      reportStatus(`Encountered an error loading trip ${id}: ${error.message}`)
    });
  };

// Reserving trip



// Creating trips
//
const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const continentFromForm = $(`#trip-form input[name="continent"]`).val();
  parsedFormData['continent'] = continentFromForm ? continentFromForm : undefined;

  const categoryFromForm = $(`#trip-form input[name="category"]`).val();
  parsedFormData['category'] = categoryFromForm ? categoryFromForm : undefined;

  const weeksFromForm = $(`#trip-form input[name="weeks"]`).val();
  parsedFormData['weeks'] = weeksFromForm ? weeksFromForm : undefined;

  const costFromForm = $(`#trip-form input[name="cost"]`).val();
  parsedFormData['cost'] = costFromForm ? costFromForm : undefined;

  const aboutFromForm = $(`#trip-form input[name="about"]`).val();
  parsedFormData['about'] = aboutFromForm ? aboutFromForm : undefined;
};
const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="continent"]`).val('');
  $(`#trip-form input[name="category"]`).val('');
  $(`#trip-form input[name="weeks"]`).val('');
  $(`#trip-form input[name="cost"]`).val('');
  $(`#trip-form input[name="about"]`).val('');
};

// creating reservation
const readReservationFormData = () => {
  const parsedFormData = {};

  const reservationNameFromForm = $(`#new-reservation input[name="reservationName"]`).val();
  parsedFormData['name'] = reservationNameFromForm ? reservationNameFromForm : undefined;

  const ageFromForm = $(`#new-reservation input[name="age"]`).val();
  parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;

  const emailFromForm = $(`#new-reservation input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  const reservationTripID = $(`#new-reservation input[name="trip-id"]`).val();
  parsedFormData['trip-id'] = reservationTripID ? reservationTripID : undefined;

  return parsedFormData;
};

  // reservation
  const clearReservationForm = () => {

  $(`#reservation-form input[name="reservationName"]`).val('');
  $(`#reservation-form input[name="age"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
  $(`#reservation-form input[name="trip-id"]`).val('')

};

// create reservation

const createReservation = (event) => {
  // Note that createtrip is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a pcontinent reload
  event.preventDefault();

  const tripData = readReservationFormData();
  console.log(tripData);

  reportStatus('Sending trip data...');
  const reservationURL = URL + '/' + tripData["trip-id"] + '/reservations'

  axios.post(reservationURL, tripData)
    .then((response) => {
      reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
      clearReservationForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.messmessage}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.messmessage}`);
      }
    });
  };

// create trip

const createTrip = (event) => {
  // Note that createtrip is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a pcontinent reload
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Sending trip data...');

  axios.post(URL, tripData)
    .then((response) => {
      reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.messmessage}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.messmessage}`);
      }
    });
};

//
// OK GO!!!!!
//
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createTrip);
  $('#new-reservation').submit(createReservation);
});
