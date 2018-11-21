const base_URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
  const statusDiv = $('#status-message')
  statusDiv.empty();
  statusDiv.html(message);
};


const loadTrips = () => {

  const tripList = $('#trip');
  tripList.empty();
  tripList.removeClass();
  tripList.addClass('list')


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

  const toggleList = () => {

    $('.toggle').on('change', (event) => {

      if (event.target.checked){
        loadTrips();
      }
      else {
        const tripDiv =  $('#trip')
        if (tripDiv.hasClass('list')) {
          tripDiv.empty();
          reportStatus('Trips emptied.');

        }
        else if (tripDiv.hasClass('detail'))  {
          // are you sure you want to do that
          //if yes then empty div
          reportStatus("Can't do that with the trip on the page.");
        }
        else {
          reportStatus('Use toggle button to load your next adventure!');
        }
      }
    })

  };


  $(document).ready(() => {

    reportStatus("Choose your own adventure. Toggle me!");
    toggleList();
  });
