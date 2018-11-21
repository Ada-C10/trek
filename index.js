const TRIPS = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

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


const loadTrips = () => {
  reportStatus("* ~ * loading trips ~ * ~")
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(TRIPS)
  .then((response) => {
    reportStatus(`Successfully loaded trips!`)

    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportError(error)
    console.log('something went wrong');
  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
  // $('#trip-form').submit(createTrip);
});
