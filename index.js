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
        tripList.append(`<a href="${URL}/${trip.id}" id="trip-button"><li class ="trip-details">${trip.name}</li></a>`);
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

// Toggle details of individual trip
const loadDetails = (event) => {
  reportStatus('Sending trip data..');

  // axios.get(URL)
  // const tripDetail = () => {
  //   response.data.find(x => x.id =='3');
  // }

  // $('#trip-list')
  axios.get(URL)
    .then((response) => {
      reportStatus('Successfully loaded trip detail');
      response.data.forEach((trip) => {
        tripList.append(`<a><li class ="trip-details">${trip.name}</li></a>`);
        // tripList.append(`<a><li class ="trip-details">${trip.name}</li></a>
        // <p class="trip-toggle">${trip.category}</p>`);
        // $('.trip-toggle').toggle();
      });
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(`Encountered an error: ${error.message}`, error.response.data.errors
        );
      } else {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      }
    });
};


///
$(document).ready(() => {
  $('#see-trips').click(loadTrips);
  // $('.trip-details').click(loadDetails);
  // $('#pet-form').submit(createPet);

  $('#trip-list').on('click', 'li', function(event) {
    alert(`Clicked on <li> "${$(this).html()}"`);
    // $('li').toggle(this.html);
  });

})



// $('li').append(`<p class="trip-about">${trip.category}</p>`)
// $('p').toggle();
