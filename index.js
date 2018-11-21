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
    response.data.forEach((trip) => {
      let tripId = trip.id;
      let tripUrl = `https://trektravel.herokuapp.com/trips/${tripId}`;
      tripList.append(`<li><a href = ${tripUrl}>${trip.name}</a></li><li>${trip.id}</li><li>${tripUrl}</li>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error: ${error.message}`);
    console.log(error);
  });
};

// const singleTrip = () => {
//   let id = 1;
//   let URL2 = `${URL}/${id}`;
//   const tripInfo = $('#trip-info');
//
//   axios.get(URL2)
//   .then((response) => {
//     reportStatus(`trip data successfully loaded`);
//     response.data
//
//   })
//
//
// };


$(document).ready(() => {
  $('#trips').click(loadTrips);
});
