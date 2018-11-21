const URL = 'https://trektravel.herokuapp.com/trips'

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
