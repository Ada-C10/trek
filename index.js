const URL = 'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const getRequestHandler = (id) => {
  const sendGetRequest = () => {
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
  return sendGetRequest;
};

const handleGetResponse = (element, response) => {
  const headers = ['name', 'continent', 'category', 'weeks', 'cost', 'about']
  element.empty();
  const tripData = response.data;

  if (tripData.length) {
    tripData.forEach((trip) => {
      element.append(
        `<li><button id="${trip.id}">
        ${trip.name}</button></li>`);
    });
  } else {
    headers.forEach((header) => {
      header.toString();
      element.append(
        `<li>${header}: ${response.data.name}</li>`
      )
    });
    // element.append(
    //   `<li>Name: ${trip.name}</li>
    //   <li>Continent: ${trip.continent}</li>
    //   <li>Category: ${trip.category}</li>
    //   <li>Weeks: ${trip.weeks}</li>
    //   <li>Cost: ${trip.cost}</li>
    //   <li>About: ${trip.about}</li>`
    // );
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
