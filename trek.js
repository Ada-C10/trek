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
  const tripReservation = $('#reservation-form');
  tripReservation.empty();

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

    tripReservation.append('<h2 class="card-title list-group-item">Reserve Trip</h2>')
    console.log(`${response.data.name}`);
    tripReservation.append(
      `<form>
        <div class="card-body">
          <div class="card-text">
            <label for="cust-name">Your Name:</label>
            <input type="text" name="cust-name"/>
          </div>
          <div class="card-text">
            <label for="email">Email:</lable>
            <input type="text" name="email"/>
          </div>
          <div class="card-text">
            <label for="trip-name">Trip Name:</label>
            <input type="text name="trip-name" value="${response.data.name}"
          </div>
          <div class="card-text">
            <input type="submit" name="add-reservation" value="Add Reservation" id="create-reservation" />
        </div>
      </form>`)
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};

$(document).ready(() => {
  $("#view-trip").click(listTrips);

  $("#trip-list").on("click", ".list-group-item-action", function() {
    const id = $(this)[0].id;
    console.log(id);
    showTripDetail(id);
  });
});
