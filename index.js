const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty(); //starts as empty till button is clicked

reportStatus('Loading trips...'); //place before axios call, shows before error and success msg

  axios.get(URL)
  .then((response) => {
    reportStatus(`It loaded ${response.data.length} fricking trips!`);
    response.data.forEach((trip) => {
      const tag = $(`<li>${trip.name}</li>`);
      tripList.append(tag);
      tag.click(() => {
        tripDetails(trip);
      })

    });
  })
  .catch((error) => { //all .catch(callback) to do something when the response fails
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


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

const tripDetails = (trip) => {
  const tripDetailsList = $('#trip-details');
  tripDetailsList.empty();


  axios.get(URL + '/' + trip.id) //gets a trip
    .then((response) => {
      const tripData = response.data;
      console.log(trip)
      tripDetailsList.append(`<li>Name: ${tripData.name}</li>`);
      tripDetailsList.append(`<li>Category: ${tripData.category}</li>`);
      tripDetailsList.append(`<li>Continent: ${tripData.continent}</li>`);
      tripDetailsList.append(`<li>Cost: ${tripData.cost}</li>`);
      tripDetailsList.append(`<li>Weeks: ${tripData.weeks}</li>`);
      tripDetailsList.append(`<li>About: ${tripData.about}</li>`);
    })
  }
const reservationForm = (trip_id) => {
  const form =$('#form')
  form.empty();


  form.append(`
    <h2>Reserve a Trip</h2>
    <div>
      <label for="name">name</label>
      <input type="text" name="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
    </div>
    <div>
      <input type="hidden" name="trip_id" value=${trip_id} />
    </div>
    <input type="submit" name="reserve" value="Reserve" />
  `);
}

//reserving trip
const readFormData = () => {
  const parsedFormData = {};

  const tripsForm = $(`#form input[name="trip_id"]`).val();
  parsedFormData['trip_id'] = tripsForm ? tripsForm : undefined;

  const formName = $(`#form input[name="name"]`).val();
  parsedFormData['name'] = formName  ? formName  : undefined;

  const formEmail = $(`#form input[name="email"]`).val();
  parsedFormData['email'] = formEmail ? formEmail : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#form input[name="name"]`).val('');
  $(`#form input[name="email"]`).val('');
  $(`#form input[name="trip"]`).val('');
}

const reserveTrip = (event) => { //handler for a `submit`
  console.log(event);
  event.preventDefault(); //prevents page from reloading

  const tripInfo = readFormData(); //values from the form
  console.log(tripInfo);

  axios.post(URL + '/' + tripInfo.trip_id + '/reservations', tripInfo)
   .then((response) => {
     reportStatus(`Successfully reserved ${response.data.id}!`);
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

  $('#trip-list').on('click', 'li', function(trip) {
    reservationForm(trip);
  });
  $('#form').submit(reserveTrip);
});
