const baseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {

  $('.current-trips').show();
  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(baseURL)
    .then((response) => {
      response.data.forEach((trip) => {
        const tripName = $(`<li><button>${trip.name}</button></li>`);
        tripName.data("id", trip.id);

        tripName.addClass("trip-link");
        console.log(tripName.data("id"));
        tripList.append(tripName);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });
};

const tripDetails = (tripID) => {

  reportStatus('Getting Trip Details...');

  const tripInfo = $('#trip-info');
  tripInfo.empty();

  const tripURL = `${baseURL}/${tripID}`;

  axios.get(tripURL)
    .then((response) => {
      $('.trip-details').show();

      tripInfo.append(`<li>Name: ${response.data.name}</li>`);
      tripInfo.append(`<li>About: ${response.data.about}</li>`);
      tripInfo.append(`<li>Continent: ${response.data.continent}</li>`);
      tripInfo.append(`<li>Category: ${response.data.category}</li>`);
      tripInfo.append(`<li>Weeks: ${response.data.weeks}</li>`);
      tripInfo.append(`<li>Price: ${response.data.cost}</li>`);
      tripInfo.append(`<li>Trip ID: ${response.data.id}</li>`);

      reportStatus(`Successfully Loaded Trip #${tripID}`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });

};

const readFormData = () => {
//
//   const inputs = ["name", "age", "owner"]
//
//   const formData = {};
//
//   inputs.forEach(input) => {
//     const data = $(`#pet-form input[name="${input}"]`).val();
//     formData[input] = data ? data : undefined;
//   }
//
//   const name = $('#pet-form input[name="name"]').val();
//   const age = $('#pet-form input[name="age"]').val();
//   const owner = $('#pet-form input[name="owner"]').val();
//
//
//
//   return {
//     name: name,
//     age: age,
//     owner: owner
//   }
//
// };
//
// const createPet = (event) => {
//   event.preventDefault();
//   reportStatus("submitting new pet");
//
//   const petData = readFormData();
//
//   axios.post(URL, petData)
//     .then((response) => {
//       reportStatus('Successfully added a pet!');
//     })
//     .catch((error) => {
//   console.log(error.response);
//   // Make sure the server actually sent us errors. If
//   // there's a different problem, like a typo in the URL
//   // or a network error, the response won't be filled in.
//   if (error.response.data && error.response.data.errors) {
//     // User our new helper method
//     reportError(
//       `Encountered an error: ${error.message}`,
//       error.response.data.errors
//     );
//   } else {
//     // This is what we had before
//     reportStatus(`Encountered an error: ${error.message}`);
//   }
// });
// };





$(document).ready(() => {
  $('.current-trips').hide();
  $('.trip-details').hide();

  $('#load').click(loadTrips);
  // $('#load').click($(this).text(), tripDetails);

  $('#trip-list').on('click', 'li', function(event) {
    const tripID = $(this).data("id");
    // console.log(tripID);
    tripDetails(tripID);
   });
});
