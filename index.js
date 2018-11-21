const allTripURL = "https://trektravel.herokuapp.com/trips"

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
  reportStatus('Loading trips...');

  const tripList = $('.list-trips');
  tripList.empty();

  axios.get(allTripURL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<p>${trip.name}</p>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

//  READY GO!
$(document).ready(() => {
  $('.load-trips').click(loadTrips);
  // $('#pet-form').submit(createPet);
});
