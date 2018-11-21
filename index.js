const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
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

const loadTrips = () => {
  reportStatus('loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);

      const buildShowTrip = (trip) => {
        return () => {
          axios.get(URL + `/${trip.id}`)
            .then((response) => {

              const details = $('#trip-details');
              details.empty();
              details.append('<h1> Trip Details <h1>');
              details.append(`<h2> Name: ${response.data.name}</h2>`);
              details.append(`<h4> Continent: ${response.data.continent}</h4>`);
              details.append(`<h4> Category: ${response.data.category}</h4>`);
              details.append(`<h4> Weeks: ${response.data.weeks}</h4>`);
              details.append(`<h4> Cost: $${response.data.cost}</h4>`);
              details.append(`<h4> About: </h4>`);
              details.append(`<p> ${response.data.about} </p>`);


            })
            .catch((error) => {
              reportStatus(error);
          });
        }
      };

      const showTrip = buildShowTrip(trip);
      $('li:last').click(showTrip);

    });



  })
  .catch((error) => {
    reportStatus(error);
  });
};




const createTrip = (e) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  e.preventDefault();

  reportStatus('Sending trip data...');

  const data = {
    name: $('input[name="name"]').val(),
    age: $('input[name="age"]').val(),
    email: $('input[name="email"]').val(),
  };

  axios.post(URL, data)
  .then((response) => {
    reportStatus(`Successfully added a trip with ID ${response.data.id}`);
  })
  .catch((error) => {
    if (error.response.data && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });

};

$(document).ready(() => {
  $('#load').click(loadTrips);

});
