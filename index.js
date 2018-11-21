// index.js
const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
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

const loadTrips = () => {
  reportStatus('Loading trips...');

  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  // Actually load the trips
  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`Encountered an error while loading trips: ${error.message}`);

  });

};

const readFormData = () => {
  const parsedFormData = {};

  // let formData = $("#trip-form").serializeArray()
  //
  // for(let field of formData){
  //   parsedFormData[field.name] = field.value
  // }

  const inputs = ["name", "age", "owner"]

  inputs.forEach((curInput)=> {
    const curData = $(`#trip-form input[name="${curInput}"]`).val();
    parsedFormData[curInput] = curData ? curData : undefined;
  });

  // const nameFromForm = $(`#trip-form input[name="name"]`).val();
  // parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
  //
  // const ageFromForm = $(`#trip-form input[name="age"]`).val();
  // parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;
  //
  // const ownerFromForm = $(`#trip-form input[name="owner"]`).val();
  // parsedFormData['owner'] = ownerFromForm ? ownerFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="age"]`).val('');
  $(`#trip-form input[name="owner"]`).val('');
}


const createTrip = (event) => {
  // Note that createTrip is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  // Later we'll read these values from a form
  const tripData = readFormData();
  console.log(event.parsedformdata)
  reportStatus('Sending trip data...');

  axios.post(URL, tripData)
  .then((response) => {
    console.log(response);
    reportStatus('Successfully added a trip!');
    clearForm();
  })
  .catch((error) => {
    console.log(error.response);
    // Make sure the server actually sent us errors. If
    // there's a different problem, like a typo in the URL
    // or a network error, the response won't be filled in.
    if (error.response.data && error.response.data.errors) {
      // User our new helper method
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      // This is what we had before
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });
};




$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createTrip)
});
