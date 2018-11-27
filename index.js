const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-msg').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadAllTrips = () => {
  $('#bg-img-box').addClass('bg-blur')
  const allTrips = $('#all-trips');
  allTrips.empty();
  reportStatus('Loading trips...');
  allTrips.append('<table id="trip-table"></table>')
  const tripTable = $('#trip-table');
  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips!`);
      tripTable.append('<tr><th><h2>All Trips</h2></th></tr>');
      response.data.forEach((trip) => {
        tripTable.append(`<tr id="trip-${trip.id}"><td>${trip.name}</td></tr>`);
        // build a click handler for each element id
        $("#trip-table").on("click", `#trip-${trip.id}`, function() {
          loadTripDetails(trip.id);
        });
      });
      $("table").addClass("table-border");
    })
    .catch((error) => {
     reportStatus(`Encountered an error while loading trips: ${error.message}`);
     console.log(error);
  });
};

const loadTripDetails = (tripId) => {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  reportStatus('Loading trip details...');
  tripDetails.append('<table id="trip-card"></table>')
  const tripCard = $('#trip-card');
  axios.get(`${URL}/${tripId}`)
    .then((response) => {
      reportStatus(`Successfully loaded trip ${tripId}!`);
      tripCard.append('<tr><th><h2>Trip Details</h2></th></tr>');
      const trip = response.data;
      console.log(trip);
      tripCard.append(
        `<tr>
          <td>
            <ul>
              <li><h3><p>Name:</p> <span class="trip-name">${trip.name}</span></h3></li>
              <li><p>Continent:</p> ${trip.continent}</li>
              <li><p>Category:</p> ${trip.category}</li>
              <li><p>Weeks:</p> ${trip.weeks}</li>
              <li><p>Cost:</p> $${trip.cost}</li>
              <li><p>About:</p> ${trip.about}</li>
            </ul>
          </td>
        </tr>`);
      loadReserveTripForm(trip);
      $("table").addClass("table-border");
    })
    .catch((error) => {
     reportStatus(`Encountered an error while loading trips: ${error.message}`);
     console.log(error);
  });
};

const reserveTripForm =
  `<table id="reserve-trip-card">
    <tr><th><h2 id="reservation-form-header">Reserve A Trip</h2></th></tr>
    <tr><td>
      <form id="trip-form">
          <div>
            <label for="name">Your Name</label>
            <input type="text" name="name" />
          </div>

          <div>
            <label for="email">Email</label>
            <input type="text" name="email" />
          </div>

          <div>
            <label for="age">Age</label>
            <input type="number" name="age" />
          </div>

          <input class="submit-btn" type="submit" name="submit-reservation" value="Reserve" />
        </form>
      </td></tr>
    </table>`;

const loadReserveTripForm = (trip) => {
  const reserveTrip = $('#reserve-trip');
  reserveTrip.html(reserveTripForm);
  $("table").addClass("table-border");
  $('#reservation-form-header').append(` To <span class="trip-name" id="to-which-trip">${trip.name}</span>`);
  $('#reserve-trip').on("submit", "#trip-form", function(event) {
    event.preventDefault();
    $(window).scrollTop(0);
    reportStatus('Sending form data...');
    createReservation(trip.id);
  });
};

const readFormData = () => {
  let tripForm = document.getElementById("trip-form");
  const tripData = new FormData(tripForm);
  return tripData;
};

const clearForm = () => {
  $("#trip-form")[0].reset();
};

const createReservation = (tripId) => {
  postUrl = `${URL}/${tripId}/reservations`
  axios.post(postUrl, readFormData())
    .then((response) => {
      console.log(response);
      reportStatus(`Success! You're on your way!
        (RESERVATION ID: ${response.data.id}
        TRIP ID: ${response.data.trip_id})`
      );
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

$(document).ready(() => {
  $('#load-trips').click(loadAllTrips);
  $('#app-title').click(function() {
    location.reload(true);
  })
});
