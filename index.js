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
    reportError(error)
    console.log('something went wrong');
  });
};

const loadTripDetails = (trip) => {
  const tripDetails = () => {
    console.log(trip)
  };

  return tripDetails;
}

$(document).ready(() => {
  $('#load').click(loadTrips);

  $('ul').on('click', 'li', function(){
    const tripId = $(this).attr('id');
    loadTripDetails(tripId)
  });
  
  // $('#trip-form').submit(createTrip);
});
