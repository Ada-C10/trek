const URL = 'https://trektravel.herokuapp.com/trips';

// Status Reports
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

// Load Trips
const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);
      response.data.forEach((trip) => {
        // tripList.append(`<a href="${URL}/${trip.id}" id="trip-button"><li class ="trip-details">${trip.name}</li></a>`);
        tripList.append(`<li class ="trip-details"><a class="trip-button" id=${trip.id}>${trip.name}</a></li>`);

      });
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      }
    });
};

//Toggle trip detail
const loadDetails = () => {
  reportStatus('Sending trip data..');

  const DETURL = (`${URL}\\${this.id}`);
  const tripBlurb = $('#trip-blurb');
  axios.get(DETURL)
  .then((response) => {
    reportStatus(`Successfully loaded trip data`);
    // $('#trip-blurb').append(`<p>${response.data.find(x => x.id ==$(this.id)).about}</p>`);
      tripBlurb.append(`<p>${response.data.about}</p>`);

  });
};


///
$(document).ready(() => {
  $('#see-trips').click(loadTrips);
  $('#trip-list').click(loadDetails);
  // $('#pet-form').submit(createPet);

  $('#trip-list').on('click', 'li', function() {
    // $(this).toggle();
    alert(`Clicked on "${$(this).html()}"`);


  });

})
