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

const showTrip = (response) => {
  // console.log(response);
  const target = $('#trip-details');
  target.empty();
  let details = `<h4>Name: ${response.name}</h4>`;
  details += `<p>Continent: ${response.continent}</p>`;
  details += `<p>Category: ${response.category}</p>`;
  details += `<p>Weeks: ${response.weeks}</p>`;
  details += `<p>Cost: $${response.cost}</p>`;
  details += `<p>About:</p><br><p>${response.about}`;
  target.append('<h3>Trip Details</h3>');
  target.append(details);
};

const showReservationForm = (response) => {
  const target = $('#reserve-trip');
  console.log(target);
  target.css("visibility", "visible");
  $('.trip-name').append(response.name);
  // $('label[for="trip"]').prepend('label[for="trip"] value="Hello there"');
  // let formDetails = $('<form>');
  // formDetails.append(
  //   '<div><label for="name">Your name:</label>'
  // )
  //
  //
  //
  //
  // console.log(response);
  // target.empty();
  // let details = `<h4>Name: ${response.name}</h4>`;
  // details += `<p>Continent: ${response.continent}</p>`;
  // details += `<p>Category: ${response.category}</p>`;
  // details += `<p>Weeks: ${response.weeks}</p>`;
  // details += `<p>Cost: $${response.cost}</p>`;
  // details += `<p>About:</p><br><p>${response.about}`;
  // target.append('<h3>Reserve Trip</h3>');
  // target.append(formDetails);
};

const buildTripCallback = (id) => {
  const loadTrip = () => {

    axios.get(URL+`/${id}`)
      .then((response) => {
        console.log(response.data);
        reportStatus(`Successfully loaded trip ${id}.`);
        showTrip(response.data);
        showReservationForm(response.data);
      })
      .catch((error) => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
        console.log(error);
      });
  }
  return loadTrip;
};

const loadTrips = () => {

  const tripList = $('#all-trips');
  tripList.append('<h3>All Trips</h3>');

  axios.get(URL)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<li class=${trip.id}>${trip.name}</li>`);
        const tripClickHandler = buildTripCallback(trip.id);
        $(`.${trip.id}`).click(tripClickHandler);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const loadTripDetails = () => {


};

$(document).ready(() => {
  $('#see-trips-button').click(loadTrips);
  $('#all-trips').on('click', 'li', loadTripDetails);
});
