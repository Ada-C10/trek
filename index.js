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
        $(".showList").append(`<div><strong>Trip Name:</strong> ${
          response.data.name
        }</div>
          <div><strong>Trip continent:</strong> ${response.data.continent}</div>
          <div><strong>Description:</strong> ${response.data.about}</div>
          <div><strong>Weeks:<strong> ${response.data.weeks}</div>
          <div><strong>Cost:</strong> ${response.data.cost}</div>
          <div><br></br></div>`);
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
    .post(`${URL}/${id}/reservations`)
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

const createTrip = event => {
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);

  reportStatus("Sending trip data...");

  axios
    .post(URL, tripData)
    .then(response => {
      reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
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
// const trips =
// ["Cairo to Zanzibar","Everest Base Camp Trek","Golden Triangle""Egypt & Jordan Adventure","Best of New Zealand","Trans-Mongolian Adventure","Sziget Festival Experience", "Dunes, Deltas & Falls","Highlights of Morocco","Local Living Ecuador—Amazon Jungle","Costa Rica Volcanoes & Surfing","Sheepshead World Championships","In Search of Iguassu–Rio to Buenos Aires","Jamaica Encompassed","Antarctica Classic in Depth","Rio de Janeiro Carnival Experience","Kenya & Uganda Gorilla Adventure", "San Diego, Grand Canyon & Vegas","Sin, Surf & Sierras","Historic American Cities by Rail", "Best of Australia","Explore Whitsundays: Solway Lass Tall Ship Sailing","Great Ocean Road - Melbourne to Adelaide", "Ultimate Sydney","Sunnyville ","Blanery Castle","Northern Choice (Auckland to Wellington)","Complete Australia","Remote Northern Lau and Kadavu Discovery Cruise","Local Living Croatia","Whisky Tour from Edinburgh","Clubbing in Bucharest Tour","Hokkaido Winter Festivals","Ancient Empires—Beijing to Tokyo","Cambodia on a Shoestring","Essential India","Northern Hilltribes & Villages","Titanic Journey to New York City","✨✨ Hogwarts Castle Tour ✨✨","Mission to Mars","Mission to Saturn"]

$(document).ready(() => {
  $("#load").click(loadTrips);
  $("#trip-form").submit(reserveTrip);
  $("#show-trip").on("click", "a", function() {
    console.log("loading trip");
    showTrip(this.id);
  });
  $("#trip-form").submit(createTrip);
});
