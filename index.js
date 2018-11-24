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
    // tripList.empty();
   // trip id attached as class to look up individual trips?
    axios.get(allTripURL)
      .then((response) => {
        reportStatus(`Successfully loaded ${response.data.length} trips`);
        response.data.forEach((trip) => {
          tripList.append(`<p data-id="${trip.id}" class="page">${trip.name}</p>`);
        });
        $('.list-trips').scroll();
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
        let details = $(`<h2 class="sub-title text-center border-bottom">${response.data.name}</h2>
                        <p>ID: ${response.data.id}</p>
                        <p>Continent: ${response.data.continent}</p>
                        <p>About: ${response.data.about}</p>
                        <p>Category: ${response.data.category}</p>
                        <p>Weeks: ${response.data.weeks}</p>
                        <p>Cost: $${response.data.cost}</p>`)
        let reservation = $(`<h2 class="sub-title text-center border-bottom">Request this Trip</h2>
                            <form id="trip-form" data-id="${response.data.id}">
                              <div>
                                <label for="name">Name</label>
                                <input type="text" name="name" />
                              </div>

                              <div>
                                <label for="email">Email</label>
                                <input type="text" name="email" />
                              </div>

                              <input type="submit" class="btn btn-dark" name="add-reservation" value="Add Reservation" />
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
  $('.load-trips').on('click', function() {
    loadTrips();
  });
  // $('.load-trips').click(loadTrips);
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

  $('.list-trips').scroll(function() {
  });



  // background image slide:
  let jumbotronBG = ['https://www.intheflesh.it/wp-content/uploads/2014/05/Dandelion-Field-Sunset-Desktop-Wallpaper.jpg', 'https://cdn.hipwallpaper.com/i/64/86/w23fqh.jpg', 'http://s1.picswalls.com/wallpapers/2014/07/28/free-egypt-wallpaper_1207553_115.jpg'];
  let changeImage = $(".jumbotron");
  let i = 0;

  function cycleImage() {
    changeImage.css({
      'background-image': 'url(' + jumbotronBG[i] + ")"
    });
    i = i + 1;
    if (i == jumbotronBG.length) {
      i = 0;
    }
  }

  setInterval(cycleImage, 4000);
  cycleImage();
});


// .hide(); and .show();
// tripDetails(); in document reade - then show once you call itdsflkj
