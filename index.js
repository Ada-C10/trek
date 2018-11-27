const URL = 'https://trektravel.herokuapp.com/trips';
// & + .serialize() tac on to the end

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

          reserveTrip.append(
            $(`#reservation-form input[name="tripName"]`).val(`${tripName}`),
            $(`#reservation-form input[name="tripId"]`).val(`${tripId}`),
            // $(`#reservation-form input[name="category"]`).val(`${category}`),
            // $(`#reservation-form input[name="cost"]`).val(`${cost}`),
            // $(`#reservation-form input[name="continent"]`).val(`${continent}`),
            // $(`#reservation-form input[name="weeks"]`).val(`${weeks}`),
          );
        });
      };

      tripList.append(`<li class="trip-details-${trip.id}">${trip.name}</li>`);
      $(`.trip-details-${trip.id}`).click(loadTripDetails);
      //return loadTripDetails;
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
  // const inputs = ["customer-name", "email", "name", "category", "cost", "weeks", "continent"];

  inputs.forEach((curInput) => {
    const curData = $(`#reservation-form input[name="${curInput}"]`).val();
    parsedFormData[curInput] = curData ? curData : undefined;
  });

  // const nameFromForm = $(`#pet-form input[name="name"]`).val();
  // parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
  //
  // const ageFromForm = $(`#pet-form input[name="age"]`).val();
  // parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;
  //
  // const ownerFromForm = $(`#pet-form input[name="owner"]`).val();
  // parsedFormData['owner'] = ownerFromForm ? ownerFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#reservation-form input[name="tripId"]`).val('');
  $(`#reservation-form input[name="name"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
  $(`#reservation-form input[name="tripName"]`).val(''); //name is tripname
  // $(`#reservation-form input[name="continent"]`).val('');
  // $(`#reservation-form input[name="cost"]`).val('');
  // $(`#reservation-form input[name="weeks"]`).val('');
  // $(`#reservation-form input[name="category"]`).val('');
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
    reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
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

//
// OK GO!!!!!
//


$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#reservation-form').submit(createReservation);
});
