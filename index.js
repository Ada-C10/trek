const URL = 'https://trektravel.herokuapp.com/trips';


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



const loadTrips = () => {
  reportStatus('Loading trips...');
  const tripList = $('#trip-list');

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);
    console.log('loadTrips function');
    response.data.forEach((trip) => {
      let tripId = trip.id;
      let tripUrl = `https://trektravel.herokuapp.com/trips/${tripId}`;
      tripList.append(`<li class = "test"><a href = ${tripUrl}>${trip.name}</a></li><li>${trip.id}</li><li>${tripUrl}</li><li><button class = "button" id = ${trip.id}>Get Trip Info!</button></li>`);
    });

  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
    console.log(error);
  });

};

const showTrip = (id) => {
  const tripInfo = $('#tripTable');
  tripInfo.empty();

  const URL2 = `https://trektravel.herokuapp.com/trips/${id}`;

  axios.get(URL2)
  .then((response) => {

    Object.keys(response.data).forEach((key) => {
      tripInfo.append(`<tr><th>${key}</th><td>${response.data[key]}</td>`);
    });

  })
};


$(document).ready(() => {
  $('#trips').click(loadTrips);

  $('#trip-list').on('click', '.button', function() {
    let newId = $(this).attr('id');
    showTrip(newId);
  });

});
