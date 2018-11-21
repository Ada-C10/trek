const URL = "https://trektravel.herokuapp.com/trips";

//
// Status Management
//
const reportStatus = message => {
  $("#status-message").html(message);
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
// Loading Pets
//
const loadTrips = () => {
  reportStatus("Loading trips...");

  const tripList = $("#trip-list");
  tripList.empty();

  axios
    .get(URL)
    .then(response => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach(trip => {
        tripList.append(`<li> <a href = 'https://trektravel.herokuapp.com/trips/${trip.id}>${trip.name}'>`<a></li>).addClass("showTrip");
      });
    })
    .catch(error => {
      reportStatus(
        `Encountered an error while loading trips: ${error.message}`
      );
      console.log(error);
    });
};

//
// Creating Pets
//
const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#pet-form input[name="name"]`).val();
  parsedFormData["name"] = nameFromForm ? nameFromForm : undefined;

  const ageFromForm = $(`#pet-form input[name="age"]`).val();
  parsedFormData["age"] = ageFromForm ? ageFromForm : undefined;

  const ownerFromForm = $(`#pet-form input[name="owner"]`).val();
  parsedFormData["owner"] = ownerFromForm ? ownerFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#pet-form input[name="name"]`).val("");
  $(`#pet-form input[name="email"]`).val("");
  $(`#pet-form input[name="trip-name"]`).val("");
};

const createTrip = event => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus("Sending trip data...");

  axios
    .post(URL, tripData)
    .then(response => {
      reportStatus(`Successfully reserved a trip with ID ${response.data.id}!`);
      clearForm();
    })
    .catch(error => {
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
  $("#load").click(loadTrips);
  $("#pet-form").submit(createTrip);
});
