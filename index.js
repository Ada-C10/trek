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
        tripList.append(`<div><button class="trip-${trip.id}">${trip.name}</button></div>`);
        $(`.trip-${trip.id}`).click(() => {
          loadTrip(`.trip-${trip.id}`);
        })
      });
       // must go here so the forEach doesn't execute everytime it is added

    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading pets: ${error.message}`);
      console.log(error);
    });
};


const loadTrip = (tripinfo) => {
  let num = tripinfo.match(/\d/);
  num = num.join("");
  console.log(num)
  const trip = $(`${tripinfo}`);
  trip.empty();
  trip.append(`<h2> Trip details </h2>`)
  axios.get(URL + "/" + num)
    .then((response) => {
        let data = {}
          data["id"] = response.data.id
          data["name"] = response.data.name
          data["continent"] = response.data.continent
          data["details"] = response.data.about
          data["category"] = response.data.category
          data["duration"] = response.data.weeks
          data["cost"] = response.data.cost

        Object.keys(data).forEach(function(key) {
          //console.log(`<ls>${key} : ${data[key]}</ls`)
            trip.append(`<ls>${key} : ${data[key]}</ls`);
        });
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
