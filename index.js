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

const loadTrips = () => {
  reportStatus("Loading trips...");

  const tripList = $("#trip-list");

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
    axios
      .get(`${URL}/${id}`)
      .then(response => {
        $(".showList").append(`<div>Trip Name: ${response.data.name}</div>
          <div>Trip continent: ${response.data.continent}</div>
          <div>Description: ${response.data.about}</div>
          <div>Weeks: ${response.data.weeks}</div>
          <div>Cost: ${response.data.cost}</div>`);
      })
      .catch(error => {
        reportStatus(
          `Encountered an error while loading trips: ${error.message}`
        );
        console.log(error);
      });
  };
};
// *******************************************************

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData["name"] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData["email"] = emailFromForm ? emailFromForm : undefined;

  const tripNameFromForm = $(`#trip-form input[name="trip-name"]`).val();
  parsedFormData["trip-name"] = tripNameFromForm ? tripNameFromForm : undefined;

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
  $("#trip-form").submit(reserveTrip);
  $("#show-trip").on("click", "a", function() {
    console.log("loading trip");
    showTrip(this.id);
  });
});
