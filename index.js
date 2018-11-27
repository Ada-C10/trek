const reportStatus = (message) => {
  $('#status-message').html(message);
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

const URL = "https://trektravel.herokuapp.com/trips"


const loadTrips = () => {
  // reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  // tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li><a href="#" id="${trip.id}">${trip.name}</a></li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


const showTrip = (id) => {
  // reportStatus('Loading your next adventure...');

  const tripInfo = $('.trip-info');
  tripInfo.empty();

  const tripReserveration = $('.new-trip');
  tripReserveration.empty();

  axios.get(URL + "/" + id)
  .then((response) => {
    let trip = response.data
    tripInfo.append(`<h2>${trip.name}</h2><li><strong>Reference Number:</strong> ${trip.id}</li>
      <li><strong>Category:</strong> ${trip.category}</li>
      <li><strong>Continent:</strong> ${trip.continent}</li>
      <li><strong>Weeks:</strong> ${trip.weeks}</trip>
      <li><strong>Cost:</strong> $${trip.cost.toFixed(2)}</li>
      <p><strong>Details:</strong> ${trip.about}</p>
      `);
      tripReserveration.append(`<h2>Reservse Your Trip</h2>
      <form id="trip-form">
      <input type="hidden" name="tripid" readonly="readonly" value="${trip.id}"/>
      <label for="name">Name</label>
      <input type="text" name="name" /></br>
      <label for="email">Email</label>
      <input type="text" name="email" /></br>
      <label for="trip">Destination</label>
      <input type="text" name="trip" readonly="readonly" value="${trip.name}"/></br>
      <input type="submit" name="add-trip" value="Book Trip" />
      </form>`).addClass("form-group");

      // Add click handler for reservation form submit
      $("#trip-form").on("submit", function(event) {
        event.preventDefault();
        reserveTrip(trip);
      });

    }).catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };






  const readFormData = () => {
    const parsedFormData = $("#trip-form").serialize();

    return parsedFormData;
  };

  const clearForm = () => {
    $("#trip-form")[0].reset();
  }

  const reserveTrip = (trip) => {
    const formData = readFormData();
    console.log(formData);

    reportStatus('Sending trip data...');

    axios.post(URL + '/' + trip.id + "/reservations", formData)

    .then((response) => {
      reportStatus(`Successfully booked your next adventure to ${response.data.destination}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
  };

  const readNewFormData = () => {
    const parsedFormData = $("#newtrip-form").serialize();

    return parsedFormData;
  };

  const clearTripForm = () => {
    $("#newtrip-form")[0].reset();
  };

  const createTrip = (event) => {

  event.preventDefault();

  // Later we'll read these values from a form
  const newtripData = readNewFormData();
  console.log(newtripData);

  // reportStatus('Sending trip data...');

  axios.post(URL, newtripData)
    .then((response) => {
      console.log(response);
      reportStatus('Successfully added a trip!');
      clearTripForm();
    })
    .catch((error) => {
      console.log(error.response);
      reportStatus(`Encountered an error: ${error.message}`);
    });
};


  $(document).ready(() => {
    $('#trip-list').toggle();

    $("#load").click(loadTrips);


    $("#load").on("click", loadTrips, function() {
      $('#trip-list').toggle();
      $(".trip-info").hide();
      $(".new-trip").hide();
    });

    $('#trip-list').on("click", "a", function() {
      showTrip(this.id);
      $(".trip-info").css("background-color", "white").css('opacity', '0.75');
      $('#add-trip').hide();
      $(".trip-info").show();
      $(".new-trip").show();
    });

    $('#newtrip-form').submit(createTrip);

    $('#add-trip').hide(); //Initially form wil be hidden.
    $('#btnTrip').click(function() {
      $('#add-trip').css("background-color", "white").css('opacity', '0.85');
      $('#add-trip').toggle();
      $(".trip-info").hide();
      $(".new-trip").hide();
    });

  }); //document ready end
