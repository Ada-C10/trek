// const URL =  'https://trektravel.herokuapp.com/trips';
// let tripID = 0;
//
// const statusReport = (message) => {
//   $('#status-message').html(message);
// };
//
// const reportError = (message, errors) => {

// Loading trips
// create a form and append it to the html
// const createForm = (section) => {
//   section.empty();
//   section.append('<h1> Reserve a Trip </h1>');
//   // id = trip form
//   section.append('<form id="trip-form">');
//   const form = $('#trip-form');
//   form.append('<div><label for="name">Name</label><input type="text" name="name"/></div>');
//   form.append('<div><label for="age">Age</label><input type="number" name="age"/></div>');
//   form.append('<div><label for="email">Email</label><input type="text" name="email"/></div>');
//   form.append('<div><input type="submit" name="add-trip" value="Reserve" /></div>');

// };

// load trips
// const loadTrips = () => {
//   statusReport("Trips Loading...");
//   // this bit keeps stuff from getting added on more and more each time stuff appends
//   const tripList = $('#trip-list');
//   tripList.empty();
//
//   axios.get(URL)
//   // promise
//   .then((response) => {
//     console.log("in the load trips");
//     statusReport (`Successfully loaded trip`);
//     response.data.forEach((trip) => {
//       const trips = `<li>${trip.name} </li>`
//       tripList.append(trips);
//       trips.on('click', () => {
//         loadTripDetails(`${trip.id}`)
//       });
//     });
//   })
//   .catch((error) => {
//     statusReport(error);
//   });
// };
//
//
//
//
//
//
//
//
// create another function within, pass in the trip to new function
// const showTrip = (trip) => {
//
//   return () => {
//     statusReport(`Loading ${trip.name}...`);
//     axios.get(URL + `/${trip.id}`)
//     // promise
//     .then((response) => {
//       statusReport(`Successfully loaded ${trip.name}`);
//       // connect trip details to the id in html
//       const tripDetails = $('#trip-details');
//       tripID = trip.id
//       // empty it out before appending
//       tripDetails.empty();
//       // append the data to html
//       tripDetails.append(`<h2> Trip Details </h2>`);
//       tripDetails.append(`<h3> Name: ${response.data.name}</h3>`);
//       tripDetails.append(`<h3> Continent: ${response.data.continent}</h3>`);
//       tripDetails.append(`<h3> Weeks: ${response.data.weeks}</h3>`);
//       tripDetails.append(`<h3> Cost: ${response.data.cost}</h3>`);
//       tripDetails.append(`<h3> About: ${response.data.about}</h3>`);
//       // start reserve a trip form
//       const form = $('#reserve');
//       createForm(form);
//       console.log(trip.id)
//     })
//     .catch((error) => {
//       statusReport(error);
//     });
//   }
// };

//    const reservation = (tripID) => {
//         return (reservation) => {
//           reservation.preventDefault();
//
//           const data = {
//             'name': $('input[name="name"]').val(),
//             'age': $('input[name="age"]').val(),
//             'email': $('input[name="email"]').val(),
//           }
//           axios.post(URL + `/${this.tripID}/reservations`, data)
//           // promise
//           .then((response) => {
//             statusReport(`Successfully added trip reservation with name: ${response.data.name}`);
//           })
//           // if not, error
//           .catch((error) => {
//             if (error.response.data && error.response.data.errors) {
//               reportError(
//                 `Encountered an error: ${error.message}`,
//                 error.response.data.errors
//               );
//             } else {
//               statusReport(`Encountered an error: ${error.message}`);
//             }
//           })
//         }
//       }
//       const showIndTrip = showTrip(trip);
//       $('li:last').click(showIndTrip);
//       const makeReservation = reservation(trip);
//       // use .on not .click to submit the thing
//       $('#reserve').on('submit', '#trip-form', makeReservation);
//     })
//   })
//   // catch the errors if promise isnt kept
//   .catch((error) => {
//     statusReport(error);
//     console.log(error);
//   });
// };
//
// // trigger the event for clicking, starting the whole thing
// $(document).ready(() => {
//   $('#load').click(loadTrips);
// });

const URL = 'https://trektravel.herokuapp.com/trips';
// set up empty variable to hold the id
let tripID = 0;

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


const showTrips = () => {
  reportStatus("loading trip detail...");

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      const trips = $(`<li>${trip.name}</li>`)
      tripList.append(trips);
      trips.on('click', () => {
        loadTripDetails(`${trip.id}`)
      });
      trips.on("click", function() {
        $("#addForm").toggle()
        tripID = trip.id
      });
    });
  })
  .catch((error) => {
    reportStatus(error);
  });
};

// load trip details

const URL1 = 'https://trektravel.herokuapp.com/trips/';

const loadTripDetails = (tripId) => {

  reportStatus("loading trips...")

  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  axios.get(URL1+`${tripId}`)
  .then((response) => {
    reportStatus(`successfully loaded individual trip ${response.data.id}`)
    tripDetail.append(`<p> Trip Detail </p>`);
    tripDetail.append(`<li>Id: ${response.data.id}</li>`);
    tripDetail.append(`<li>Name: ${response.data.name}</li>`);
    tripDetail.append(`<li>continent: ${response.data.continent}</li>`);
    tripDetail.append(`<li> Details: ${response.data.about}</li>`);
    tripDetail.append(`<li> Category: ${response.data.category}</li>`);
    tripDetail.append(`<li> Weeks: ${response.data.weeks}</li>`);
    tripDetail.append(`<li>Cost: ${response.data.cost}</li>`);
  })
  .catch((error) => {
    reportStatus(error);
  });

};

// create reservation

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#addForm input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#addForm input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#addForm input[name="name"]`).val('');
  $(`#addForm input[name="email"]`).val('');
}

const createReservation = (event) => {
  event.preventDefault();

  const reservationData = readFormData();
  console.log(reservationData);

  reportStatus('Sending reservation data...');

  axios.post((URL + `/${tripID}/reservations`), reservationData)
  .then((response) => {
    reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
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

$(document).ready(() => {
  $('#button-load-trips').click(showTrips);
  $('#addForm').submit(createReservation);
});
