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
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li id= ${trip.id}> ${trip.name}</li>`);
        console.log(tripList)
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};
//  click event -- acton show details
//
//View Individual Trip Details
const loadTripDetails = (id) => {

  console.log(event)
  reportStatus('Loading trip details...');

  const tripDetails = $('#trip-details');
  tripDetails.empty();

let tripUrl =  `https://trektravel.herokuapp.com/trips/${id}`
  axios.get(tripUrl)
    .then((response) => {
      console.log(response.data)
        reportStatus(`Successfully loaded ${response.data.name} trip`)
      const details  = Object.entries(response.data)
      for (const [key, value] of details){
        tripDetails.append(`<li>${key}: ${value}</li>`);
      // });
    }
      $("p.trip-name").append(` <strong>${response.data.name}</strong>`);
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};


const tripData = {};
tripData["value"] = 5;

axios.post(URL, tripData)
.then((response) => {

})
.catch((error) => {

});
// // Creating Trips
// //
// const readFormData = () => {
//   const parsedFormData = {};
//
//   const nameFromForm = $(`#trip-form input[name="name"]`).val();
//   parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
//
//   const ageFromForm = $(`#trip-form input[name="age"]`).val();
//   parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;
//
//   const ownerFromForm = $(`#trip-form input[name="owner"]`).val();
//   parsedFormData['owner'] = ownerFromForm ? ownerFromForm : undefined;
//
//   return parsedFormData;
// };
//
// const clearForm = () => {
//   $(`#trip-form input[name="name"]`).val('');
//   $(`#trip-form input[name="age"]`).val('');
//   $(`#trip-form input[name="owner"]`).val('');
// }

// const createTrip = (event) => {
//   // Note that createTrip is a handler for a `submit`
//   // event, which means we need to call `preventDefault`
//   // to avoid a page reload
//   event.preventDefault();
//
//   const tripData = readFormData();
//   console.log(tripData);
//
//   reportStatus('Sending trip data...');
//
//   // axios.post(URL, tripData)
//   //   .then((response) => {
//   //     reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
//   //     clearForm();
//   //   })
//   //   .catch((error) => {
//   //     console.log(error.response);
//   //     if (error.response.data && error.response.data.errors) {
//   //       reportError(
//   //         `Encountered an error: ${error.message}`,
//   //         error.response.data.errors
//   //       );
//   //     } else {
//   //       reportStatus(`Encountered an error: ${error.message}`);
//   //     }
//   //   });
// };

//
// OK GO!!!!!
//
$(document).ready(() => {
  $(".individual-trip").hide()
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'li', function(event){
    $(".individual-trip").show()
    loadTripDetails(event.target.id);
    console.log(event.target.id)
  });
  $('#trip-form').submit(createTrip);
});
