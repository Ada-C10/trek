const base_URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
  $('#status-message').html(message);
};


const loadTrips = () => {

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(base_URL)
  .then( (response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);
    console.log(response)
    response.data.forEach( (response) => {
      tripList.append(`<div><li>${response["name"]}</li>
      <li>${response["continent"]}</li>
      <li>${response["category"]}</li>
      <li>${response["weeks"]}</li>
      <li>${response["id"]}</li></div>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading pets: ${error.message}`);
  });
};


$(document).ready(() => {
  $('#load').click(loadTrips);
});
