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
  const target = $('#trip-details');
  target.css("visibility", "visible");
  target.empty();
  let details = `<h4>Name: <span class="trip">${response.name}</span></h4>`;
  details += `<p>Category: <span>${response.category}</span></p>`;
  details += `<p>Weeks: <span>${response.weeks}</span></p>`;
  details += `<p>Cost: <span>$${response.cost}</span></p>`;
  details += `<p>About:</p><br><p>${response.about}`;
  target.append('<h3>Trip Details</h3>');
  target.append(details);
};

const createReservation = (event) => {
  event.preventDefault();
  console.log(event);
  let tripID = $('.trip-name input').attr("class");
  // console.log(colClass);
//
  const data = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val()
  };

  axios.post(URL+`/${tripID}/reservations`, data)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully added reservation with ID ${response.data.id} for ${response.data.name}`);
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors
        )
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

const showReservationForm = (response) => {
  const target = $('#reserve-trip');
  // target.empty();
  target.css("visibility", "visible");
  const tripName = $('.trip-name');
  tripName.empty();
  tripName.append(`<label for="trip">Trip Name:</label><input type="text" name="trip" value="${response.name}" class="${response.id} form-control" />`);
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
  tripList.empty();
  tripList.append('<h3>All Trips</h3>');

  axios.get(URL)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        tripList.append(`<tr class=${trip.id}><td>${trip.name}</td></tr>`);
        const tripClickHandler = buildTripCallback(trip.id);
        $(`.${trip.id}`).click(tripClickHandler);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

$(document).ready(() => {
  $('#see-trips-button').click(loadTrips);
  // $('#all-trips').on('click', 'li', loadTripDetails);
  $('#reservation-form').submit(createReservation);
});
