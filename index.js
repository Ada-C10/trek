
const URL = 'https://trektravel.herokuapp.com/trips';


const reportStatus = (message) => { $('#status-message').html(message); };

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripsList.append(`<li class='trip ${trip.id}'>${trip.name}</li>`)
    });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Error: ${error.message}`);
  });
};


$(document).ready(() => {
  $('#load-trips-button').click(loadTrips);
});
