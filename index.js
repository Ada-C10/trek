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

      let continental = ""

      if (response["continent"] === "Europe") {
        continental = response["continent"] + "an";
      }
      else {
        continental = response["continent"] + "n";
      }

      tripList.append(`<div><strong><li>${continental} Adventure</li></strong>
        <li>${response["name"]}</li>
        <li>${response["weeks"]} Weeks</li>
        <li><button class=${response["id"]} btn btn-secondary>Trek here!</button></li></div>`);
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading pets: ${error.message}`);
    });
  };


  $(document).ready(() => {

    $('.toggle').on('change', (event) => {

      if (event.target.checked){
        loadTrips();
      }
      else {
        $('#trip-list').empty();
        $('#status-message').empty();
      }
    })

  });
