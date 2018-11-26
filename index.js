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

    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

  ////Load a trip's details


  //
};


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
  $('.trip-details').hide();
  $('.reserve-trip').hide();
  $('#load').click(loadTrips);

  $('ul').on('click', 'li', function() {
    $('.trip-details').show();
    $('.reserve-trip').show();

    //Capture id attribute of trip that was clicked
    const tripId = $(this).attr('id');

    //Outer function for closure
    const buildDetailCall = (content) => {
      const tripDetail = $('#detail-info');
      tripDetail.empty();

      const reserveTrip = $('#formTripName');
      reserveTrip.empty();

      //Data to go into inside function for closure
      const DETAIL_URL = URL + `/${content}`;

      const insideDetailCall = () => {
        //Make a get request for individual trip
        axios.get(DETAIL_URL)
        .then( (response) => {
          reportStatus(`Successfully loaded ${response.data.name} trip`);

          tripDetail.append(`<li>Name: ${response.data.name}</li>`);
          tripDetail.append(`<li>Continent: ${response.data.continent}</li>`);
          tripDetail.append(`<li>Category: ${response.data.category}</li>`);
          tripDetail.append(`<li>Weeks: ${response.data.weeks}</li>`);
          tripDetail.append(`<li>Cost: $${response.data.cost}</li>`);
          tripDetail.append(`<li>About: ${response.data.about}</li>`);

          //Automatically load Trip name in TripName input field
          const input = $( "#TripName" );

          $("#tripName").val(function() {
            return this.value + `${response.data.name}`;
          });

        })
        .catch((error) => {
          reportStatus(`Encountered an error while loading trips: ${error.message}`);
          console.log(error);
        });
      };
      //return the inner function
      return insideDetailCall();
    };
    buildDetailCall(tripId);
  });
});
