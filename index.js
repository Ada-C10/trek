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
  tripList.empty();

  const URL = "https://trektravel.herokuapp.com/trips"

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li><a href="#" id="${trip.id}">${trip.name}</a></li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


const showTrip = (id) => {
  reportStatus('Loading your next adventure...');

  const tripInfo = $('.trip-info');
  tripInfo.empty();

  const tripReserveration = $('.new-trip');
  tripReserveration.empty();

  const URL = 'https://trektravel.herokuapp.com/trips/'

  axios.get(URL + id)
  .then((response) => {
    let trip = response.data
    tripInfo.append(`<li><strong>Reference Number:</strong> ${trip.id}</li>
      <li><strong>Destination:</strong> ${trip.name}</li>
      <li><strong>Category:</strong> ${trip.category}</li>
      <li><strong>Continent:</strong> ${trip.continent}</li>
      <li><strong>Weeks:</strong> ${trip.weeks}</trip>
      <li><strong>Cost:</strong> $${trip.cost}</li>
      <p><strong>Details:</strong> ${trip.about}</p>
      `);
      tripReserveration.append(`<form id="trip-form">
        <input type="hidden" name="id" value="${trip.id}"/>
        <label for="name">Name</label>
        <input type="text" name="name" /></br>
        <label for="email">Email</label>
        <input type="text" name="email" /></br>
        <label for="trip">Destination</label>
        <input name="trip" value="${trip.name}"/></br>
        <input type="submit" name="add-trip" value="Book Trip" />
        </form>`)

    }).catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
  };






  const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  // const tripFromForm = $(`#pet-form input[name="owner"]`).val();
  // parsedFormData['trip'] = tripFromForm ? tripFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="email"]`).val('');
  $(`#trip-form input[name="trip"]`).val('');
}

const reserveTrip = (event, id) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus('Sending pet data...');

  // URL = "https://trektravel.herokuapp.com/trips/22/reservations"

// console.log(id) //no id not valid or found
//   const url = URL + id + "/reservations"
  axios.post(URL + 22 + "reservation", tripData)

    .then((response) => {
      console.log(response)
      tripData.append(response)
      reportStatus(`Successfully booked your next adventure to ${response.data.name}!`);
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
    $("#load").click(loadTrips);
    $('#trip-list').on("click", "a", function() {
      showTrip(this.id);

    // $('#trip-form').submit(function(reserveTrip) {
    // $(this).append('<input type="hidden" name="id" value="value" /> ');
    // return true;
});
  $(document).on("submit", "#trip-form", function(){
    reserveTrip(event, id)
  });
    });

  // });
