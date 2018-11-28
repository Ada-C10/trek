const URL = 'https://trektravel.herokuapp.com/trips/';

// Status Reports
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

// Load Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();
  // const infoList = $('#info-list');

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      tripList.append('<h3>All Trips</h3>')

      response.data.forEach((trip) => {
        // tripList.append(`<a href="${URL}/${trip.id}" id="trip-button"><li class ="trip-details">${trip.name}</li></a>`);
        tripList.append(`<li class ="trip-details"><a class="trip-button" id=${trip.id}>${trip.name}</a></li>`);
        // tripList.append(`<li>continent: ${trip.continent}, weeks: ${trip.weeks}, category: ${trip.category}</li>`);
      });
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      }
    });
};


//Show trip detail
const loadDetails = (id) => {
  reportStatus('Sending trip data..');
  // const DETURL = (`${URL}\\${this.id}`);
  const tripBlurb = $('#trip-blurb');
  tripBlurb.empty();

  // const tripForm =$('#trip-form');
  // tripForm.empty();

  axios.get(URL + id)
  .then((response) => {
    tripBlurb.append('<h3>Trip Details</h3>');

    for (let tripInfo in response.data) {
      tripBlurb.append(`<li class="trip info"><strong>${tripInfo}</strong>: ${response.data[tripInfo]} </li>`);
    }
    reportStatus(`Successfully loaded trip data`);

    // tripForm.append('<h3>Reserve Trip</h3>');
  });


};

// Make reservation
const createReservation = (id) => {
// const createReservation = (event) => {
  // event.preventDefault();
// TypeError: event.preventDefault is not a function at createReservation
// why??
  const reserveURL = `https://trektravel.herokuapp.com/trips/${id}/reservations`

  const data = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
    trip_id: id.val()
    // trip_id: $('input[trip_id="trip_id"]').val(),
  };

  axios.post(reserveURL, data)
    .then((response)=> {
      reportStatus('Succesfully added reservation')
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};


///
$(document).ready(() => {
  $('#see-trips').click(loadTrips);

  $('#trip-list').on('click', 'a', function() {
    loadDetails(this.id);
    const trip_id = this.id
  $('#trip-form').submit(createReservation(trip_id));
  });

})
