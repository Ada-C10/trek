
const BaseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $('#travel-list');
  tripList.empty();

  axios.get(BaseURL)
  .then((response) =>{
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`)
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
  });



};



$(document).ready(()=> {
  $('#load').click(loadTrips)
});
