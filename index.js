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

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li><a href = 'http://www.google.com'>${trip.name}</a></li><li>${trip.id}`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
    console.log(error);
  });
};


$(document).ready(() => {
  $('#trips').click(loadTrips);
});
