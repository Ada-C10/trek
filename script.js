// move to its own folder?
const baseURL = 'https://trektravel.herokuapp.com/trips/';
let id = 0;


const reportStatus = (message) => {
  $('.status-message').html(message);
}

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
    $(tripList).append(`<h3>All Trips</h3>`);
    response.data.forEach((trip) => {
      id = trip.id;
      $(tripList).append(`<button class="trip${id} btn btn-info">${trip.name}</button>`);
      // console.log(`trip${id}`)

    });

    // .catch((error) => {
    //   reportStatus(`Encountered an error while loading trips: ${error.message}`);
    // });


    // --- VIEW DETAILS FOR SELECTED TRIP --- //
    $(`.trip-list *`).click( function(event) {
      let regex = /p(.+)/
      let selectedTripID = `${$(this).attr('class').split(" ")[0].match(regex)[1]}`

      let tripDetails = $('.trip-details')
      tripDetails.empty()

      axios.get(baseURL+selectedTripID)
      .then((response) => {
        let tripData = response.data
        // reportStatus(`Trip ${tripData.id}`)

        $(tripDetails).append(`
          <h3>Trip Details</h3>
          <p>TRIP ID: ${tripData.id}</p>
          <p>NAME: ${tripData.name}</p>
          <p>CONTINENT: ${tripData.continent}</p>
          <p>CATEGORY: ${tripData.category}</p>
          <p>WEEKS: ${tripData.weeks}</p>
          <p>COST: ${tripData.cost}</p>
          <p>ABOUT: ${tripData.about}</p>
          `);

      reservationForm(tripData)
        });

      });

    });

    // POST RESERVATION FORM //

    let reservationForm = function reserveTrip(tripData) {
      let reserveTrip = $('.reserve-trip')
      // reserveTrip.empty()

          $('.reserve-trip h3').empty()
      $('.reserve-trip').prepend('<h3>Reserve Trip</h3>');


      $('form.trip-form').css('visibility', 'visible');

const dataa = {
      name: $('input[name="name"]').attr('placeholder', `Your Name`).val(),
      email: $('input[name="email"]').attr('placeholder', `Your Email`).val(),
      tripName: $('input[name="trip-name"]').attr('placeholder', `${tripData.name}`).val()

};
    }

  };



  $(document).ready(() => {
    $('.trip-button').click(loadTrips);
  });

  // TODO:
  // determine button colors (create custom class for buttons)
  // scroll down to show more / pagination?
  // main button - increase size, create custom class for button
  // = get error message .catch working
  // bootstrap grid for the three sections
  // bg image
  // successful status message != header or ok?
  // format cost
  // format key names like NAME or CONTINENT
  // section headings
  // fix placement of the functions
  // add border styling
