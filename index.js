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
    console.log('loadTrips function');
    response.data.forEach((trip) => {
      let tripId = trip.id;
      let tripUrl = `https://trektravel.herokuapp.com/trips/${tripId}`;
      tripList.append(`<li class = "test"><a href = ${tripUrl}>${trip.name}</a></li><li>${trip.id}</li><li>${tripUrl}</li><li><button class = "button" id = ${trip.id}>Get Trip Info!</button></li>`);
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
    <form id="reservation-form">
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


const createReservation = (event, tripId) => {
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

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
    let newId = $(this).attr('id');
    showTrip(newId);
    // $(`#reservations`).show();
  });

  $('#reservation-form').on('submit', '.button', function() {
    let tripId = $(this).attr('id');
    createReservation(tripId);
  });




  // $('#reservation-form').submit(createReservation);


});
