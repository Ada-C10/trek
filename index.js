const URL = 'https://trektravel.herokuapp.com/trips';


const loadTrips = () => {
  const tripList = $('#trip-list');

  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });

  });
};


$(document).ready(() => {
  $('#trips').click(loadTrips);
});
