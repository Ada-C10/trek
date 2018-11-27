const TRIPS = 'https://trektravel.herokuapp.com/trips';

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

const createPet = (event => {
  event.preventDefault();

  const petData = {
    name: $('input[name="name"]').val(),
    age: $('input[name="age"]').val(),
    owner: $('input[name="owner"]').val()
  };

  reportStatus('Sending pet data...');

  axios.post(URL, petData)
  .then((response) => {
    console.log(response.data)
    reportStatus(`successfully added a pet with ID ${response.data.id}`)
  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
  })

});

const loadTrips = () => {
  reportStatus("* ~ * loading trips ~ * ~")
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(TRIPS)
  .then((response) => {
    reportStatus(`Successfully loaded trips!`)

    response.data.forEach((trip) => {
      tripList.append(`<li id="${trip.id}">${trip.name}</li>`);
    });
  })
  .catch((error) => {
    reportError(error);
    console.log('something went wrong');
  });
};

const loadTripDetails = (tripId) => {

  const tripDetails = () => {

    const detail = $('#trip-detail');
    detail.empty();

    axios.get(`${TRIPS}/${tripId}`)
    .then((response) => {
      reportStatus(`Successfully loaded detail of trip!`)
      detail.append(`<div class='detail-container'>
      <h2>Trip ${response.data.id} Details</h2>
        <li id="name">${response.data.name}</li>
        <li id="continent">${response.data.continent}</li>
        <li id="about">${response.data.about}</li>
        <li id="weeks"><b>Weeks:</b> ${response.data.weeks}</li>
        <li id="cost"><b>Cost:</b> $${response.data.cost}</li>
      </div>`);
    })
    .catch((error) => {
      reportError(error);
      console.log('something went wrong :c');
    });
  };
  return tripDetails();
};



$(document).ready(() => {
  $('#load').click(loadTrips);

  $('ul').on('click', 'li', function(){
    const tripId = $(this).attr('id');
    loadTripDetails(tripId)
  });

  $('#trip-form').submit(createTrip);
});
