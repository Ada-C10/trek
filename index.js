const URL = 'https://trektravel.herokuapp.com/trips ';

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
  reportStatus(content);
};

//
// Loading Trips
//
const loadTrips = () => {
  $("#status-message").show()
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();



  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips!`);
    response.data.forEach((trip) => {
      tripList.append(`<li id= ${trip.id}> ${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};

// const loadTripsbySearchQuery = (query) => {
//   $("#status-message").show()
//   reportStatus(`Loading trips in ${query} ...`);
//
//   const tripList = $('#trip-list');
//   tripList.empty();
//
  // const queryURL =    `https://trektravel.herokuapp.com/trips/continent?query=${query}`
//   axios.get(queryURL)
//   .then((response) => {
//     reportStatus(`Successfully loaded ${response.data.length} trips!`);
//     response.data.forEach((trip) => {
//       tripList.append(`<li id= ${trip.id}> ${trip.name}</li>`);
//     });
//   })
//   .catch((error) => {
//     reportStatus(`Encountered an error while loading trips: ${error.message}`);
//     console.log(error);
//   });
// };
//  click event -- acton show details
//
//View Individual Trip Details
const loadTripDetails = (id) => {

  reportStatus('Loading trip details...');

  const tripDetails = $('#trip-details');
  tripDetails.empty();

  let tripUrl =  `https://trektravel.herokuapp.com/trips/${id}`
  axios.get(tripUrl)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.name} trip`)
    const details  = Object.entries(response.data)
    for (const [key, value] of details){
      tripDetails.append(`<li>${key}: ${value}</li>`);

    }
    $("p.trip-name strong").text(` ${response.data.name}`);
    fillHiddenfields(details)

  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });

  const fillHiddenfields = (details) => {
    for (const [key, value] of details) {
      $(`.hidden-values input[name = "${key}"]`).val(`${value}`);
    }
  };
}

const readFormData = () => {
  const parsedFormData = {};
  const fields = ['name', 'email', 'id', 'continent', 'category', 'cost']


fields.forEach(function(field) {
    const dataFromForm = $(`#trip-form input[name="${field}"]`).val();
  parsedFormData[`${field}`] = dataFromForm ? dataFromForm : undefined;
})
console.log(parsedFormData)
  return parsedFormData;

};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="email"]`).val('');
}

const reserveTrip = (event) => {
  event.preventDefault();
  const tripData = readFormData();

  reportStatus('Sending trip data...');
  let postURL =  `https://trektravel.herokuapp.com/trips/${tripData.id}/reservations`
  console.log(postURL)
  axios.post(postURL, tripData)
  .then((response) => {
    console.log(response)
    reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
    clearForm();
  })
  .catch((error) => {
    if (error.response) {
      reportError(
        `Encountered an error:`,error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`, error.response.data.errors);
    }
  });
};

//check catch - fix hash
// clear form?? figure that out

$(document).ready(() => {
  $("#status-message").hide()
  $(".individual-trip").hide()
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', function(event){
    $(".individual-trip").show()
    loadTripDetails(event.target.id);//will also parse the details into hidden fiels for the reserveTrip form
  });
  $('#trip-form').submit(reserveTrip);
});
