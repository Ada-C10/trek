// index.js
let URL = 'https://trektravel.herokuapp.com/trips';

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

const loadTrips = () => {
  reportStatus("loading trips...");

  // const reservationForm = $('.new-reservation');


  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    response.data.forEach((trip) => {
      // let singleTrip = $(`<li>${trip.name}</li>`)
      let button = createButton()

      tripList.append(`<li>${trip.name}</li>`);
      tripList.append(button)
      button.on('click', () => {
        clickDetails(`${trip.id}`);
        // clickDetails(`${trip.id}`);
      })
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
  });
};

// $("#details-btn").click(function(){
//     $("ul#trip-details").slideDown();
// });

// button.on('click', () => {
//   clickDetails(`${trip.id}`).slideDown();
// })
//

function createButton() {
  const button = $('<button/>', {
    text: 'See Trip Details',
    id: 'details-btn'
  });
  return button
}



const clickDetails = (id) => {

  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const tripForm = $('#new-reservation');
  tripForm.empty();
  $('.new-reservation').show();
  const tripURL = (URL + `/` + id)
  // console.log(tripURL)
  axios.get(tripURL)
  .then((response) => {
    tripDetails.append(`<li class="name">${response.data.name}, ${response.data.continent}</li>`);
    tripDetails.append(`<li class="description">${response.data.about}</li>`);
    tripDetails.append(`<li class="description">${response.data.weeks} week(s)</li>`);
    tripDetails.append(`<li class="description"> $${response.data.cost}</li>`);
    tripDetails.append(`<li class="description">Category: ${response.data.category}</li>`);
    let reservation = $(`<h2 class="form-title">Request this trip</h2>
                        <form id="trip-form" data-id="${response.data.id}">
                          <div>
                            <label class='form' for="name">Name</label>
                            <input type="text" name="name" />
                          </div>
                          <div>
                            <label class='form' for="age">Age</label>
                            <input class='age' type="integer" name="age" />
                          </div>
                          <div>
                            <label class='form' for="email">Email </label>
                            <input class='email' type="text" name="email" />
                          </div>
                          <input type="submit" name="add-reservation" value="Add Reservation" />
                        </form>`)
    tripDetails.append(reservation)
  })
}

const readFormData = () => {
  const parsedFormData = {};

  // const idFromForm = $(`#trip-form label[data-id]`).val();
  // parsedFormData['id'] = idFromForm ? idFromForm : undefined;

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const ageFromForm = $(`#trip-form input[name="age"]`).val();
  parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

// const createReservation = () => {
//   event.preventDefault();
//   let reservationURL = (tripURL + `/` + `reservations`)
//   axios.post(reservationURL)
//   .then((response) => {
//     console.log('post method workd');
//     console.log(response);
//   })
//
//   .catch((error) => {
//     console.log(error);
//   });
// };

// const clearForm = () => {
//   $(`#trip-form input[name="name"]`).val('');
//   $(`#trip-form input[name="age"]`).val('');
//   $(`#trip-form input[name="email"]`).val('');
// }

const createReservation = (event) => {
  // Note that createTrip is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();

  alert ('something');

  const reservationData = readFormData();
  console.log(reservationData);
  // let reservationURL = (tripURL + `/` + `reservations`)
  //
  // reportStatus('Sending trip data...');
  //
  // axios.post(URL, reservationData)
  // .then((response) => {
  //   reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
  //   clearForm();
  // })
  // .catch((error) => {
  //   console.log(error.response);
  //   if (error.response.data && error.response.data.errors) {
  //     reportError(
  //       `Encountered an error: ${error.message}`,
  //       error.response.data.errors
  //     );
  //   } else {
  //     reportStatus(`Encountered an error: ${error.message}`);
  //   }
  // });
};



// function clickDetails(tripId) {
//   alert('something happened');
  // URL = $(URL).append(trip.id)
  // axios.get(URL)
  // .then((response) => {
  //   response.for((trip) => {
  //     tripList.append(`<li>${trip.name}</li>`);
  //     tripList.append(createButton())
  //   });
  // })
  // .catch((error) => {
  //   reportStatus(error);
  //   console.log(error);
  // });
// }



$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-form').submit(createReservation);
  // $("#details-btn").click(function(){
  //     $("ul#trip-details").slideDown();
  // });
  // $('#trip-form').submit(createReservation);
  // we select something by the id of create trip button. when an event on this element called submit happens, we wil use the callback createTrip
});

// event
// parse the form on the HTML for user input
// make the POST request
// give UI feedback


// $(document).ready(function(){
//     $(".btn1").click(function(){
//         $("p").slideUp();
//     });
//     $(".btn2").click(function(){
//         $("p").slideDown();
//     });
// });
