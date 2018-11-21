const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus("loading all trips...");

  const tripList = $('#tripList');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    // console.log("In the axios.get => .then method");
    response.data.forEach((trip) => {
      // console.log(trip.name);
      tripList.append(`<li>${trip.name}</li>`);
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
