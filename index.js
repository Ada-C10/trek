const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty(); //starts as empty till button is clicked

reportStatus('Loading trips...'); //place before axios call, shows before error and success msg


// Make an Axios request to get the array with the main list of trips.
// It's a long array of objects representing trips, all in this form:
// {
//   "id": 1,
//   "name": "Cairo to Zanzibar",
//   "continent": "Africa",
//   "category": "everything",
//   "weeks": 5,
//   "cost": 9599.99
// }

  axios.get(URL)
  .then((response) => {
    // This function runs to handle a successful response
    reportStatus(`It loaded ${response.data.length} fricking trips!`);
    // Now we step through each of the trip in the array given by the API,
    // and add them to our interface.

    // For each trip ...
    response.data.forEach((trip) => {
      // Create a new list item element containing the name of the trip.
      const tag = $(`<li>${trip.name}</li>`);
      // Append our new list item to the trip list element. Now it will appear on the screen.
      tripList.append(tag);
      // Set up the event handler to run when the user clicks on this list item.
      tag.click(() => {
        // (Now we're in the event handler, so this code will only run once the list item
        // has been clicked.)

        // call tripDetails() and pass in the trip object to show the user the details about the trip.
        tripDetails(trip);
        // Now call reservationForm() to build the reservation form for this specific
        // trip and add it to the page. We only pass in the trip ID, since that is all
        // it needs to know in order to build the form.
        reservationForm(trip.id);
      })

    })
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

  // Look up this specific trip through the API...
  axios.get(URL + '/' + trip.id) //gets a trip
    .then((response) => {

      const tripData = response.data;
      console.log(trip)
      tripDetailsList.append(`<li>Name: ${tripData.id}</li>`);
      tripDetailsList.append(`<li>Name: ${tripData.name}</li>`);
      tripDetailsList.append(`<li>Category: ${tripData.category}</li>`);
      tripDetailsList.append(`<li>Continent: ${tripData.continent}</li>`);
      tripDetailsList.append(`<li>Cost: ${tripData.cost}</li>`);
      tripDetailsList.append(`<li>Weeks: ${tripData.weeks}</li>`);
      tripDetailsList.append(`<li>About: ${tripData.about}</li>`);
    })
  }
const reservationForm = (trip_id) => {
  console.log(trip_id)
  const form =$('#form')
  form.empty();

  // The "Reserve a Trip" form has 3 inputs:
  // Name (comes from the user)
  // Email (comes from the user)
  // Trip ID (a hidden input that we auto-generate based on the trip
  // that was chosen)
  //
  // So we populate the inside of the form using a template string
  // that is mostly just the raw HTML of the form, but we also inject
  // the trip ID into the code for the hidden input.


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
      <input type="hidden" name="trip_id" value="${trip_id}" />
    </div>
    <input type="submit" name="reserve" value="Reserve" />
  `);
}


// With this function, you take the values from the form (name, email and trip ID)
// and condense them into an object in the format expected by the API,
// with the keys name, email and trip_id.
// For example:
//    {
//      name: "Amy Testington",
//      email: "amy@testington.com",
//      trip_id: 10
//    }
//reserving trip
const readFormData = () => {
  // Initialize an empty object
  const parsedFormData = {};

  // Get the value from the form input with the name "trip_id"
  // and add it to the output object under the key "trip_id"

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

  // readFormData takes the values from the form (name, email and trip ID)
  // and condenses them into an object in the format expected by the API,
  // with the keys name, email and trip_id.
  // For example:
  //    {
  //      name: "Sally Testington",
  //      email: "sally@testington.com",
  //      trip_id: 10
  //    }

  const tripInfo = readFormData(); //values from the form
  console.log(tripInfo);

  // The URL alone does not have enough information for the API to know
  // what we want, so we also send an object in the POST data with the complete
  // data about the trip (see above).

  axios.post(URL + '/' + tripInfo.trip_id+ '/reservations', tripInfo)
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

// When we call $(document).ready() and pass it a callback,
// then everything inside that callback will run only when the
// page is fully loaded and ready for jQuery to add stuff.
$(document).ready(() => {

  // When the button is clicked, loadTrips will be called to download and
  // display the list of trips
  $('#load').click(loadTrips);

  // When "Reserve Trip" button is clicked.
  // reserveTrip() will be called to perform the reservation

  $('#form').submit(reserveTrip);
});
