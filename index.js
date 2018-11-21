// index.js
const URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = message => {
  $("#status-message").html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const loadTrips = () => {
  reportStatus("Loading trips...");
  // Prep work
  const tripList = $("#trip-list");
  tripList.empty();

  // Actually load the trips - axis.get() returns a promise. .then is called is called on return value of axis.get().
  axios
    .get(URL)
    .then(response => {
      // .then runs if call succeeds
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach(trip => {
        tripList.append(`<li class="trip", id=${trip.id}>${trip.name}</li>`);
        // trip.click(function() {
        //   // TODO Perform get request to get trip data
        //   // TODO Append trip details to new section
        // });
      });
    })
    // .catch is called on return value of .then()
    .catch(error => {
      //.catch runs if call fails
      reportStatus(`Encountered an error while loading pets: ${error.message}`);
    });
};
const form =
  `<div class="container">` +
  `<form id=trip-form>` +
  `<label for="name">` +
  `<input type="text" name="name">` +
  "Name" +
  `</input>` +
  `</label>` +
  `<input type="submit" name="add-reservation" value="Complete Reservation">` +
  `</form>` +
  `</div>`;
const showReservationForm = trip => {
  // Appends the form
  $("#reservationForm").append(form);
  // $("#reservationForm").append("<label for="name">Name</label>");
  // $("#reservationForm").append("</div>");
};
const createReservation = trip => {
  // trip.preventDefault()?
  // Says what to do with form submit
  // Name, email, trip name (pulled in from what they clicked on?),
  // Requires name and email, can also accept age
  let URL = `https://trektravel.herokuapp.com/trips/${trip.id}/reservations`;
  axios
    .post(URL)
    .then(response => {
      reportStatus(`Successfully added trip reservation`);
      // Not sure what else to do
    })
    .catch(error => {
      reportStatus(
        `Encountered an error while reserving trip: ${error.message}`
      );
      console.log(error);
    });
};
// How do we get details of trip they click on?
// We have a url for the get request but how do we use that/get the id?
const getTripData = trip => {
  // console.log(trip);
  // console.log(trip.id);
  let URL = `https://trektravel.herokuapp.com/trips/${trip.id}`;
  axios
    .get(URL)
    .then(response => {
      reportStatus(`Successfully loaded trip data`);
      // console.log("RESPONSE");
      // console.log(response);
      // Create the object to append
      const parsedTripData = {};
      parsedTripData.id = response.data.id;
      parsedTripData.name = response.data.name;
      parsedTripData.continent = response.data.continent;
      parsedTripData.details = response.data.about;
      parsedTripData.category = response.data.category;
      parsedTripData.weeks = response.data.weeks;
      parsedTripData.cost = response.data.cost;

      // Append to trip-details section
      $("#trip-details").append("<h1>Details</h1>");
      // For each in parsedTripData
      for (let detail in parsedTripData) {
        $("#trip-details").append(`<h2>${detail}</h2>`);
        $("#trip-details").append(`<p>${parsedTripData[detail]}`);
      }
      // response.data.forEach(pet => {
      //   petList.append(`<li>${pet.name}</li>`);
      // });
    })
    .catch(error => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    });
};
$(document).ready(() => {
  $("#load").click(loadTrips);
  $("#trip-list").on("click", "li", function(event) {
    // Perform get request
    getTripData(this);
    // Show trip form as well in #reservation section
    showReservationForm(this);
  });
});
