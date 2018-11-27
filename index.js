let URL = 'https://trektravel.herokuapp.com/trips';

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
  reportStatus("loading trips...");
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      let button = createButton()
      tripList.append(`<li>${trip.name}</li>`);
      tripList.append(button)
      button.on('click', () => {
        clickDetails(`${trip.id}`);
      })
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
  });
};

function createButton() {
  const button = $('<button/>', {
    text: 'See Trip Details',
    id: 'details-btn'
  });
  return button
}

const clickDetails = (id) => {

  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const tripForm = createForm(id);
  const tripURL = (URL + `/` + id)
  axios.get(tripURL)
  .then((response) => {
    tripDetails.append(`<li class="name">${response.data.name}, ${response.data.continent}</li>`);
    tripDetails.append(`<li class="description">${response.data.about}</li>`);
    tripDetails.append(`<li class="description">${response.data.weeks} week(s)</li>`);
    tripDetails.append(`<li class="description"> $${response.data.cost}</li>`);
    tripDetails.append(`<li class="description">Category: ${response.data.category}</li>`);
  })
}

const createForm = (id) => {
  const tripForm = $('#trip-form')
  tripForm.empty();
   tripForm.append(`
    <h2 class='form-title'>Reserve Trip</h2>
    <div>
      <label class='form' for="name">Your name</label>
      <input class='name' type="text" name="name" />
    </div>
    <div>
      <label class='form' for="age">Age</label>
      <input class='age' type="text" name="age" />
    </div>
    <div>
      <label class='form' for="email">Email</label>
      <input class='email' type="text" name="email" />
    </div>
    <div>
      <input type="hidden" name="trip_id" value=${id} />
    </div>
    <input type="submit" class='submit' name="reserve" value="Reserve" class="btn btn-primary" />
  `);
  return tripForm
 }

const readFormData = () => {
  const parsedFormData = {};

  const tripFromForm = $(`#trip-form input[name="trip_id"]`).val();
   parsedFormData['trip_id'] = tripFromForm ? tripFromForm : undefined;

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const ageFromForm = $(`#trip-form input[name="age"]`).val();
  parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="age"]`).val('');
  $(`#trip-form input[name="email"]`).val('');
}

const createReservation = (event) => {
  event.preventDefault();

  const reservationData = readFormData();
  let reservationURL = (URL + `/` + reservationData.trip_id + `/` + `reservations`)
  reportStatus('Sending trip data...');

  axios.post(reservationURL, reservationData)
  .then((response) => {
    reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
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

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createReservation);
});
