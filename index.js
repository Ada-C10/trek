const URL = 'https://trektravel.herokuapp.com/trips';
const URL2 = `https://trektravel.herokuapp.com/trips/1`;


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
    console.log('test');
    response.data.forEach((trip) => {
      let tripId = trip.id;
      let tripUrl = `https://trektravel.herokuapp.com/trips/${tripId}`;
      tripList.append(`<li class = "test"><a href = ${tripUrl}>${trip.name}</a></li><li>${trip.id}</li><li>${tripUrl}</li><li><button id = "trip">Get Trip Info!</button></li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
    console.log(error);
  });
};

const showTrip = () => {
  const tripInfo = $('#tripTable');
  tripInfo.empty();


  axios.get(URL2)
  .then((response) => {
    // console.log('test2');

    Object.keys(response.data).forEach((key) => {
      tripInfo.append(`<tr><th>${key}</th><td>${response.data[key]}</td>`);
      console.log(key, response.data[key]);
    });

  })
};


$(document).ready(() => {
  $('#trips').click(loadTrips);

  $('#trip-list').on('click', '#trip', showTrip);

});
