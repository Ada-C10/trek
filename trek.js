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
      tripList.append(`<button class="list-group-item list-group-item-action" id=${trip.id}>${trip.name}</button>`);
    });
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};


const showTripDetail = (id) => {
  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  axios.get( `https://trektravel.herokuapp.com/trips/${id}`)

  .then((response) => {
    tripDetail.append('<h2 class="card-title list-group-item">Trip Details</h2>')
    console.log(`${response.data.name}`);
    tripDetail.append(`<p class="list-group-item"><strong>Name:</strong>&nbsp${response.data.name}</p>`);
    tripDetail.append(`<p class="list-group-item"><strong>Continent:</strong>&nbsp${response.data.continent}</p>`);
    tripDetail.append(`<p class="list-group-item"><strong>Category:</strong>&nbsp${response.data.category}</p>`);
    tripDetail.append(`<p class="list-group-item"><strong>Weeks:</strong>&nbsp${response.data.weeks}</p>`);
    tripDetail.append(`<p class="list-group-item"><strong>Cost:</strong>&nbsp$${parseFloat(response.data.cost).toFixed(2)}</p>`);
    tripDetail.append(`<p class="list-group-item"><strong>About:</strong><br>${response.data.about}</p>`);
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};


// const buildIncrementer = (name) => {
//   let callCount = 0;
//
//   const callCountingFunction = () => {
//     callCount += 1;
//     console.log(`This is call number ${callCount} for function ${name}`);
//   }
//
//   return callCountingFunction;
// };




$(document).ready(() => {
  $("#view-trip").click(listTrips);

  $("#trip-list").on("click", ".list-group-item-action", function() {
    const id = $(this)[0].id;
    console.log(id);
    showTripDetail(id);
  });
});
