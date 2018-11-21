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

  // Actually load the pets - axis.get() returns a promise. .then is called is called on return value of axis.get().
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

// How do we get details of trip they click on?
// We have a url for the get request but how do we use that/get the id?
function getTripData(trip) {
  // console.log(trip);
  // console.log(trip.id);
  let URL = `https://trektravel.herokuapp.com/trips/${trip.id}`;
  axios
    .get(URL)
    .then(response => {
      reportStatus(`Successfully loaded trip data`);
      console.log("RESPONSE");
      console.log(response);
      // Create the object to append
      // response.data.forEach(pet => {
      //   petList.append(`<li>${pet.name}</li>`);
      // });
    })
    .catch(error => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    });
}
$(document).ready(() => {
  $("#load").click(loadTrips);
  $("#trip-list").on("click", "li", function(event) {
    // Perform get request
    getTripData(this);
    // console.log(event);
    // Get trip data with id via get request (store in another function and call here?)
    // Show trip details in a new section
  });
});
