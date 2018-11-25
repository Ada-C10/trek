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

const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      const div = $(`<div class="trip-${trip.id}"><button >${trip.name}</button></div>`)
      tripList.append(div);
      $('button', div).click(() => { // to only activate on button inside the div
        loadTrip(`.trip-${trip.id}`);
        createForm(`.trip-${trip.id}`);
        $(`.trip-${trip.id}`).on('submit', '#trip-form', createReservation);
      })
    });

  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
    console.log(error);
  });
};

const loadTrip = (tripinfo) => {
  let num = tripinfo.match(/\d/);
  num = num.join("");
  const trip = $(`${tripinfo}`);
  trip.empty();
  axios.get(URL + "/" + num)
  .then((response) => {
    let data = {}
    data["Id"] = response.data.id
    data["Name"] = response.data.name
    data["Continent"] = response.data.continent
    data["Details"] = response.data.about
    data["Category"] = response.data.category
    data["Weeks"] = response.data.weeks
    data["Cost"] = '$' + response.data.cost
    const list = $('<ul></ul>')
    Object.keys(data).forEach(function(key) {
      list.append(`<li><strong>${key}</strong> : ${data[key]}</li`);
    });
    const section = $('<section></section>');
    section.append('<h2> Trip details </h2>')
    section.append(list)
    trip.append(section)
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trip: ${error.message}`);
  });

};

const createForm = (tripinfo) => {
  event.preventDefault();
  // get id number
  let num = tripinfo.match(/\d/);
  num = num.join("");
  let trip = $(`${tripinfo}`);
  console.log(tripinfo)

  //generate form
  // Create a section element (not in the DOM)
  const section = $('<section></section>');
  section.append('<h2>Reserve Trip</h2>');

  const form = $('<form id = "trip-form"></form>')
  const divName = $('<div></div>')
  divName.append('<label for="name">Name</label>');
  divName.append('<input type="text" name="name" />');


  const divEmail = $('<div></div>')
  divEmail.append('<label for="email">Email</label>');
  divEmail.append('<input type="text" name="email" />') // for and name in a form should have the same name

  form.append(divName)
  form.append(divEmail)

  form.append(`<input type="hidden" id="tripId" name="triptId" value=${num}>`)
  form.append('<input type="submit" name="add-pet" value="Reserve" class="btn btn-info" />')

  section.append(form)
  trip.append(section);
}

const readFormData = () => {
  const parsedFormData = {};

  const inputs = ["name","email"]

  inputs.forEach((curInput) => {
    const curData = $(`#trip-form input[name="${curInput}"]`).val();
    parsedFormData[curInput] = curData ? curData : undefined;
  });
  let id = document.getElementById("tripId").value
  parsedFormData["id"] = id
  return parsedFormData;
};

const createReservation = (event) => {
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData)

  reportStatus('Sending trip data...');
  let num = tripData["id"]
  console.log(num)
  //POST https://trektravel.herokuapp.com/trips/1/reservations
  let URL_R = URL + "/" + num + "/reservations"
  axios.post(URL_R, tripData)
  .then((response) => {
    reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
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

// this is the homepage! the trip will not be avaiable
$(document).ready(() => {
  $('#load').click(loadTrips);
});
