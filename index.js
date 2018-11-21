const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const URL = `https://trektravel.herokuapp.com/trips`;
  const tripList = $('#trip-list');
  tripList.empty();
  axios.get(URL)
  .then((response) => {
    response.data.forEach((trip) => {
      tripList.append(`<li><a href="#" id="${trip.id}">${trip.name}</a></li>`);
    });
    reportStatus(`Successfully loaded all trips`);
  });
};
const showTrip = (id) => {
  const URL = `https://trektravel.herokuapp.com/trips/`;
  const tripShowList = $('#trip-details');
  tripShowList.empty();
  axios.get(URL + id)
  .then((response) => {
    for (let tripData in response.data) {
      tripShowList.append(`<li><strong>${tripData}</strong>: ${response.data[tripData]}</li>`);
    }
    reportStatus(`Successfully loaded all trips`);
  });
};

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click', 'a', function() {
    showTrip(this.id);
  });
});
