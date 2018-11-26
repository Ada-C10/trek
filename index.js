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

const loadTrips = () => {
  // Prep work
  const tripList = $('#trek-list');
  // if this .empty is not here, it will keep appending more and more trips to the list.
  tripList.empty();

  // Actually load the trips
  // const $tripList = $('#trip-list')

  axios.get(URL)
  .then((response) => {
    // console.log(response);
    // reportStatus(`Successfully loaded ${response.data.length} trips`)

    response.data.slice(0, 10).forEach((trip) => {

      const $tripItem = $(`<li>${trip.name}</li>`);
      // console.log($tripItem);
      // showing list of trips by name
      tripList.append($tripItem);

      // to show one trip on click
      $tripItem.on('click', () => {
        // $tripItem.empty();
        // console.log(event.target.id);
        // const tripId = event.target.id.split('-')[1];
        // console.log(tripId);
        // trip.empty();
        const tripInfo = $('#single-trek');
        tripInfo.empty();

        axios.get(URL + '/' + trip.id)
        .then((response) => {
          $('#single-trek').append(`<div>
            <h4>Details</h4>
            <ul id="trip-detail"></ul>
            </div>`);
          const trip = response.data;
          // console.log(trip);
          $('#trip-detail').append(`
            <li>${trip.id}</li>
            <li>${trip.name}</li>
            <li>${trip.continent}</li>
            <li>${trip.category}</li>
            <li>${trip.weeks}</li>
            <li>${trip.cost}</li>
            <li>${trip.about}</li>
            `);

            const form = $('#new-reservation');
            reservationForm(form)
          });
        });
      });
    })
    // if there is a problem, call this function instead
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
  };

const reservationForm = (trip) => {
  trip.empty();
    trip.append(`<div>
      <h4>Reserve trek</h4>
      <form id="reservation-form">
        <div>
          <label for="name">Your name</label>
          <input type="text" name="name" placeholder="Your name"/>
        </div>

        <div>
          <label for="email">Your email</label>
          <input type="text" name="email" placeholder="Your email" />
        </div>

        <div>
          <label for="age">Age</label>
          <input type="text" name="age" placeholder="What's your age?"/>
        </div>

        <input type="submit" name="create-reservation" value="Create Reservation"/>
      </form>
      </div>`);
      const tripId = $('#trip-detail li').html()
      const reserve = (event) => {
      event.preventDefault();
      reportStatus('Sending reservation data...');
      // console.log(`"trip" ${trip}`)
      // console.log(`"id" ${tripId}`)
      createTripReservation(tripId);
      // createTripReservation(trip.id);

    };
    $('#reservation-form').submit(reserve);
  };

const clearForm = () => {
    $(`#reservation-form input[name="name"]`).val('');
    $(`#reservation-form input[name="email"]`).val('');
    $(`#reservation-form input[name="age"]`).val('')
};


const createTripReservation = (id) => {
  // Note that createTripReservation is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  // reportStatus('Sending trip reservation data...');

  const info = {
    name: $('#reservation-form input[name="name"]').val(),
    email: $('#reservation-form input[name="email"]').val(),
    age: $('#reservation-form input[age="age"]').val()
  };

  // console.log("potato");

  // console.log(reservationUrl);
  // console.log("potato2");
  // axios.post(URL + `/${trip.id}/reservations`, createTripReservation)
  const postURL = URL + "/" + id + "/reservations";
  console.log(postURL)

  axios.post(postURL, info)
  .then((response) => {
    console.log(response);
    reportStatus(`successfully added trip reservation with name ${response.data.name} and trip ${response.data.trip_id}!`);
    clearForm();
  })
  // no ; before .catch because this would break the chaining of .then and .catch
  .catch((error) => {
    // console.log(error.response);
    // reportStatus(`Encountered an error: ${error.message}`);
    if (error.response.data && error.response.data.errors) {
      // User our new helper method
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      // This is what we had before
      console.log("potato3");
      reportStatus(`Encountered an error: ${error.message}`);
    }
    // const showTrip = createTripReservation(id);
    // $('li:last').click(showTrip);
    // $('#new-reservation').submit(createTripReservation);

  });
};




  $(document).ready(() => {
    $('#load').click(loadTrips);
    // console.log(createTripReservation);
    // ('body').on('submit', '#new-reservation', function() {
    //   createTripReservation(event);
    // });
  });
