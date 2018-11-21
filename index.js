// index.js
const URL = "https://trektravel.herokuapp.com/trips";

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

const loadTrips = () => {
  reportStatus("Loading trips...");
  // Prep work
  const tripList = $("#trip-list");
  tripList.empty();

  // Actually load the trips - axis.get() returns a promise. .then is called is called on return value of axis.get().
  axios
    .get(URL)
    .then(response => {
      // .then runs if call succeeds
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach(trip => {
        tripList.append(`<li class="trip", id=${trip.id}>${trip.name}</li>`);
      });
    })
    // .catch is called on return value of .then()
    .catch(error => {
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

const showReservationForm = event => {
  const tripForm =
    `<h1>Reserve Trip</h1>` +
    `<form id=trip-form>` +
    `<label for="name">` +
    `</label>` +
    `<input type="text" name="name">` +
    "Your Name" +
    `</input>` +
    `<label for="email">` +
    `</label>` +
    `<input type="text" name="email">` +
    "Email" +
    `</input>` +
    `</input>` +
    `<label for="Trip Name">` +
    `</label>` +
    `<input type="text" name="tripName" value="(${
      event.textContent
    })" readonly>` +
    `</input>` +
    `</input>` +
    `<label for="tripID">` +
    `</label>` +
    `<input type="text" name="tripID" value="${event.id}" hidden>` +
    `</input>` +
    `<input type="submit" name="add-reservation" value="Complete Reservation">` +
    `</input>` +
    `</form>`;
  // Add trip name to tripForm?
  // Appends the form the id as hidden/the name as read only
  // $("#trip-form").append(
  //   `<input type="hidden" name="tripID" value="${trip.id}" readonly>`
  // );
  // Add trip name to field as read only
  // $("#trip-form").append(
  //   $("<input>").attr({
  //     type: "text",
  //     name: "Trip Name",
  //     value: `${event.textContent}`,
  //     disabled: true
  //   }),
  //   $("<input>").attr({
  //     type: "text",
  //     name: "TripID",
  //     value: `${event.id}`,
  //     hidden: true
  //   })
  // `<input type="text" name="tripName value="${trip.name} readonly"></input>`
  // );
  $("#reservation").append(tripForm);
};
const readFormData = () => {
  const parsedFormData = {};
  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData["email"] = emailFromForm ? emailFromForm : undefined;
  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData["name"] = nameFromForm ? nameFromForm : undefined;
  const tripNameFromForm = $(`#trip-form input[name="tripName"]`).val();
  parsedFormData["tripName"] = tripNameFromForm ? tripNameFromForm : undefined;
  const idFromForm = $(`#trip-form input[name="tripID"]`).val();
  parsedFormData["tripID"] = idFromForm ? idFromForm : undefined;

  // console.log(parsedFormData);
  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val("");
  $(`#trip-form form input[name="email"]`).val("");
  $(`#trip-form form input[name="tripID"]`).val("");
  $(`#trip-form form input[name="tripName"]`).val("");
};
const createReservation = event => {
  event.preventDefault();
  // TODO TODO QUESTION trip.preventDefault()? QUESTION
  // QUESTION How do I get id over here? QUESTION
  console.log(event);
  event.preventDefault();
  const tripData = readFormData();
  let URL = `https://trektravel.herokuapp.com/trips/${
    tripData.tripID
  }/reservations`;
  reportStatus("Creating reservation...");
  axios
    .post(URL, tripData)
    .then(response => {
      reportStatus(
        `Successfully added trip reservation with id ${tripData.tripID}`
      );
      clearForm();
    })
    .catch(error => {
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
// How do we get details of trip they click on?
// We have a url for the get request but how do we use that/get the id?
const getTripData = event => {
  console.log(event);
  let URL = `https://trektravel.herokuapp.com/trips/${event.id}`;
  axios
    .get(URL)
    .then(response => {
      reportStatus(`Successfully loaded trip data`);
      // console.log("RESPONSE");
      // console.log(response);
      // Create the object to append
      const parsedTripData = {};
      parsedTripData.id = response.data.id;
      parsedTripData.name = response.data.name;
      parsedTripData.continent = response.data.continent;
      parsedTripData.details = response.data.about;
      parsedTripData.category = response.data.category;
      parsedTripData.weeks = response.data.weeks;
      parsedTripData.cost = response.data.cost;

      // Append to trip-details section
      $("#trip-details").append("<h1>Details</h1>");

      // For each in parsedTripData
      for (let detail in parsedTripData) {
        $("#trip-details").append(`<h2>${detail}</h2>`);
        $("#trip-details").append(`<p>${parsedTripData[detail]}`);
      }
    })
    .catch(error => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    });
};
$(document).ready(() => {
  $("#load").click(loadTrips);
  $("#trip-list").on("click", "li", function(event) {
    // Perform get request
    console.log(this);
    getTripData(this);
    // Show trip form as well in #reservation section
    showReservationForm(this);
    // Submit form on click
    $("#trip-form").submit(createReservation);
  });
});
