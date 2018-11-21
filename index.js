const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const generateForm = (section) => {
  section.empty();
  section.append('<h1> Reserve a Trip </h1>');

  section.append('<form id="trip-form">');

  const form = $('#trip-form');

  form.append('<div><label for="name">Name</label><input type="text" name="name"/></div>');
  form.append('<div><label for="age">Age</label><input type="number" name="age"/></div>');
  form.append('<div><label for="email">Email</label><input type="text" name="email"/></div>');
  form.append('<input type="submit" name="add-trip" value="Reserve" />');

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
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips`);

    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);

      const buildShowTrip = (trip) => {

        return () => {
          reportStatus(`Loading trip ${trip.name}...`);
          axios.get(URL + `/${trip.id}`)
          .then((response) => {
            reportStatus(`Successfully loaded ${trip.name}`);

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


            const form = $('#reserve-trip');
            generateForm(form);


          })
          .catch((error) => {
            reportStatus(error);
          });
        }
      };

      const buildCreateReservation = (trip) => {
        return () => {


          const data = {
            'name': $('input[name="name"]').val(),
            'age': $('input[name="age"]').val(),
            'email': $('input[name="email"]').val(),
          }

          axios.post(URL + `/${trip.id}/reservations`, data)
            .then((response) => {
              reportStatus(`Successfully added trip reservation with name: ${response.data.name}`);
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
        }

      };

      const showTrip = buildShowTrip(trip);
      const createReservation = buildCreateReservation(trip);
      $('li:last').click(showTrip);
      $('#trip-form').submit(createReservation);
    });

  })
  .catch((error) => {
    reportStatus(error);
  });
};




$(document).ready(() => {
  $('#load').click(loadTrips);

});
