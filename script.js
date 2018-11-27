// --- RE-USABLE ---//
const baseURL = 'https://trektravel.herokuapp.com/trips/';
let id = 0;
const post = '1/reservations';

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

    reportStatus(``)
    $(tripList).html(`<h3>All Trips</h3>`);
    response.data.forEach((trip) => {
      id = trip.id;
      $(tripList).append(`<button class="trip${id} btn btn-info">${trip.name}</button>`);
      // console.log(`trip${id}`)

    });
    // .catch((error) => {
    //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
    // });


    // --- VIEW DETAILS FOR SELECTED TRIP --- //
    let loadTripDetails = function loadTripDetails() {
      reportStatus('Loading trip...');

      let regex = /p(.+)/
      let selectedTripID = `${$(this).attr('class').split(" ")[0].match(regex)[1]}`

      let tripDetails = $('.trip-details')
      tripDetails.empty()

      tripDetails.css('visibility', 'visible');

      axios.get(baseURL+selectedTripID)
      .then((response) => {

        reportStatus(``)
        let tripData = response.data
        // reportStatus(`Trip ${tripData.id}`)
        regexMoney = /\d(?=(\d{3})+\.)/g

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




          reservationForm(tripData)

        });
        // .catch((error) => {
        //       reportStatus(`Encountered an error while loading trips: ${error.message}`);
        //     });

      };
      $(`.trip-list *`).click(loadTripDetails)

    });
    // .catch((error) => {
    //       reportStatus(`Encountered an error while loading trips: ${error.message}`);
    //     });
  };

  // POST RESERVATION FORM //

  let reservationForm = function reservationForm(tripData) {
    $('form').off()


    let reserveTrip = $('.reserve-trip')
    // (reserveTrip).empty()
    reserveTrip.css('visibility', 'visible');
    // $('form h3').empty();
    // $(`.reserve-trip h3`).empty();

    let reservation = {
      name: $('input[name="name"]').attr('placeholder', `Your Name`),
      email: $('input[name="email"]').attr('placeholder', `Your Email`),
      tripName: $('input[name="tripName"]').attr('placeholder', `${tripData.name}`)
    }


    let postIt = () => {
      reportStatus(`Attempting to reserve trip: ${reservation.tripName}...`)
      event.preventDefault();


      for (r in reservation) {
        if (reservation[r]) {
        reservation[r] = reservation[r].val();
      }
    }


      axios.post(baseURL+post, reservation)
      .then((response) => {
        reportStatus(`Successfully reserved your trip! Confirmation #${response.data.id}`);

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
reservationForm(tripData)
      });
    }
      // $('form').trigger("reset");
      // $('html, body').animate({scrollTop:0},0);
          $(`form`).submit(postIt);
    };







  $(document).ready(() => {
    $('.trip-button').click(loadTrips);
  });

  // TODO
  // scroll down to show more / pagination?
  // DRY/refactor
