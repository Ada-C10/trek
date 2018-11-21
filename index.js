const URLBASE = 'https://trektravel.herokuapp.com';
const TRIPSPATH = '/trips'

const reportStatus = (message => {
  $('#status-message').html(message);
});

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

const buildClickTripHandler = (trip) => {
  const tripID = trip.id;
  return () => {
    axios.get(`${URLBASE}${TRIPSPATH}/${tripID}`)
  .then((response) => {
    const tripDetail = $('.trip-info');
    tripDetail.empty();
    const tripInfo = response.data;
    $('main').append(`
      <div class="trip-info">
      <h2>Trip Details</h2>
      <p>Id: ${tripInfo.id}</p>
      <p>Name: ${tripInfo.name}</p>
      <p>Continent: ${tripInfo.continent}</p>
      <p>Details: ${tripInfo.about}</p>
      <p>Category: ${tripInfo.category}</p>
      <p>Weeks: ${tripInfo.weeks}</p>
      <p>Cost: $${tripInfo.cost}</p>
      </div>`);
  })
  .catch((error) => {
    reportStatus(error);
    console.log(error);
});
};
};
const getTrips = () => {
  reportStatus('loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  const endpoint = `${URLBASE}${TRIPSPATH}`

  axios.get(endpoint)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        const tripName = $(`<li>${trip.name}</li>`);
        tripList.append(tripName);
        const clickEachTripHandler = buildClickTripHandler(trip);
        tripName.click(clickEachTripHandler);
      });
    })
    .catch((error) => {
      reportStatus(error);
      console.log(error);
    });
}


const reserveTrip = (event) => {
  event.preventDefault();

  const tripData = {
    name: $('input[name="name"]').val(),
    age: $('input[name="age"]').val(),
    email: $('input[name="email"]').val(),
  }

  reportStatus("Sending trip data...")

  axios.post()
}

$(document).ready(() => {
  $('#load-trips-button').click(getTrips);
  $('#trip-form').submit(reserveTrip);
  // // loadPets()
  // $('#pet-form').submit(createPet);
});
