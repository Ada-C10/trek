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
    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);

    })
  })

  .catch((error) => {
    console.log("In the axios.get => .catch method");
  })
}


$(document).ready(() => {

  $('#trips').click(loadTrips);

  $('#tripList').on('click', 'li', function(event){
    alert("Each trip tagged with .tripItem");
    console.log(event.target.id);
    

  })

});
