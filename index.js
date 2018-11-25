const URL = 'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const sendGetRequest = (id) => {
  const buildGetRequest = () => {
    reportStatus('Loading...');
    axios.get(URL + id)
      .then((response) => {
        reportStatus('Successfully loaded!')
        let element = id === '/' ? $('#trip-list') : $('#trip-detail-list')
        parseGetResponse(element, response);
      })
      .catch((error) => {
        reportStatus(`Encountered an error ${error.message}`);
      });
  };
  return buildGetRequest;
};

const parseGetResponse = (element, response) => {
  element.empty();
  const tripData = response.data;
  tripData.length ?
  parseTripCollection(element, tripData) : parseIndividualTrip(element, tripData)
};

const parseTripCollection = (element, response) => {
  response.forEach((trip) => {
    element.append(
      `<li><button id="${trip.id}" class="btn btn-outline-secondary btn-block">
      ${trip.name}</button></li>`);
  });
}

const parseIndividualTrip = (element, response) => {
  const tripProperties = ['name', 'continent', 'category', 'weeks', 'cost', 'about']
  element.append('<h2>Trip Details</h2>');
  tripProperties.forEach((prop) => {
    let header = prop.replace(/^\w/, c => c.toUpperCase());
    element.append(
      `<li>${header}: ${response[prop]}</li>`
    )
  });
  appendResForm(response.id);
}

const appendResForm = (tripId) => {
  $('#reserve-form').empty();
  $('#reserve-form').append(
    `<h3>Reserve a trip</h3>
    <input type="hidden" id="tripId" name="tripId" value="${tripId}">
    <div>
      <label for="name">Name</label><input type="text" name="name" />
    </div>
    <div>
      <label for="email">Email</label><input type="text" name="email" />
    </div>
    <input type="submit" name="add-res" value="Add Res"/>`)
}

const reserveTrip = (event) => {
  event.preventDefault();
  reportStatus('Sending request...');

  const createResData = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    id: $('input[id="tripId"]').val()
  };

  axios.post(URL + `/${createResData.id}` + '/reservations', createResData)
    .then((response) => {
      reportStatus(`Sucessfully reserved trip ${response.data.id}!`);
      $('#reserve-form')[0].reset();
    })
    .catch((error) => {
      reportStatus(`Encountered an error: ${error.message}`)
    });
};

$(document).ready(() => {
  const getAllTrips = sendGetRequest('/');
  $('#load-all-trips').click(getAllTrips);

  $('ul').on('click', 'button', function(event) {
    let id = '/' + $(this).attr('id');
    const getTripDetails = sendGetRequest(id);
    getTripDetails();
  });

  $('#reserve-form').submit(reserveTrip);
});
