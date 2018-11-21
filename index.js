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

const viewTrip = function viewTrip(tripID){
  reportStatus("loading trip details...");
  let tripDetailURL = `${URL}/${tripID}`;
  let tripInfo = $('#tripInfo')
  tripInfo.empty();

  axios.get(tripDetailURL)
    .then((response) => {
      let name = response.data.name;
      let continent = response.data.continent;
      let category = response.data.category;
      let weeks = response.data.weeks;
      let cost = response.data.cost;
      let about = response.data.about;

      tripInfo.append(`<h3>Name: ${name}</h3>`);
      tripInfo.append(`<h3>Continent: ${continent}</h3>`);
      tripInfo.append(`<h3>Category: ${category}</h3>`);
      tripInfo.append(`<h3>Weeks: ${weeks}</h3>`);
      tripInfo.append(`<h3>Cost: $${cost}</h3>`);
      tripInfo.append(`<p>About: ${about}</p>`);
      })
}

$(document).ready(() => {

  $('#trips').click(loadTrips);

  $('#tripList').on('click', 'li', function(event){
    // event.target.id retrieves the id from the element that is clicked
    viewTrip(event.target.id);
  })

});
