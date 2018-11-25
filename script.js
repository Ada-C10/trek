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
        reportStatus(`Trip ${selectedTripID}`)
        // let tripData = respose.data

        $(tripDetails).append(`
          <p>TRIP ID: ${response.data.id}</p>
          <p>NAME: ${response.data.name}</p>
          <p>CONTINENT: ${response.data.continent}</p>
          <p>CATEGORY: ${response.data.category}</p>
          <p>WEEKS: ${response.data.weeks}</p>
          <p>COST: ${response.data.cost}</p>
          <p>ABOUT: ${response.data.about}</p>
          `);

      reservationForm(selectedTripID)
        });

      });

    });

    // POST RESERVATION FORM //

    let reservationForm = function reserveTrip(id) {
      let reserveTrip = $('.reserve-trip')
      reserveTrip.empty()

      $(reserveTrip).append(`
        <h3>Reserve Trip</h3>
        <p>Your Name: </p>
        <p>Your Email: </p>
        <p>Trip Name: </p>
      `)
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
