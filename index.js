const URL = 'https://trektravel.herokuapp.com/trips';


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



const loadTrips = () => {
  reportStatus('Loading trips...');
  const tripList = $('#trip-list');

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}<br><button class = "button" id = ${trip.id}>Get Trip Info!</button></li><br><br>`);
    });

  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
    console.log(error);
  });

};


const showTrip = (id) => {

  const tripInfo = $('#tripTable');
  tripInfo.empty();

  const URL2 = `https://trektravel.herokuapp.com/trips/${id}`;

  axios.get(URL2)
  .then((response) => {
    let tripId = response.data.id;
    tripInfo.append(`<h2>Trip&nbsp;Details</h2>`);
    Object.keys(response.data).forEach((key) => {
      tripInfo.append(`<tr><th>${key}</th><td>${response.data[key]}</td>`);
    });
    showReservationForm(tripId);

  });

};


const showReservationForm = (tripId) => {

  const reservationForm = $('#reservations');

  reservationForm.append(`<h2>Reserve Your Spot!</h2>`);

  reservationForm.append(`
    <form id="reservation-form" class="${tripId}">
    <div>
    <label for="name">Your Name</label>
    <input type="text" name="name" />
    </div>

    <div>
    <label for="email">Your Email</label>
    <input type="text" name="email" />
    </div>

    <input type="submit" name="add-reservation" value="Reserve Now" id="${tripId}"/>
    </form>
    `)
};



const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#reservation-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#reservation-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
}


const clearForm = () => {
  $(`#reservation-form input[name="name"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
}


const createReservation = (tripId) => {

  const reservationData = readFormData();
  console.log(reservationData);
  console.log(tripId);

  const URL3 = `https://trektravel.herokuapp.com/trips/${tripId}/reservations`;
  console.log(URL3);

  reportStatus('Sending reservation data...');

  axios.post(URL3, reservationData)
    .then((response) => {
      reportStatus(`Successfully created a new reservation for ${response.data.name}`);
      clearForm();
    })
  .catch((error) => {
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportError( `Encountered an error: ${error.message}`, error.response.data.errors);
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }

  });

};




$(document).ready(() => {
  // $(`#reservations`).hide();
  $('#trips').click(loadTrips);

  $('#trip-list').on('click', '.button', function() {
    $( 'h2' ).remove();
    $( '#reservation-form' ).remove();
    let newId = $(this).attr('id');
    showTrip(newId);
    // $('#reservation-form').submit(createReservation);
    // $(`#reservations`).show();
  });

  $('#reservations').on('submit', 'form', function(event) {
    let tripId = $(this).attr('class');
    event.preventDefault();
    createReservation(tripId);
  });




  // $('#reservation-form').submit(createReservation);


});
