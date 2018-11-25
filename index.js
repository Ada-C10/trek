const URL = 'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const sendGetRequest = (id) => {
  const buildGetRequest = () => {
    reportStatus('Loading...');
    axios.get(URL + id)
      .then((response) => {
        reportStatus('Successfully loaded!')
        let element = id === '/' ? $('#trip-list') : $('#trip-detail-list')
        handleGetResponse(element, response);
      })
      .catch((error) => {
        reportStatus(`Encountered an error ${error.message}`);
      });
  };
  return buildGetRequest;
};

const handleGetResponse = (element, response) => {
  element.empty();
  const tripData = response.data;

  if (tripData.length) {
    tripData.forEach((trip) => {
      element.append(
        `<li><button id="${trip.id}">
        ${trip.name}</button></li>`);
    });
  } else {
    const headers = ['name', 'continent', 'category', 'weeks', 'cost', 'about']
    headers.forEach((header) => {
      element.append(
        `<li>${header}: ${tripData[header]}</li>`
      )
    });
  }
};

$(document).ready(() => {
  const getAllTrips = sendGetRequest('/');
  $('#load-all-trips').click(getAllTrips);

  $('ul').on('click', 'button', function(event) {
    let id = '/' + $(this).attr('id');
    const getTripDetails = sendGetRequest(id);
    getTripDetails();
  });
});
