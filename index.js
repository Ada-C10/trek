const URL =  'https://trektravel.herokuapp.com/trips';

const statusReport = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    };
  }
};

  // create a form and append it to the html
const createForm = (section) => {
  section.empty();
  section.append('<h1> Reserve a Trip </h1>');
  // id = trip form
  section.append('<form id="trip-form">');
  const form = $('#trip-form');
  form.append('<div><label for="name">Name</label><input type="text" name="name"/></div>');
  form.append('<div><label for="age">Age</label><input type="number" name="age"/></div>');
  form.append('<div><label for="email">Email</label><input type="text" name="email"/></div>');
  form.append('<div><input type="submit" name="add-trip" value="Reserve" /></div>');

};

const loadTrips = () => {
  statusReport("Trips Loading...");
  // this bit keeps stuff from getting added on more and more each time stuff appends
  let tripList = $('#trip-list');
  tripList.empty();
  axios.get(URL)
  // promise
  .then((response) => {
    statusReport (`Successfully loaded ${response.data.length} trip`);
    response.data.forEach((trip) => {
      let name = `<li>${trip.name} </li>`
      tripList.append(name);
      // create another function within, pass in the trip to new function
      const showTrip = (trip) => {
        // closure
        return () => {
          statusReport(`Loading ${trip.name}...`);
          axios.get(URL + `/${trip.id}`)
          // promise
          .then((response) => {
            statusReport(`Successfully loaded ${trip.name}`);
            // connect trip details to the id in html
            const tripDetails = $('#trip-details');
            // empty it out before appending
            tripDetails.empty();
            // append the data to html
            tripDetails.append(`<h2> Trip Details </h2>`);
            tripDetails.append(`<h3> Name: ${response.data.name}</h3>`);
            tripDetails.append(`<h3> Continent: ${response.data.continent}</h3>`);
            tripDetails.append(`<h3> Weeks: ${response.data.weeks}</h3>`);
            tripDetails.append(`<h3> Cost: ${response.data.cost}</h3>`);
            tripDetails.append(`<h3> About: ${response.data.about}</h3>`);
            // start reserve a trip form
            const form = $('#reserve');
            createForm(form);
          })
          .catch((error) => {
            statusReport(error);
          });
        }
      };
      // make a post request to reserve a trip
      const reservation = (trip) => {
        return (reservation) => {
          reservation.preventDefault();

          const data = {
            'name': $('input[name="name"]').val(),
            'age': $('input[name="age"]').val(),
            'email': $('input[name="email"]').val(),
          }
          axios.post(URL + `/${trip.id}/reservations`, data)
          // promise
          .then((response) => {
            statusReport(`Successfully added trip reservation with name: ${response.data.name}`);
          })
          // if not, error
          .catch((error) => {
            if (error.response.data && error.response.data.errors) {
              reportError(
                `Encountered an error: ${error.message}`,
                error.response.data.errors
              );
            } else {
              statusReport(`Encountered an error: ${error.message}`);
            }
          })
        }
      }
      const showIndTrip = showTrip(trip);
      $('li:last').click(showIndTrip);
      const makeReservation = reservation(trip);
      // use .on not .click to submit the thing
      $('#reserve').on('submit', '#trip-form', makeReservation);
    })
  })
  // catch the errors if promise isnt kept
  .catch((error) => {
    statusReport(error);
    console.log(error);
  });
};

// trigger the event for clicking, starting the whole thing
$(document).ready(() => {
  $('#load').click(loadTrips);
});
