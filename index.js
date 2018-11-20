// index.js
const URL = "https://trektravel.herokuapp.com/trips";

const loadTrips = () => {
  // Prep work
  const tripList = $("#trip-list");
  tripList.empty();

  // Actually load the pets - axis.get() returns a promise. .then is called is called on return value of axis.get().
  axios
    .get(URL)
    .then(response => {
      // .then runs if call succeeds
      response.data.forEach(trip => {
        tripList.append(`<li>${trip.name}</li>`);
      });
    })
    // .catch is called on return value of .then()
    .catch(error => {
      //.catch runs if call fails
      console.log(error);
    });
};

$(document).ready(() => {
  $("#load").click(loadTrips());
});
