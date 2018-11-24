const allTripURL = "https://trektravel.herokuapp.com/trips"

// hide all info divs to begin with
$(function() {
  $('.list-trips').hide();
  $('.trip-details').hide();
  $('.trip-reservation').hide();
});

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
    $('.list-trips').show();

    axios.get(allTripURL)
      .then((response) => {
        reportStatus(`Successfully loaded ${response.data.length} trips`);
        response.data.forEach((trip) => {
          tripList.append(`<p data-id="${trip.id}" class="trip">${trip.name}</p>`);
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
    reservationForm.empty();
    $('.trip-details').show();
    $('.trip-reservation').show();
   // trip id attached as class to look up individual trips?
    axios.get(`${allTripURL}/${id}`)
      .then((response) => {
        reportStatus(`Successfully loaded ${response.data.name}`);
        let details = $(`<h2 class="sub-title text-center border-bottom"><strong>${response.data.name}</strong></h2>
                        <p><strong>ID:</strong> ${response.data.id}</p>
                        <p><strong>Continent:</strong> ${response.data.continent}</p>
                        <p><strong>About:</strong> ${response.data.about}</p>
                        <p><strong>Category:</strong> ${response.data.category}</p>
                        <p><strong>Weeks:</strong> ${response.data.weeks}</p>
                        <p><strong>Cost:</strong> $${response.data.cost}</p>`)
        let reservation = $(`<h2 class="sub-title text-center border-bottom"><strong>Request this Trip</strong></h2>
                            <form id="trip-form" data-id="${response.data.id}">
                              <div>
                                <label for="name"><strong>Name</strong></label>
                                <input type="text" name="name" />
                              </div>

                              <div>
                                <label for="email"><strong>Email </strong></label>
                                <input type="text" name="email" />
                              </div>

                              <input type="submit" class="text-center btn btn-dark" name="add-reservation" value="Add Reservation" />
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
    $('list-trips').hide();
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

  setInterval(cycleImage, 8000);
  cycleImage();
});


// .hide(); and .show();
// tripDetails(); in document reade - then show once you call itdsflkj
