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
        console.log(tripName.data("id"));
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

      // console.log(tripID);
      // console.log(tripURL);
      // console.log(response.data.name);

      tripInfo.append(`<li>${response.data.id}</li>`);

      tripInfo.append(`<li>${response.data.name}</li>`);
      tripInfo.append(`<li>${response.data.continent}</li>`);
      tripInfo.append(`<li>${response.data.about}</li>`);
      tripInfo.append(`<li>${response.data.category}</li>`);
      tripInfo.append(`<li>${response.data.weeks}</li>`);
      tripInfo.append(`<li>${response.data.cost}</li>`);



      reportStatus(`Successfully Loaded Trip #${tripID}`);
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });

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


  //
  // $('.trip-link').click(function() {
  //   const tripID = $(this).data("id");
  //   console.log(tripID);
  //   tripDetails(tripID);
  // });

});
