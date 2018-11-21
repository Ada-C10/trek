const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus("loading all trips...");

  const tripList = $('#tripList');
  tripList.empty();
  tripList.append('<h2>All Trips</h2>');

  axios.get(URL)
  .then((response) => {
    // console.log("In the axios.get => .then method");
    response.data.forEach((trip) => {
      // console.log(trip.name);
      // tripList.append(`<li>${trip.name}</li>`);
      tripList.append(`<li><a href="#">${trip.name}</a></li>`);

    })
  })

  .catch((error) => {
    console.log("In the axios.get => .catch method");
  })
}





$(document).ready(() => {
  alert("jQuery Works");

  $('#trips').click(function(){
    alert("See All Trips Button Works")
  });

  $('#trips').click(loadTrips);
});
