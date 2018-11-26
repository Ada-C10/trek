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

const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      tripList.append('<h2>All Trips</h2>')
      response.data.forEach( (trip) => {
        tripList.append(`<li id="${trip.id}"><a href="#">${trip.name}</a></li>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const getTripDetails = (trip) => {
  reportStatus('Retrieving trip details...');

  const tripDetails = $('#trip-details');
  tripDetails.empty();


  axios.get(URL + `/${trip.id}`)
    .then((response) => {
      reportStatus('');
      tripDetails.append(`
        <h2>Trip Details</h2>
        <li>Name: ${response.data.name}</li>
        <li>Continent: ${response.data.continent}</li>
        <li>Category: ${response.data.category}</li>
        <li>Weeks: ${response.data.weeks}</li>
        <li>Cost: $${response.data.cost}</li>
        <li>About: ${response.data.about}</li>`);
    });

};

const getRezForm = (trip) => {
  const rezForm = $('#rez-form')
  rezForm.empty();

  rezForm.append(`
    <h2>Reserve Trip</h2>
    <div>
      <label for="name">Your name</label>
      <input type="text" name="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
    </div>
    <div>
      <input type="hidden" name="trip_id" value=${trip.id} />
    </div>
    <input type="submit" name="reserve" value="Reserve" class="btn btn-primary" />
  `);

}

const readFormData = () => {
  const parsedFormData = {};

  const tripFromForm = $(`#rez-form input[name="trip_id"]`).val();
  parsedFormData['trip_id'] = tripFromForm ? tripFromForm : undefined;

  const nameFromForm = $(`#rez-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#rez-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#rez-form input[name="name"]`).val('');
  $(`#rez-form input[name="email"]`).val('');
  $(`#rez-form input[name="trip"]`).val('');
}

const reserveTrip = (event) => {
  console.log(event);
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Sending reservation data...');

  axios.post(URL + '/' + tripData.trip_id + '/reservations', tripData)
    .then((response) => {
      reportStatus(`Successfully reserved a trip with ID ${response.data.id}!`);
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

  $('#trip-list').on('click', 'li', function(trip) {
    console.log(this.id);
    getTripDetails(this);
    getRezForm(this);
  });

  $('#rez-form').submit(reserveTrip);
});
