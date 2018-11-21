const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
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
  const URL = `https://trektravel.herokuapp.com/trips/`;
  const tripShowList = $('#trip-details');
  const reserveTripForm = $('#new-trip');

  tripShowList.empty();
  reserveTripForm.empty();
  axios.get(URL + id)
  .then((response) => {
    for (let tripData in response.data) {
      tripShowList.append(`<li><strong>${tripData}</strong>: ${response.data[tripData]}</li>`);
    }
    reserveTripForm.append(
      `<h1>Reserve a Trip</h1>
      <form id="trip-form">
      <div>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      </div>
      <div>
      <label for="email">Email:</label>
      <input type="text" name="email" />
      </div>
      <div>
      <p>Trip Name: ${response.data.name}</p>
      </div>
      <input type="submit" name="reserve-trip" id="${id}" value="Reserve this Trip" />
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
    console.log(readFormData());
    const URL = `https://trektravel.herokuapp.com/trips/${id}/reservations`
    axios.post(URL, readFormData())
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully reserved Trip #${id}!`);
      clearForm();
    })
  };

  $(document).ready(() => {
    $('#load').click(loadTrips);
    $('#trip-list').on('click', 'a', function() {
      showTrip(this.id);
    });
    $(document).on('submit', '#trip-form', function(event){
      event.preventDefault();
      const thisId = $( this ).find( 'input' )
      reserveTrip(thisId[2].id);
    });
  });
