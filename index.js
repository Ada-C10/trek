const URL = 'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const getRequestHandler = (id) => {
  const sendGetRequest = () => {
    reportStatus('Loading...')
    let url = URL + id;
    axios.get(url)
      .then((response) => {
        reportStatus('Successfully loaded!')
        handleGetResponse(response);
      })
      .catch((error) => {
        reportStatus(`Encountered an error ${error.message}`);
      });
  };
  return sendGetRequest;
};

const handleGetResponse = (response) => {
  if (response.data.length > 1) {
    let tripList = $('#trip-list');
    tripList.empty();
    response.data.forEach((trip) => {
      tripList.append(`<li><button id="${trip.id}">${trip.name}</button></li>`);
    });
  } else {
    let tripList = $('#trip-detail-list');
    tripList.empty();
    let trip = response.data;
    tripList.append(
      `<li>Name: ${trip.name}</li>
      <li>Continent: ${trip.continent}</li>
      <li>Category: ${trip.category}</li>
      <li>Weeks: ${trip.weeks}</li>
      <li>Cost: ${trip.cost}</li>
      <li>About: ${trip.about}</li>`
    );
  }
};

$(document).ready(() => {
  const getAllTrips = getRequestHandler('/');
  $('#load-all-trips').click(getAllTrips);

  $('ul').on('click', 'button', function(event) {
    let id = '/' + $(this).attr('id');
    const getTripDetails = getRequestHandler(id);
    getTripDetails();
  });
});
