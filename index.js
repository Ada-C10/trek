const URL = 'https://trektravel.herokuapp.com/trips';

//
// Status Management
//
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

//

//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {

      const loadTripDetails = () => {
        const tripDetails = $('.trip-details');
        tripDetails.empty();
        const reserveTrip = $('#reservation-form'); //added this
        // reserveTrip.empty(); //added this

        const detailsURL = `https://trektravel.herokuapp.com/trips/${trip.id}`;

        reportStatus('Loading trip details...');

        axios.get(detailsURL)
        .then((response) => {
          reportStatus(`Successfully loaded trip details`);
          const tripName = response.data.name;
          const continent = response.data.continent;
          const category = response.data.category;
          const weeks = response.data.weeks;
          const cost = response.data.cost;
          const about = response.data.about;
          const tripId = response.data.id;

          tripDetails.append(`<h1>Trip Details</h1>
            <li> Trip: ${tripName}</li>
            <li> ${weeks} weeks</li>
            <li> $${cost}</li>
            <li> Continent: ${continent}</li>
            <li> Category: ${category}</li>
            <li> About: ${about}</li>`);

            $( "#reservation-form" ).removeClass( "hidden");

            $(`#reservation-form input[name="tripName"]`).val(`${tripName}`);
            $(`#reservation-form input[name="tripId"]`).val(`${tripId}`);
          });
        };

        tripList.append(`<li class="trip-details-${trip.id}">${trip.name}</li>`);
        $(`.trip-details-${trip.id}`).click(loadTripDetails);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };



  //
  // Creating Reservation
  //
  const readFormData = () => {
    const parsedFormData = {};

    const inputs = ["tripId", "email", "name", "tripName"];

    inputs.forEach((curInput) => {
      const curData = $(`#reservation-form input[name="${curInput}"]`).val();
      parsedFormData[curInput] = curData ? curData : undefined;
    });

    return parsedFormData;
  };

  const clearForm = () => {
    $(`#reservation-form input[name="tripId"]`).val('');
    $(`#reservation-form input[name="name"]`).val('');
    $(`#reservation-form input[name="email"]`).val('');
    $(`#reservation-form input[name="tripName"]`).val('');
  }

  const createReservation = (event) => {

    event.preventDefault(); //avoids page reload

    const reservationTripId = readFormData().tripId;
    const reservationData = readFormData()

    reportStatus('Sending reservation data...');

    const reservationURL = `https://trektravel.herokuapp.com/trips/${reservationTripId}/reservations`;
    console.log(reservationData);
    axios.post(reservationURL, reservationData)
    .then((response) => {
      reportStatus(`Successfully added a reservation for ${response.data.name}!
        A confirmation has been sent to ${response.data.email}`);
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



    $(document).ready(() => {
      $('#load').click(loadTrips);
      $('#reservation-form').submit(createReservation);
    });
