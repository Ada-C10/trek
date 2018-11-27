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
  const tripsShow = $('#trip-view');
  const tripID = trip.id;
  return () => {
    reportStatus('Loading trip...');
    tripsShow.empty();
    // Actually load the trips
    axios.get(BASE_URL + tripID)
    .then((response) => {
      reportStatus(`Found your get-away`);
      const newTrip = $(`<h2>${response.data.name}</h2>
        <h3>$${response.data.cost} ${response.data.continent}, ${response.data.weeks} weeks</h3>
         <ul>
         <li><strong>Trip type:</strong> ${response.data.category}</li>
         <li><strong>Details:</strong> ${response.data.about}</li>
         </ul>`);
      tripsShow.append(newTrip);
      const reserveButton = $(`<button class="reserve">Sign me up!</button>`)
      tripsShow.append(reserveButton);
      const reserveForm = reserveFormHandler(trip);
      reserveButton.click(reserveForm);
    })

    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };
};

const reserveFormHandler = (trip) => {

  const tripID = trip.id;

  const form = `<h3>Add a reservation for ${trip.name}</h3>
  <form id="reservation-form">
  <div>
  <label for="name">Name</label>
  <input type="text" name="name" />
  </div>
  <div>
  <label for="age">Age</label>
  <input type="number" name="age" />
  </div>
  <div>
  <label for="email">Email</label>
  <input type="text" name="email" />
  </div>
  <input id ="reserve-button" type="submit" name="add-reservation" value="Reserve it!" />
  </form>`

  // Prep work
  const tripsShow = $('#trip-view');

  return () => {
    reportStatus('Loading resevation...');
    tripsShow.append(form);
    const result = (event) => {
      event.preventDefault();
      createReservation( tripID );
    };

    $('#reservation-form').submit(result);
  }
};

const createReservation = ( tripID ) => {

  const readFormData = () => {
    const parsedFormData = {};

    const nameFromForm = $(`#reservation-form input[name="name"]`).val();
    parsedFormData['name'] = nameFromForm

    const ageFromForm = $(`#reservation-form input[name="age"]`).val();
    parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;

    const emailFromForm = $(`#reservation-form input[name="email"]`).val();
    parsedFormData['email'] = emailFromForm

    return parsedFormData;
  };

  const reservationData = readFormData();

  const clearForm = () => {
    $(`#reservation-form input[name="name"]`).val('');
    $(`#reservation-form input[name="age"]`).val('');
    $(`#reservation-form input[name="email"]`).val('');
  }

  const url = BASE_URL + tripID + `"/reservations?name=${reservationData['name']}&age=${reservationData['age']}&email=${reservationData['email']}`;

  reportStatus(`Sending reservation data...`);

  axios.post(url)
      .then((response) => {
        reportStatus(`Successfully added reservation with ID ${response.data.id}!`);
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
//
// OK GO!!!!!
//
$(document).ready(() => {
  $('#load').click(loadTrips);
});
