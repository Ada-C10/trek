const baseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {

  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(baseURL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });
};


$(document).ready(() => {
  $('#load').click(loadTrips);
  // $('#pet-form').submit(createPet);
  // loadPets();
});
