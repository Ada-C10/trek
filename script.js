// --- RE-USABLE ---//
const baseURL = 'https://trektravel.herokuapp.com/trips/';
let id = 0;
let post = '1/reservations';

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

  reportStatus('Loading trips...')

  // wrap up into one function?
  const tripList = $('.trip-list');
  tripList.empty();
  //

  axios.get(baseURL)
  .then((response) => {

    reportStatus(`All ${response.data.length} trips.`)
    $(tripList).html(`<h3>All Trips</h3>`);
    response.data.forEach((trip) => {
      id = trip.id;
      $(tripList).append(`<button class="trip${id} btn btn-info">${trip.name}</button>`);
      // console.log(`trip${id}`)

    });


    // --- VIEW DETAILS FOR SELECTED TRIP --- //
    let loadTripDetails = function loadTripDetails() {
      let regex = /p(.+)/
      let selectedTripID = `${$(this).attr('class').split(" ")[0].match(regex)[1]}`

      let tripDetails = $('.trip-details')
      tripDetails.empty()

      axios.get(baseURL+selectedTripID)
      .then((response) => {
        let tripData = response.data
        // reportStatus(`Trip ${tripData.id}`)
        regexMoney = /\d(?=(\d{3})+\.)/g

        $(tripDetails).html(`
          <h3>Trip Details</h3>
          <p>TRIP ID: ${tripData.id}</p>
          <p>NAME: ${tripData.name}</p>
          <p>CONTINENT: ${tripData.continent}</p>
          <p>CATEGORY: ${tripData.category}</p>
          <p>WEEKS: ${tripData.weeks}</p>
          <p>COST: $${(tripData.cost).toFixed(2).replace(regexMoney, '$&,')}</p>
          <p>ABOUT: ${tripData.about}</p>
          `);




          reservationForm(tripData)

        });
        // .catch((error) => {
        //       reportStatus(`Encountered an error while loading trips: ${error.message}`);
        //     });

      };
$(`.trip-list *`).click(loadTripDetails)

    });


  };

  // POST RESERVATION FORM //

  let reservationForm = function reservationForm(tripData) {
    $('form').off()


    let reserveTrip = $('.reserve-trip')
    // (reserveTrip).empty()
    $('form.trip-form').css('visibility', 'visible');
            // $('form h3').empty();
        // $(`.reserve-trip h3`).empty();




     let reservation = {
      name: $('input[name="name"]').attr('placeholder', `Your Name`),
      email: $('input[name="email"]').attr('placeholder', `Your Email`),
      tripName: $('input[name="tripName"]').attr('placeholder', `${tripData.name}`)
    }





    let postIt = () => {
      event.preventDefault();
      $('form.trip-form').css('visibility', 'hidden');

      for (r in reservation) {
        reservation[r] = reservation[r].val()
      };


    axios.post(baseURL+post, reservation)
    .then((response) => {

      reportStatus(`Thanks, ${response.data.id}! Successfully reserved your trip.`);
    })
    // .catch((error) => {
    //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
    // });


    .catch((error) => {
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

$(`form`).submit(postIt);
  };



  $(document).ready(() => {
    $('.trip-button').click(loadTrips);
  });

  // LEFT OFF...FOR DEMAIN:
  // ASAP - POST ETC - MAKE IT FUNCTIONAL FOR WAVE 3

  // TODO - urgent:
  // = get error message .catch working
  // successful status message != header or ok?
  // add full styling in general

  // TODO - should finish:
  // add border styling
  // bg image
  // main button - increase size, create custom class for button
  // section headings
  // determine button colors (create custom class for buttons)
  // fix placement of the functions
  //trip name --> placeholder ok or real value?


  // TODO - nice to haves:
  // scroll down to show more / pagination?
  // format key names like NAME or CONTINENT
  // refactor
