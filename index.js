const URL = 'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('.status-message').html(message);
};

const displayError = (error) => {
  if (error.response === undefined) {
    reportStatus(`${error.message}`)
  } else {
    reportStatus(`${error.message}: ${error.response.statusText}`);
  }
}

const displayFormErrors = (error) => {
  const formErrors = error.response.data.errors
  $('.form-errors').empty();
  for (const field in formErrors) {
    for (const problem of formErrors[field]) {
      $('.form-errors').append(`<p>${capitalize(field)}: ${problem}</p>`);
    }
  }
};

const displayNoContentError = (response) => {
  reportStatus(`Request failed with status code ${response.status}: ${response.statusText}.`);
};

const capitalize = (string) => {
  return string.replace(/^\w/, c => c.toUpperCase());
}

const sendGetRequest = (id) => {
  const buildGetRequest = () => {
    reportStatus('Loading...');
    axios.get(URL + id)
      .then((response) => {
        if (response.status === 204) {
          displayNoContentError(response);
        } else {
          let callback = response.data.length ? parseTripCollection : parseIndividualTrip
          parseGetResponse(response, callback)
        }
      })
      .catch((error) => {
        displayError(error);
      });
  };
  return buildGetRequest;
};

const parseGetResponse = (response, callback) => {
  let tripData = response.data
  let element = callback === parseTripCollection ? $('#trip-list') : $('#trip-detail-list')
  element.empty();
  callback(tripData, element);
};

const parseTripCollection = (tripData, element) => {
  reportStatus(`Successfully loaded ${tripData.length} trips.`)
  $('.form-errors').empty();
  tripData.forEach((trip) => {
    element.append(
      `<li><button id="${trip.id}" class="btn btn-outline-secondary btn-block">
      ${trip.name}</button></li>`);
  });
}

const parseIndividualTrip = (tripData, element) => {
  reportStatus(`Successfully loaded ${tripData.name}.`)
  $('.form-errors').empty();
  element.append(`<h3>${tripData.name}</h3>`);
  const tripProperties = ['continent', 'category', 'weeks', 'cost']
  tripProperties.forEach((prop) => {
    let header = capitalize(prop);
    element.append(
      `<li>${header}: ${tripData[prop]}</li>`
    )
  });
  element.append(`<p>${tripData.about}</p>`)
  appendResForm(tripData.id);
}

const appendResForm = (tripId) => {
  $('#reserve-form').empty();
  $('#reserve-form').append(
    `<h4>Reserve a trip</h4>
    <input type="hidden" id="tripId" name="tripId" value="${tripId}">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" />
    </div>
    <input type="submit" name="add-res" value="Submit"/>`)
}

const reserveTrip = (event) => {
  event.preventDefault();
  reportStatus('Sending request...');

  const resFormData = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    id: $('input[id="tripId"]').val()
  };

  const uri = URL + `/${resFormData.id}` + '/reservations'

  axios.post(uri, resFormData)
    .then((response) => {
      if (response.status === 204) {
        displayNoContentError(response);
      } else {
        reportStatus(`Sucessfully reserved! Please save your reservation id: ${response.data.id}`);
        $('.form-errors').empty();
      }
      $('#reserve-form')[0].reset();
    })
    .catch((error) => {
        displayError(error);
        if (error.response.data.errors) {
          displayFormErrors(error);
        }
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
