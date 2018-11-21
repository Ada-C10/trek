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
// Loading Trips
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    for (let i = 0; i < response.data.length; i += 1) {
      tripList.append(`<li><a href id="${response.data[i].id}">${response.data[i].name}<a href></li>`);
    }
    // response.data.forEach((trip) => {
    //   tripList.append(`<li><a href id="${trip.id}">${trip.name}<a href></li>`);
    // });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

//
// Creating Reservation
// When specific trip clicked, details and new form are appended...or uncommented?
//
const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#reservation-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#reservation-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  const tripNameFromForm = $(`#reservation-form input[name="tripName"]`).val();
  parsedFormData['tripName'] = tripNameFromForm ? tripNameFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#reservation-form input[name="name"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
  $(`#reservation-form input[name="tripName"]`).val('');
}

const createReservation = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Sending pet data...');

  // const reservationData = {
  //   name: $('input[name = "name"]').val(),
  //   age: $('input[name = "age"]').val(),
  //   owner: $('input[name = "owner"]').val()
  // }

  axios.post(URL, reservationData)
  //reservationData = datatosendwithpostrequest;//

  .then((response) => {
    reportStatus(`Thank you ${response.data.name}! You've successfully submitted form for trip ${response.data.tripName}. An email confirmation will be sent to ${response.data.email}!`);
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
  //upon loading document hide form and detail sections
  $('#load').click(loadTrips);
  $('ul').on('click', 'a', function() {
    const content = $(this).html();
    //upon clicking a tag shown
    alert(`Got a click on an <li> element containing ${content}`);
  });
  // When trip is clicked load/unhide form and detail sections
  // $('#pet-form').submit(createPet);
});
