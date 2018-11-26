const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  $( "#reveal-heading-list-trips" ).show();
  $( ".current-trips" ).addClass("section-borders")
  const URL = `https://trektravel.herokuapp.com/trips`;
  const tripList = $('#trip-list');
  tripList.empty();
  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li><a href="#" id="${trip.id}">${trip.name}</a></li>`);
    });
    reportStatus(`Successfully loaded all trips`);
  });
};

const showTrip = (id) => {
  $( "#trip-details" ).addClass("section-borders")
  $( "#reveal-heading-details" ).show();
  const tripShowList = $('#trip-details-list');
  tripShowList.empty();
  const reserveTripForm = $('#new-trip');
  reserveTripForm.addClass("section-borders")
  reserveTripForm.empty();

  const URL = `https://trektravel.herokuapp.com/trips/`;

  axios.get(URL + id)
  .then((response) => {
    for (let tripData in response.data) {
      tripShowList.append(`<li><strong class="capitalize">${tripData}</strong>: ${response.data[tripData]}</li>`);
    }
    reserveTripForm.append( // turn this form into helper function??
      `<h2>Reserve a Trip</h2>
      <form id="trip-form">
      <div><input type="hidden" value="${id}">
      <label for="name"><strong>Your Name:</strong></label>
      <input type="text" class="add-border" name="name" /></div>
      <div><label for="email"><strong>Email:</strong></label>
      <input type="text" name="email" /></div>
      <div><p><strong>Trip Name: </strong><span id="trip-name"> ${response.data.name}</span></p></div>
      <input type="submit" class="ugly-button" name="reserve-trip" value="Reserve" />
      </form>`)
      reportStatus(`Successfully loaded all trips`);
    });
  };

  const readFormData = () => {
    let tripForm = document.getElementById('trip-form');
    const tripData = new FormData(tripForm);
    return tripData;
  };

  const clearForm = () => {
    $(`#trip-form input[name="name"]`).val('');
    $(`#trip-form input[name="email"]`).val('');
  }

  const reserveTrip = (id) => {
    const URL = `https://trektravel.herokuapp.com/trips/${id}/reservations`
    axios.post(URL, readFormData())
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully reserved Trip #${id}!`);
      clearForm();
    })
  };



  // const addTrip = () => {
  //   const URL = `https://trektravel.herokuapp.com/trips`
  //   const newTrip = {
  //     name: `string`,
  //     continent: `string`,
  //     about: `string`,
  //     category: "string",
  //     weeks: 1,
  //     cost: 32.00 // float
  //   }
  //   axios.post(URL, newTrip)
  // };

  // set up error stuff
  $(document).ready(() => {
    $('#load').click(loadTrips);
    $('#trip-list').on('click', 'a', function() {
      showTrip(this.id);
    });
    $(document).on('submit', '#trip-form', function(event){
      event.preventDefault();
      reserveTrip($(`input:hidden`).val());
    });
  });
