
const URL = 'https://trektravel.herokuapp.com/trips';

const loadTrips = () => {
  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();


  axios.get(URL).then((response) => {
    response.data.forEach((trip) => {
      const tripHTML = $(`<li><a href="#">${trip.name}</a></li>`);
      tripList.append(tripHTML);

      tripHTML.click(() => {
        loadTripDetail(trip.id);
      })
    });
  })
  .catch((error) => {
    console.log(error);
  });
};

const loadTripDetail = (id) => {

const tripDetail = $('#trip-details');
tripDetail.empty();

 axios.get(URL + "/" + id).then((response) => {
   //reportStatus(`Loading trip ....`);
   let trip = response.data
    console.log(trip)

   tripDetail.append(`
     <p>Trip Name : ${trip.name}</p>
     <p>Continent : ${trip.continent}</p>
     <p>Cost : ${trip.cost}</p>
     <p>Weeks : ${trip.weeks}</p>
     <p>About : ${trip.about}</p>
     `)

    const $reservationForm = $('.reservation');

    $reservationForm.empty();
    $reservationForm.append(`
      <h1>Reserve Trip</h1>
      <form id="trip-form">
      <div>
      <label for="name">Name</label>
      <input type="text" name="name" />
      </div>

      <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
      </div>

      <div>
      <label for="trip">Trip Name</label>
      <input type="text" name="trip" value="${trip.name}"/>
      </div>

      <div>
      <input type="hidden" name="trip_id" value="${trip.id}" />
      </div>

      <input type="submit" name="reserve-trip" value="Reserve Trip" />
      </form>
      `);
});
}

const reserveTrip = (event) => {
  event.preventDefault();

  const tripData = {};
  $(event.target).serializeArray().forEach((item) => {
    tripData[item.name] = item.value;
  });

  console.log(tripData)

  axios.post(URL + `/` + tripData.trip_id + `/reservations`, tripData)
  .then((response) => {
    console.log('success');
    console.log(response);
    // reportStatus('Reservation Successful!');
    // clearForm();
  })
  .catch((error) => {
    console.log('error');
    console.log(error.response);
    // if (error.response.data && error.response.data.console.errors) {
    //   reportError(
    //     `Encountered an error: ${error.message}`,
    //     error.response.data.errors
    //   );
    // } else {
    //   reportStatus(`Encountered an error: ${error.message}`);
    // }
  });
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('.reservation').on("submit", "form", reserveTrip);
});

//});
//
// $(document).ready(() => {
//   $('<a>').click(loadTripDetail)
// });
