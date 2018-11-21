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
        tripList.append(`<li class="trip">${trip.name}</li>`);
      });
    })
    // .catch is called on return value of .then()
    .catch(error => {
      //.catch runs if call fails
      reportStatus(`Encountered an error while loading pets: ${error.message}`);
    });
};
// Showing a trip details on homepage
let showTrip = trip => {
  // Show a trip via this?
};
$(document).ready(() => {
  $("#load").click(loadTrips());
  // If a trip name is clicked, append a new section with trip details
  $(".trip").click(function(event) {
    // Append trip info
    console.log(event);
    // Make helper method to create a nice looking trip ordered list?
    $("#trip-details").append("TEST");
  });
});
