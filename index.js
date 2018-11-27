const URL = 'https://trektravel.herokuapp.com/trips';

//
// Status Mancontinentment
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

//
// Loading Trips
//
const loadtrips = () => {
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
      $('#trip-details').append(`<li>Trip ID: ${data.id}`);
      $('#trip-details').append(`<li>Destination: ${data.name}`);
      $('#trip-details').append(`<li>Continent: ${data.continent}`);
      $('#trip-details').append(`<li>Duration: ${data.weeks}`);
      $('#trip-details').append(`<li>Cost: $${data.cost}`);
      $('#trip-details').append(`<li>About This Trip: ${data.about}`);

    })
    .catch((error) => {
      reportStatus(`Encountered an error loading trip ${id}: ${error.message}`)
    })
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

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="continent"]`).val('');
  $(`#trip-form input[name="category"]`).val('');
  $(`#trip-form input[name="weeks"]`).val('');
  $(`#trip-form input[name="cost"]`).val('');
  $(`#trip-form input[name="about"]`).val('');

}

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
  $('#load').click(loadtrips);
  $('#trip-form').submit(createTrip);
});
