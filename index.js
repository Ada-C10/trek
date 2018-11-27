const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTripTable = () => {
  const tripConsole = $('#trip-console');
  tripConsole.empty();
  reportStatus('<strong>Loading trips...</strong>');
  tripConsole.append('<table id="trip-table"></table>')
  const tripTable = $('#trip-table');
  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      tripTable.append('<tr><th><h1>All Trips</h1></th></tr>');
      response.data.forEach((trip) => {
        tripTable.append(`<tr><td>${trip.name}</td></tr>`);
      });
      $("table, th, td").addClass("table-border");
    })
    .catch((error) => {
     reportStatus(`Encountered an error while loading trips: ${error.message}`);
     console.log(error);
  });

};

$(document).ready(() => {
  $('#load-trips').click(loadTripTable);
});
