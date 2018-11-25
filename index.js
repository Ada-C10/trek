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
          const name = response.data.name;
          const continent = response.data.continent;
          const category = response.data.category;
          const weeks = response.data.weeks;
          const cost = response.data.cost;
          const about = response.data.about;

          tripDetails.append(`<h1>Trip Details</h1>
            <li> ${name}</li>
            <li> ${continent}</li>
            <li> ${category}</li>
            <li> ${weeks}</li>
            <li> ${cost}</li>
            <li> ${about}</li>`);

          $( "#reservation-form" ).removeClass( "hidden");

          reserveTrip.append(
            $(`#reservation-form input[name="name"]`).val(`${name}`),
            $(`#reservation-form input[name="category"]`).val(`${category}`),
            $(`#reservation-form input[name="cost"]`).val(`${cost}`),
            $(`#reservation-form input[name="continent"]`).val(`${continent}`),
            $(`#reservation-form input[name="weeks"]`).val(`${weeks}`),
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

  const inputs = ["customer-name", "email", "name", "category", "cost", "weeks", "continent"];

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
  $(`#reservation-form input[name="customer-name"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
  $(`#reservation-form input[name="name"]`).val(''); //name is tripname
  $(`#reservation-form input[name="continent"]`).val('');
  $(`#reservation-form input[name="cost"]`).val('');
  $(`#reservation-form input[name="weeks"]`).val('');
  $(`#reservation-form input[name="category"]`).val('');
}

const createReservation = (event) => {
  console.log("called createReservation with", event);
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Sending reservation data...');

  axios.post(URL, reservationData)
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
