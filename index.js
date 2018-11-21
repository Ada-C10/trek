const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const URL = `https://trektravel.herokuapp.com/trips`;
  const tripList = $('#trip-list');
  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });
    reportStatus(`Successfully loaded all trips`);

  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
