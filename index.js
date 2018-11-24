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

  const tripDetails = $('.trip_details');
  tripDetails.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li class="trip-details">${trip.name}</li>`);

      const detailsURL = `https://trektravel.herokuapp.com/trips/${trip.id}`;

      const loadTripDetails = () => {
        reportStatus('Loading trip details...');

        console.log(detailsURL);

        axios.get(detailsURL)
        .then((response) => {
          reportStatus(`Successfully loaded trip details`);
          response.data[0]; //this should be single trip details
          console.log(response.data);
          tripDetails.append(``)
        });

        // console.log(trip.name);
        // const name = trip.name;
        // const continent = trip.continent;
        // const cost = trip.cost;
        // const category = trip.category;
        // const weeks = trip.weeks;
      };
      return loadTripDetails;
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

  //when i click on a single trip name
  // do a axios.get on the botched URL


};

// <h1>Trip Details</h1>
// <button id="load-trip-details">Get trip details!</button>
// <ul id="trip-list"></ul>



//
// Creating Pets
//
const readFormData = () => {
  const parsedFormData = {};

  const inputs = ["name", "age", "owner"];

  inputs.forEach((curInput) => {
    const curData = $(`#pet-form input[name="${curInput}"]`).val();
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
  $(`#pet-form input[name="name"]`).val('');
  $(`#pet-form input[name="age"]`).val('');
  $(`#pet-form input[name="owner"]`).val('');
}

const createPet = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const petData = readFormData();
  console.log(petData);

  reportStatus('Sending pet data...');

  axios.post(URL, petData)
  .then((response) => {
    reportStatus(`Successfully added a pet with ID ${response.data.id}!`);
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
  const loadTripDetails = loadTrips
  $('.trip-details').click(loadTripDetails);
  $('#pet-form').submit(createPet);
});
