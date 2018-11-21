const reportStatus = (message) => {
  $("#status-message").html(message);
}

const listTrips = () => {
  reportStatus("Loading trips...")
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get( "https://trektravel.herokuapp.com/trips")

  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    tripList.append('<h2 class="card-title list-group-item">All Trips</h2>')

    response.data.forEach((trip) => {
    console.log(trip);
    tripList.append(`<button class="list-group-item list-group-item-action">${trip.name}</button>`);
    });
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};

$(document).ready(() => {
  $("#view-trip").click(listTrips);
})
