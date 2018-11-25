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
    }
  }
}

const loadTrips = () => {;
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
          statusReport('Loading ${trip.name}...');
          axios.get(URL + `/${trip.id}`)
          // promise
          .then((response) => {
            statusReport('Successfully loaded ${trip.name}');

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
          })
        }
      }


       const showIndTrip = showTrip(trip);
       $('li:last').click(showIndTrip);
     })
  })

  // catch the errors if promise isnt kept
  .catch((error) => {
    statusReport(error);
    console.log(error);
  });
};




$(document).ready(() => {
  $('#load').click(loadTrips);
  // step 1.

});
