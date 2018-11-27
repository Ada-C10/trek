// --- RE-USABLE ---//
const baseURL = 'https://trektravel.herokuapp.com/trips/';
let id = 0;
const post = '/reservations';

const reportStatus = (message) => {
  $('.status-message').html(message);
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

// --- VIEW ALL TRIPS --- //
const loadTrips = () => {

  reportStatus('Loading trips...');

  const tripList = $('.trip-list');
  tripList.empty();

  axios.get(baseURL)
  .then((response) => {

    reportStatus(``);
    $(tripList).html(`<h3>All Trips</h3>`);
    response.data.forEach((trip) => {
      id = trip.id;
      $(tripList).append(`<button class="trip${id} btn btn-info">${trip.name}</button>`);
    });
    // wah this throws a token whatever something error:
    // .catch((error) => {
    //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
    // });

    // --- VIEW DETAILS FOR SELECTED TRIP --- //
    let loadTripDetails = function loadTripDetails() {
      reportStatus('Loading trip...');

      const regex = /p(.+)/;
      let selectedTripID = `${$(this).attr('class').split(" ")[0].match(regex)[1]}`;

      const tripDetails = $('.trip-details');
      tripDetails.empty();

      tripDetails.css('visibility', 'visible');

      axios.get(baseURL+selectedTripID)
      .then((response) => {

        reportStatus(``);
        let tripData = response.data;
        const regexMoney = /\d(?=(\d{3})+\.)/g;

        $(tripDetails).html(`
          <h3>Trip Details</h3>
          <p><span class="strong">TRIP ID</span>: ${tripData.id}</p>
          <p><span class="strong">NAME</span>: ${tripData.name}</p>
          <p><span class="strong">CONTINENT</span>: ${tripData.continent}</p>
          <p><span class="strong">CATEGORY</span>: ${tripData.category}</p>
          <p><span class="strong">WEEKS</span>: ${tripData.weeks}</p>
          <p><span class="strong">COST</span>: $${(tripData.cost).toFixed(2).replace(regexMoney, '$&,')}</p>
          <p><span class="strong">ABOUT</span>: ${tripData.about}</p>
          `);

          // pass selected trip data to form
          reservationForm(tripData);
        });
        // wah this throws a token whatever something error:
        // .catch((error) => {
        //       reportStatus(`Encountered an error while loading trip: ${error.message}`);
        //     });
      };

      // did you happen to click on a trip? have i got a trip for you!
      $(`.trip-list *`).click(loadTripDetails);
    });
  };

  //  --- VIEW RESERVATION FORM -- //
  let reservationForm = function reservationForm(tripData) {
    // this code prevents us from creating a new object with each new click
    // we only want one; not 8984030 million objects
    $('form').off();

    let reserveTrip = $('.reserve-trip');
    reserveTrip.css('visibility', 'visible');
    id = tripData.id;

    let reservation = {
      name: $('input[name="name"]').attr('placeholder', `Name`),
      email: $('input[name="email"]').attr('placeholder', `Email`),
      tripName: $('input[name="tripName"]').attr('placeholder', `${tripData.name}`)
    };

    //  --- POST RESERVATION FORM --- //
    let postIt = () => {
      reportStatus(`Attempting to reserve trip: ${tripData.name}...`);
      event.preventDefault();

      for (let r in reservation) {
        if (reservation[r]) {
          reservation[r] = reservation[r].val();
        }
      }

      axios.post(baseURL+id+post, reservation)
      .then((response) => {
        reportStatus(`Successfully reserved your trip! Confirmation #${response.data.id}.`);

        // make it nice if our post was met with success
        $('.reserve-trip').css('visibility', 'hidden');
        $('form').trigger("reset");
        $('html, body').animate({scrollTop:0},0);
      })

      .catch((error) => {
        if (error.response.data && error.response.data.errors) {
          reportError(
            `Encountered an error: ${error.message}`,
            error.response.data.errors
          );
        } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
        // ono something went wrong? LET'S TRY THAT FORM AGAIN.
        reservationForm(tripData);
        $('html, body').animate({scrollTop:0},0);
      });
    }
    $(`form`).submit(postIt);
  };


  // --- SET IT OFF --- //
  $(document).ready(() => {
    $('.trip-button').click(loadTrips);
  });

  // TODO
  // - scroll down or click to show/load more (don't load all trips at once)
  // - more DRY/refactor
  // - why isn't catch working for the get requests? b/c the functions are nested???
  // - move files into appropriate folders
