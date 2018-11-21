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

    response.data.forEach((trip) => {
    console.log(trip);
    tripList.append(`<li>${trip.name}</li>`);
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
