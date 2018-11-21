const URL = 'https://trektravel.herokuapp.com/trips';

// Status Reports
const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, error) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

// Load Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      }
    });
};

$(document).ready(() => {
  $('#see-trips').click(loadTrips);
  // $('#pet-form').submit(createPet);
})
