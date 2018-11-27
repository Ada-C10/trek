const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty(); //starts as empty till button is clicked

reportStatus('Loading trips...'); //place before axios call, shows before error and success msg

  axios.get(URL)
  .then((response) => {
    reportStatus(`It loaded ${response.data.length} fricking trips!`);
    response.data.forEach((trip) => {
      const tag = $(`<li>${trip.name}</li>`);
      tripList.append(tag);
      tag.click(() => {
        tripDetails(trip);
      })

    });
  })
  .catch((error) => { //all .catch(callback) to do something when the response fails
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const tripDetails = (trip) => {
  const tripDetailsList = $('#trip-details');
  tripDetailsList.empty();


  axios.get(URL + '/' + trip.id)
    .then((response) => {
      const tripData = response.data;
      console.log(trip);
      tripDetailsList.append(`<li>Name: ${tripData.name}</li>`);
      tripDetailsList.append(`<li>Category: ${tripData.category}</li>`);
      tripDetailsList.append(`<li>Continent: ${tripData.continent}</li>`);
      tripDetailsList.append(`<li>Cost: ${tripData.cost}</li>`);
      tripDetailsList.append(`<li>Weeks: ${tripData.weeks}</li>`);
      tripDetailsList.append(`<li>About: ${tripData.about}</li>`);
    })
  }
$(document).ready(() => {
  $('#load').click(loadTrips);
});
