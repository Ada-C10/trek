const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

$(document).ready(() => {
  alert("jQuery Works");

  $('#trips').click(function(){
    alert("See All Trips Button Works")
  });

  $('#trips').click(loadTrips);
});
