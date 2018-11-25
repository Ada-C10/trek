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
    reportStatus(`Successfully loaded ${response.data.length} trips`)
    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);

    })
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  })
}

// https://trektravel.herokuapp.com/trips/1/reservations
const createReservation = (event) => {
  event.preventDefault();

  let nameFromForm = $('input[name="name"]').val();
  let emailFromForm = $('input[name="email"]').val();
  let tripFromForm = $('input[name="trip"]').val();
  let tripid = $('input[name="reserveSpot"]').attr('id');
  let URL = `https://trektravel.herokuapp.com/trips/${tripid}/reservations`

  const dataToSend = {
    name: nameFromForm,
    email: emailFromForm,
    trip_id: tripid
  };

  axios.post(URL, dataToSend)
    .then((response) => {
      console.log(response);
      reportStatus(`Reservation Successfully Added with ID: ${response.data.id} for TripName: ${tripFromForm} for Guest: ${nameFromForm}`);
      $('#tripForm')[0].reset();
      $('#tripInfo').hide();
      $('#reserveTrip').hide();
    })
    .catch((error) => {
      reportStatus(`Encountered an error: ${error.message}`);
    })
}

const viewTrip = function viewTrip(tripID){
  reportStatus("loading trip details...");
  let tripDetailURL = `${URL}/${tripID}`;
  let tripInfo = $('#tripInfo')
  tripInfo.empty();

  $('#tripInfo').show();
  $('#tripInfo').css('border', 'black 1px solid');
  $('#reserveTrip').show();
  $('#reserveTrip').css('border', 'black 1px solid');

  axios.get(tripDetailURL)
    .then((response) => {

      reportStatus("Trip details loaded")

      let tripid = response.data.id;
      let name = response.data.name;
      let continent = response.data.continent;
      let category = response.data.category;
      let weeks = response.data.weeks;
      let cost = response.data.cost.toFixed(2);
      let about = response.data.about;

      // Trip Details
      tripInfo.append(`<h3>Name: ${name}</h3>`);
      tripInfo.append(`<h3>Continent: ${continent}</h3>`);
      tripInfo.append(`<h3>Category: ${category}</h3>`);
      tripInfo.append(`<h3>Weeks: ${weeks}</h3>`);
      tripInfo.append(`<h3>Cost: $${cost}</h3>`);
      tripInfo.append(`<p>About: ${about}</p>`);

      // Populating Reservation Form
      $('input[name="trip"]').val(`${name}`);

      // Binding trip id to submit button id
      $('input[name="reserveSpot"]').attr('id', `${tripid}`)

      })
      .catch((error) => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
      });
}

$(document).ready(() => {

  $('#trips').click(loadTrips);

  $('#tripList').on('click', 'li', function(event){
    // event.target.id retrieves the id from the element that is clicked
    viewTrip(event.target.id);
  })

  $('#reserveTrip').hide();

  $('#tripForm').submit(createReservation);
});
