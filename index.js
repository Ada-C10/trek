const baseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {

  $('.current-trips').show();
  reportStatus('Loading Trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(baseURL)
    .then((response) => {
      response.data.forEach((trip) => {
        const tripName = $(`<li><button>${trip.name}</button></li>`);
        tripName.data("id", trip.id);

        tripName.addClass("trip-link");
        tripList.append(tripName);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });
};

const tripDetails = (tripID) => {

  reportStatus('Getting Trip Details...');

  const tripInfo = $('#trip-info');

  tripInfo.empty();

  const tripURL = `${baseURL}/${tripID}`;

  axios.get(tripURL)
    .then((response) => {
      $('.trip-details').show();

      tripInfo.append(`<li>Name: ${response.data.name}</li>`);
      tripInfo.append(`<li>About: ${response.data.about}</li>`);
      tripInfo.append(`<li>Continent: ${response.data.continent}</li>`);
      tripInfo.append(`<li>Category: ${response.data.category}</li>`);
      tripInfo.append(`<li>Weeks: ${response.data.weeks}</li>`);
      tripInfo.append(`<li>Price: ${response.data.cost}</li>`);
      tripInfo.append(`<li>Trip ID: ${response.data.id}</li>`);

      $('#reservation-form input[name="id"]').val(response.data.id)
      $('#reservation-form input[name="trip"]').val(response.data.name)

      reportStatus(`Successfully Loaded Trip #${tripID}`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });

};

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#reservation-form input[name="name"]`).val();
  console.log(nameFromForm);
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const ageFromForm = $(`#reservation-form input[name="age"]`).val();
  parsedFormData['age'] = ageFromForm ? ageFromForm : undefined;

  const ownerFromForm = $(`#reservation-form input[name="email"]`).val();
  parsedFormData['email'] = ownerFromForm ? ownerFromForm : undefined;

  return parsedFormData;
};

const createReservation = (event) => {
  event.preventDefault();

  reportStatus("Requesting Reservation");

  const tripData = readFormData();
  const tripID = $(`#reservation-form input[name="id"]`).val();

  console.log(tripData);

  axios.post(baseURL + `/${tripID}/reservations`, tripData)
    .then((response) => {
      reportStatus('Successfully Reserved Trip!');

    })
    .catch((error) => {
      console.log(error.response.data.errors);
      reportStatus(`Encountered an error: \n email: ${error.response.data.errors.email} \n name: ${error.response.data.errors.name}`);
    })
};


$(document).ready(() => {
  $('.current-trips').hide();
  $('.trip-details').hide();

  $('#load').click(loadTrips);
  // $('#load').click($(this).text(), tripDetails);

  $('#trip-list').on('click', 'li', function(event) {
    const tripID = $(this).data("id");
    // console.log(tripID);
    tripDetails(tripID);
   });

  $('#reservation-form').submit(createReservation);
});
