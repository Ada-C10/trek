const allTripURL = "https://trektravel.herokuapp.com/trips"

// Status Management
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

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="email"]`).val('');
}


//  READY GO!
$(document).ready(() => {
// ALL TRIPS
  const loadTrips = () => {
    reportStatus('Loading trips...');

    const tripList = $('.list-trips');
    tripList.empty();
   // trip id attached as class to look up individual trips?
    axios.get(allTripURL)
      .then((response) => {
        reportStatus(`Successfully loaded ${response.data.length} trips`);
        response.data.forEach((trip) => {
          tripList.append(`<p data-id="${trip.id}">${trip.name}</p>`);
        });
      })
      .catch((error) => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
        console.log(error);
      });
  };

  // INDIVIDUAL TRIP DEAILS
  const loadTrip = function loadTrip(id) {
    reportStatus('Loading trip...');

    const tripDetails = $('.trip-details');
    const reservationForm = $('.trip-reservation');
    tripDetails.empty();
   // trip id attached as class to look up individual trips?
    axios.get(`${allTripURL}/${id}`)
      .then((response) => {
        reportStatus(`Successfully loaded ${response.data.name}`);
        let details = $(`<h2>${response.data.name}</h2>
                        <p>ID: ${response.data.id}</p>
                        <p>Continent: ${response.data.continent}</p>
                        <p>About: ${response.data.about}</p>
                        <p>Category: ${response.data.category}</p>
                        <p>Weeks: ${response.data.weeks}</p>
                        <p>Cost: $${response.data.cost}</p>`)
        let reservation = $(`<h3>Request this Trip</h3>
                            <form id="trip-form" data-id="${response.data.id}">
                              <div>
                                <label for="name">Name</label>
                                <input type="text" name="name" />
                              </div>

                              <div>
                                <label for="email">Email</label>
                                <input type="text" name="email" />
                              </div>

                              <input type="submit" class="btn btn-primary" name="add-reservation" value="Add Reservation" />
                            </form>`)
      tripDetails.append(details);
      reservationForm.append(reservation);


      })
      .catch((error) => {
        reportStatus(`Encountered an error while loading trips: ${error.message}`);
        console.log(error);
      });
  };

  // TRIP REQUEST
  const readFormData = () => {
    const parsedFormData = {};

    const nameFromForm = $(`#trip-form input[name="name"]`).val();
    parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

    const emailFromForm = $(`#trip-form input[name="email"]`).val();
    parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

    return parsedFormData;
  };

  const tripRequest = function tripRequest(id) {

    const tripData = readFormData();
    console.log(tripData);

    reportStatus('Sending trip data...');

    axios.post(`${allTripURL}/${id}/reservations`, tripData)
      .then((response) => {
        reportStatus(`Successfully added a request!`);
        clearForm();
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.data && error.response.data.errors) {
          reportError(
            `Encountered an error: ${error.message}`,
            error.response.data.errors
          );
        } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
      });
  };


  // all trips button
  $('.load-trips').click(loadTrips);
  // one trip details
  $('.list-trips').on('click', 'p', function() {
    const id = $(this).attr('data-id');
    loadTrip(id);
  });

  $('body').on('submit', 'form#trip-form', function(event) {
    event.preventDefault();

    const id = $(this).attr('data-id');
    tripRequest(id);
  });
});
