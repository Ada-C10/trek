const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadAllTrips = () => {
  const allTrips = $('#all-trips');
  allTrips.empty();
  reportStatus('<strong>Loading trips...</strong>');
  allTrips.append('<table id="trip-table"></table>')
  const tripTable = $('#trip-table');
  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      tripTable.append('<tr><th><h1>All Trips</h1></th></tr>');
      response.data.forEach((trip) => {
        tripTable.append(`<tr id="trip-${trip.id}"><td>${trip.name}</td></tr>`);
        // build a click handler for each element id
        $("#trip-table").on("click", `#trip-${trip.id}`, function() {
          return loadTripDetails(trip.id);
        });
      });
      $("table, th, td").addClass("table-border");
    })
    .catch((error) => {
     reportStatus(`Encountered an error while loading trips: ${error.message}`);
     console.log(error);
  });
};

const loadTripDetails = (tripId) => {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  reportStatus('<strong>Loading trip details...</strong>');
  tripDetails.append('<table id="trip-card"></table>')
  const tripCard = $('#trip-card');
  axios.get(`${URL}/${tripId}`)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trip`);
      tripCard.append('<tr><th><h1>Trip Details</h1></th></tr>');
      const trip = response.data;
      console.log(trip);
      tripCard.append(`<tr><td>
          <h1>Name: ${trip.name}</h1>
          <p><strong>Continent: <small>${trip.continent}</small></strong></p>
          <p><strong>Category: <small>${trip.category}</small></strong></p>
          <p><strong>Weeks: <small>${trip.weeks}</small></strong></p>
          <p><strong>Cost: <small>$${trip.cost}</small></strong></p>
          <p><strong>About:</strong></p>
          <p>${trip.about}</p>
        </td></tr>`);
      $("table, th, td").addClass("table-border");
    })
    .catch((error) => {
     reportStatus(`Encountered an error while loading trips: ${error.message}`);
     console.log(error);
  });
};

$(document).ready(() => {
  $('#load-trips').click(loadAllTrips);
});
