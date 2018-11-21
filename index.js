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
  reportStatus(content); // print that content using reportStatus
};

//
// Loading Pets
//
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} pets`);
      response.data.forEach((trip) => {
        tripList.append(`<div><button class="trip">${trip.name}</button></div>`);
        $('.trip').click(loadTrip)
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading pets: ${error.message}`);
      console.log(error);
    });
};

//
// Creating Pets
//

const loadTrip = () => {
  const trip = $('#trip');
  trip.empty();

  axios.get(URL + "/1")
    .then((response) => {
      let id = response.data.id
      let tripName = response.data.name
      let continent = response.data.continent
      let details = response.data.about
      let category = response.data.category
      let duration = response.data.weeks
      let cost = response.data.cost

      // response.data.forEach((id) => {
      //   console.log(id)
      //   //trip.append(`<ls>${point.name}</ls>`);
      // });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
    });
};


const readFormData = () => {
  const parsedFormData = {};

  const inputs = ["name","email"]

  inputs.forEach((curInput) => {
    const curData = $(`#pet-form input[name="${curInput}"]`).val(); // you get it from the html
    parsedFormData[curInput] = curData ? curData : undefined;
  });

  return parsedFormData;
};
const clearForm = () => {
  $(`#pet-form input[name="name"]`).val('');
  $(`#pet-form input[name="email"]`).val('');
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
// this is the homepage! the trip will not be avaiable
$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#pet-form').submit(createPet);
});
