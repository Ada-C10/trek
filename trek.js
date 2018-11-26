const URL = "https://trektravel.herokuapp.com/trips";


const reportStatus = (message) => {
  $('#status-message').html(message);
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

const listTrips = () => {
  reportStatus("Loading trips...")
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
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


const tripsByContinentList = () => {
  reportStatus("Click on a continent to view trips")
  const tripList = $('#trip-list');
  tripList.empty();

  const continents = ['Africa', 'Antarctica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];

  tripList.append(
    continents.forEach((continent) => {
        tripList.append(`<a class="nav-link" id=${encodeURIComponent(continent)}>${continent}</a>`);
      })
  );
};


const showContinentTrips = (continent) => {
  const tripList = $('#trip-list');
  tripList.empty();
  reportStatus(`Viewing ${continent} trips.`)
  axios.get(`${URL}/continent?query=${continent}`)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} ${decodeURIComponent(continent)} trips`)
      tripList.append(`<h2 class="card-title list-group-item">${decodeURIComponent(continent)} Trips</h2>`)
      response.data.forEach((trip) => {
        tripList.append(`<button class="list-group-item list-group-item-action" id=${trip.id}>${trip.name}</button>`);
      });
    })
    .catch((error) => {
      reportStatus(error);
      // console.log(error);
    });
  };


const showTripDetail = (id) => {
  const tripDetail = $('#trip-detail');
  tripDetail.empty();
  const tripReservation = $('#reservation-form');
  tripReservation.empty();

  const tripURL = `${URL + "/" + id}`;

  axios.get( tripURL )
  .then((response) => {
    tripDetail.append(
      `<h2 class="card-title list-group-item">Trip Details</h2>
      <p class="list-group-item"><strong>Name:</strong>&nbsp${response.data.name}</p>
      <p class="list-group-item"><strong>Continent:</strong>&nbsp${response.data.continent}</p>
      <p class="list-group-item"><strong>Category:</strong>&nbsp${response.data.category}</p>
      <p class="list-group-item"><strong>Weeks:</strong>&nbsp${response.data.weeks}</p>
      <p class="list-group-item"><strong>Cost:</strong>&nbsp$${parseFloat(response.data.cost).toFixed(2)}</p>
      <p class="list-group-item"><strong>About:</strong><br>${response.data.about}</p>`)

    tripReservation.append(
      `<h2 class="card-title list-group-item">Reserve Trip</h2>
        <div class="card-body">
          <div class="card-text">
            <label for="name">Your Name:</label>
            <input type="text" name="name"/>
          </div>
          <div class="card-text">
            <label for="age">Your Age:</label>
            <input type="number" name="age" min="1"/>
          </div>
          <div class="card-text">
            <label for="email">Email:</lable>
            <input type="text" name="email"/>
          </div>
          <div class="card-text">
            <label for="trip-name">Trip Name:</label>
            <input type="text" name="trip-name" value="${response.data.name}"/>
            <input type="hidden" name="trip_id" value="${response.data.id}"/>
          </div>
        </div>
        <input type="submit" name="add-reservation" value="Add Reservation" id="create-reservation-button" />
      </form>`)
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};


const createReservation = (event) => {
  event.preventDefault();

  reportStatus("Saving reservation...");
  console.log("Making reservation");

  const trip_id = $('input[name="trip_id"]').val();
  const trip_name = $('input[name=trip-name]').val();

  const data = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    age: $('input[name="age"]').val(),
  };
  console.log(`Trip: ${trip_id}`);

  const postURL = `${URL}/${trip_id}/reservations`;
  console.log(postURL);

  axios.post(postURL, data)
    .then((response) => {
      console.log(`Trip id to reserve: ${data.trip_id}`)
      console.log(`Trip for ${data.name} is reserved.`);
      reportStatus(`${trip_name} is reserved for ${response.data.name}.`);
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors) {
    reportError(`Encountered an error: ${error.message}`, error.response.data.errors);
    } else {
    reportStatus(`Encountered an error: ${error.message}`);
    }
    });
};

$(document).ready(() => {
  $("#view-trip").click(listTrips);

  $("#trip-list").on("click", ".list-group-item-action", function() {
    const id = $(this)[0].id;
    console.log(id);
    showTripDetail(id);
  });

  $("#reservation-form").submit(createReservation);

  $("#continents").click(tripsByContinentList);

  $("#trip-list").on("click", ".nav-link", function() {
    const continent = $(this)[0].id;
    console.log(continent);
    showContinentTrips(continent);
  });
});
