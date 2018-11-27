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
  const tbody = $('<tbody class="trips"></tbody>')
  tripList.empty();
  tripList.append('<thead><tr><th scope="col">Trips</th></thead></tr>')
  // Actually load the trips
  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      tbody.append(`<tr><td id=${trip.id}>${trip.name}</td></tr>`);
      tripList.append(tbody);
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

  const inputs = [ "name", "email"]

  inputs.forEach((curInput)=> {
    const curData = $(`#reservation-form input[name="${curInput}"]`).val();
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
  console.log(parsedFormData)
  return parsedFormData;
};

const clearForm = () => {
  $(`#reservation-form input[name="name"]`).val('');
  $(`#reservation-form input[name="email"]`).val('');
  $(`#reservation-form input[name="id"]`).val('');
}


const createRes = (event) => {
  // Note that createRes is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  // Later we'll read these values from a form
  const resData = readFormData();
  const tripID = $(`#reservation-form input[name="id"]`).val();
  reportStatus('Sending trip data...');
  console.log(tripID, resData)
  axios.post(`${URL}/${tripID}/reservations`, resData)
  .then((response) => {
    console.log(response);
    reportStatus('Successfully added a Reservation!');
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

const tripDetails = (id) => {
  console.log(event)
   //const URL = https://trektravel.herokuapp.com/trips/weeks?query=3
   reportStatus(`Loading trip id: ${id}...`);

   // Prep work
   const tripDetail = $('#trip-details');
   tripDetail.empty();
   $('.trip-name').empty();
   tripDetail.append('<h2 class="text-center card-header">Trip Details</h2>')
   // Actually load the trips
   axios.get(`${URL}/${id}`)
   .then((response) => {
     reportStatus(`Successfully loaded trip`);

     const entries = Object.entries(response.data);
     for (const [key, value] of entries) {
       tripDetail.append(`<p class="card-text">${key}:${value}</p>`);
     }

     $('.trip-name').append(`<input type="text" name="trip-name" class="form-control" value='${response.data.name}' readonly/>`)
     $(`#reservation-form input[name="id"]`).val(response.data.id);
   })
   .catch((error) => {
     console.log(error);
     reportStatus(`Encountered an error while loading trips: ${error.message}`);

   });

}




$(document).ready(() => {
  $('.new-reservation').hide();
  $('#load').click(loadTrips);
  $('#trip-list').on('click','td', function(event) {
    tripDetails(event.target.id);
    $('.new-reservation').show();
    // newTripForm();
 });
 $('#reservation-form').on('submit', createRes);
});
