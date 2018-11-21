const URL = "https://trektravel.herokuapp.com/trips";
// const reportStatus = (message) => {
//   $('#status-message').html(message);
// };

const loadTrips = () => {
  const div = $('<div></div>');
  div.addClass('col-md-6');
  const tripList = $('#trip');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      div.append('<h4>All Trips</h4>')
      response.data.forEach((trip) => {
        div.append(`<li>${trip.name}</li>`);
      });
      tripList.append(div);
      // reportStatus(`Successfully loaded ${sevenWonders.length} wonders`);
    })
    .catch((error) => {
      console.log(error);
    });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
});
