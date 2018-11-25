const BASEURL = 'https://trektravel.herokuapp.com';
const TRIPSPATH = '/trips'
const RESERVATIONPATH = '/reservations'


const reportStatus = (message => {
  $('#status-message').html(message);
});

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


const buildClickTripDetailsHandler = (trip) => {
  const tripID = trip.id;

  return () => {
   const tripList = $(`#trip-list`);
   tripList.empty();


   axios.get(`${BASEURL}${TRIPSPATH}/${tripID}`)
  .then((response) => {
    const tripDetail = $('.trip-info');
    tripDetail.empty();
    const tripInfo = response.data;
    $('.all-trip-details').append(`
      <div class="trip-info">
      <h2>Trip Details</h2>
      <p>Id: ${tripInfo.id}</p>
      <p>Name: ${tripInfo.name}</p>
      <p>Continent: ${tripInfo.continent}</p>
      <p>Details: ${tripInfo.about}</p>
      <p>Category: ${tripInfo.category}</p>
      <p>Weeks: ${tripInfo.weeks}</p>
      <p>Cost: $${tripInfo.cost}</p>
      </div>
      `);
    const tripReservationForm = $('.reserve-trip');
    tripReservationForm.empty();
    $('.all-trip-details').append(`
      <div class="reserve-trip">
      <h2>Reserve Trip</h2>
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
          <label for="trip-name">Trip Name</label>
          <input type="text" name="trip-name" placeholder="${tripInfo.name}"/>
        </div>

        <input type="submit" name="reserve-trip" value="Reserve Trip" id="reserve-trip-button"/>
      </form>
    </div>
    `);
    const clickReservationHandler = buildClickReservationHandler(trip);
    const tripForm = $('#trip-form');
    tripForm.on('submit', clickReservationHandler);
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
    });
  };
};


const buildClickReservationHandler = (trip) => {
  return (event) => {
    event.preventDefault();

    const tripData = {
      name: $('input[name="name"]').val(),
      email: $('input[name="email"]').val(),
    };

    reportStatus("Sending trip data...");

    const id = trip.id;
    const endpoint = `${BASEURL}${TRIPSPATH}/${id}${RESERVATIONPATH}`;

    axios.post(endpoint, tripData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully added reservation with ID ${id}!`);
      const reserveTripForm = $('.reserve-trip');
      reserveTripForm.toggle()
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors)  {
        reportError(
          `Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error-status: ${error.message} `);
      }
    });
  };
};

const getTrips = () => {
  reportStatus('loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  const tripDetails = $('.all-trip-details');
  tripDetails.empty();

  const endpoint = `${BASEURL}${TRIPSPATH}`

  axios.get(endpoint)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        const tripName = $(`<li>${trip.name}</li>`);
        tripList.append(tripName);
        const clickTripHandler = buildClickTripDetailsHandler(trip);
        tripName.click(clickTripHandler);
      });
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
};


$(document).ready(() => {
  $('#load-trips-button').click(getTrips);
});
