const URL = "https://trektravel.herokuapp.com/trips";
let hiddenID = null;
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

const loadTrips = () => {
  reportStatus("Loading trips...");

  const tripList = $("#trip-list");
  tripList.empty();
  axios.get(URL).then(response => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data
      .forEach(trip => {
        const vacation = $(
          `<li><a href="#" id="${trip.id}">${trip.name}</a></li>`
        );
        tripList.append(vacation).addClass("show-trip)");
        console.log(`${trip.name},${trip.id},${trip.about}}`);

        const individualTrip = showTrip(trip.id);
        vacation.click(individualTrip);
      })
      .catch(error => {
        reportStatus(
          `Encountered an error while loading trips: ${error.message}`
        );
        console.log(error);
      });
  });
};
const showTrip = id => {
  return () => {
    hiddenID = id;
    axios
      .get(`${URL}/${id}`)
      .then(response => {
        getTripTemplate(response);
        getReserveTemplate(response);
        getTripCreateTemplate();
      })
      .catch(error => {
        reportStatus(
          `Encountered an error while loading trips: ${error.message}`
        );
        console.log(error);
      });
  };
};
function getTripTemplate(response) {
  console.log(response.data.name);
  $("#showList").html(`<div><strong>Trip Name:</strong> ${
    response.data.name
  }</div>
  <div>
  <strong>Trip continent:</strong> ${response.data.continent}
  </div>
  <div><strong>Description:</strong> ${response.data.about}</div>
  <div><strong>Weeks:<strong> ${response.data.weeks}</div>
  <div><strong>Cost:</strong> ${response.data.cost}</div>
  <div><br></br></div>`);
}
function getReserveTemplate(response) {
  $("#trip-form").html(
    `<h1>Reserve a trip</h1>
    <div>
    <label for="name">Name</label>
    <input type="text" name="name" />
    </div>
    <div>
    <label for="email">Email</label>
    <input type="string" name="email" />
    </div>

    <div>
    <label for="tripID">Trip name</label>
    <input type="text" name="tripID" value="${response.data.name}"/>
    </div>
    <div>
    <input type="hidden"  name="hiddenID" value="" />
    </div>

    <input type="submit" name="reserve-trip" value="ReserveTrip"/>`
  );
}
function getTripCreateTemplate() {
  $("#new-trip-form").html(
    `<div>
    <label for="name">Trip Name: </label>
    <input type="text" name="name" />
    </div>

    <div>
    <label for="continent">Continent: </label>
    <input type="string" name="continent" />
    </div>

    <div>
    <label for="about">About: </label>
    <input type="text" name="trip-name" />
    </div>
    <div>
    <label for="category">Category: </label>
    <input type="text" name="name" />
    </div>
    <div>
    <label for="weeks">Weeks : </label>
    <input type="text" name="weeks" />
    </div>
    <div>
    <label for="Cost">Cost: </label>
    <input type="text" name="cost" />
    </div>
    <input type="submit" name="create-trip" value="CreateTrip"/>`
  );
}

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData["name"] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData["email"] = emailFromForm ? emailFromForm : undefined;

  const tripNameFromForm = $(`#trip-form input[name="trip-name"]`).val();
  parsedFormData["showTrip"] = tripNameFromForm ? tripNameFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val("");
  $(`#trip-form input[name="email"]`).val("");
  $(`#trip-form input[name="trip-name"]`).val("");
};

const reserveTrip = event => {
  event.preventDefault();

  const tripData = readFormData();

  console.log(tripData);

  reportStatus("Sending trip data...");

  axios
    .post(`${URL}/${hiddenID}/reservations`, tripData)
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
const tripFormData = () => {
  const parsedTripFormData = {};

  const tripNameFromForm = $(`#new-trip-form input[name="trip-name"]`).val();
  parsedTripFormData["name"] = tripNameFromForm ? tripNameFromForm : undefined;

  const continentFromForm = $(`#new-trip-form input[name="continent"]`).val();
  parsedTripFormData["continent"] = continentFromForm
    ? continentFromForm
    : undefined;

  const aboutFromForm = $(`#new-trip-form input[name="about"]`).val();
  parsedTripFormData["about"] = aboutFromForm ? aboutFromForm : undefined;

  const categoryFromForm = $(`#new-trip-form input[name="category"]`).val();
  parsedTripFormData["category"] = categoryFromForm
    ? categoryFromForm
    : undefined;

  const weeksFromForm = $(`#new-trip-form input[name="weeks"]`).val();
  parsedTripFormData["weeks"] = weeksFromForm ? weeksFromForm : undefined;

  const costFromForm = $(`#new-trip-form input[name="cost"]`).val();
  parsedTripFormData["cost"] = costFromForm ? costFromForm : undefined;
  return parsedTripFormData;
};

const createTrip = event => {
  event.preventDefault();

  const formData = tripFormData();
  console.log(tripFormData);

  reportStatus("Sending trip data...");

  axios
    .post(URL, formData)
    .then(response => {
      reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
      $("#trip-list").append(tripFormData);
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

$(document).ready(() => {
  $("#load").click(loadTrips);
  $("#trip-form").submit(reserveTrip);
  $("#show-trip").on("click", "a", function() {
    console.log("loading trip");
    showTrip(this.id);
  });
  $("#new-trip-form").submit(createTrip);
});
