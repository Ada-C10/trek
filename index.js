const URLBASE = 'https://trektravel.herokuapp.com';
const TRIPSPATH = '/trips'

const reportStatus = (message => {
  $('#status-message').html(message);
});

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

const buildClickHandler = (trip) => {
  return () => {
    $("#trip-list")
  }
}

const getTrips = () => {
  // Report Status
  reportStatus('loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  const endpoint = `${URLBASE}${TRIPSPATH}`

  axios.get(endpoint)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    })
}



$(document).ready(() => {
  $('#load-trips-button').click(getTrips);
  // // loadPets()
  // $('#pet-form').submit(createPet);
});
