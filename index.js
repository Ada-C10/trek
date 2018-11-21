const allTripURL = "https://trektravel.herokuapp.com/trips"

// Status Management
//
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


//  READY GO!
$(document).ready(() => {

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
                          <p>Cost: ${response.data.cost}</p>`)

        tripDetails.append(details);
            // tripList.append(`<href class="${trip.id}">${trip.name}</p>`);

        })
        .catch((error) => {
          reportStatus(`Encountered an error while loading trips: ${error.message}`);
          console.log(error);
        });
    };


  // all trips button
  $('.load-trips').click(loadTrips);
  // one trip details
  $('.list-trips').on('click', 'p', function() {
    const id = $(this).attr('data-id');
    loadTrip(id);
  });

  // $('#pet-form').submit(createPet);
});
