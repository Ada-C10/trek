const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};


const loadTrips = () => {
  reportStatus("loading trips...")

  const tripList = $('#trip-list');
  tripList.empty();


  axios.get(URL)

  .then((response) => {

    reportStatus(`successfully loaded ${response.data.length}`)

    response.data.forEach((trip) => {
      // tripList.append(`<li><a href="https://trektravel.herokuapp.com/trips/${trip.id}"></li>`);

      tripList.append(`<li>${trip.name}</li>`);
    });

  })
  .catch((error) => {
    reportStatus(error);
  });



};


$(document).ready(() => {
  $('#load').click(loadTrips)
});
