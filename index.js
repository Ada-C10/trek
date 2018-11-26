
const BaseURL = 'https://trektravel.herokuapp.com/trips';

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
}


//Loading all trips
const loadTrips = () => {
  reportStatus("loading awesome trips...");


  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(BaseURL)
  .then((response) => {
    reportStatus(`Successfully loaded  ${response.data.length} adventurous trips`);

    title = $(`<h3><strong>List of trips</strong></h3>`);
    tripList.append(title);

    response.data.forEach((trip) => {
      const singleTrip = $(`<li class="${trip.id}" class="list-group-item"><strong>${trip.name}</strong></li>`)
      tripList.append(singleTrip);

      // call the load one trip function to pass in the trip id so that at a click it will show the trip detail and the form to reserve it
      singleTrip.on('click', () => {
        loadOneTrip(`${trip.id}`);
        generateForm(trip);
      });
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  });
};

// function to load one trip details
const loadOneTrip = (id) => {

    const oneTrip = $('#one-trip');
    oneTrip.empty();

    axios.get(BaseURL + '/'+ id)
    .then((response) => {

      reportStatus(`Successfully loaded details for  ${response.data.name} trip`);

      oneTrip.append(`<section class="info"><h3>Here is the details for <p>
        <strong> ${response.data.name}</strong></p></h3>
        <p><strong>ID:</strong> ${response.data.id}</p>
        <p><strong>Continent:</strong> ${response.data.continent}</p>
        <p><strong>About:</strong> ${response.data.about}</p>
        <p><strong>Category:</strong> ${response.data.category}</p>
        <p><strong>Duration:</strong> ${response.data.weeks} week(s)</p>
        <p><strong>Cost:</strong> $${response.data.cost}</p></section>`);
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading the trip: ${error.message}`);
  });
};

// function to display a form to get info to reserve trip
const generateForm = (trip) => {
  const form = $('#displayForm');
  form.empty();

  form.append(`
    <form id="trip-form">
    <h4>Reserve your spot for <strong>${trip.name} trip </strong> now by completing this form</h4>
    <div class="form-group">
    <label for="name">Your Name</label>
    <input type="text" class="form-control" name="name" placeholder="Full Name"/>
    </div>

    <div class="form-group">
    <label for="email">Email Address</label>
    <input type="text" class="form-control" name="email" placeholder="Email Address" />
    </div>

    <input type="submit" name="reserve" value="Reserve" type="button" class="btn btn-primary btn-lg"/>
    </form>`);

    const reserve = (event) => {
      event.preventDefault();
      reportStatus('Sending reservation data...');
      createReservation(trip.id);
    };
    $('#trip-form').submit(reserve);
  };

// function to clear the form ones reserve button is pressed
const clearForm = () => {
    $(`#trip-form input[name="name"]`).val('');
    $(`#trip-form input[name="email"]`).val('');
}

// function to parse the AJAX data
const readFormData = () => {
    const parsedFormData = {};

    const nameFromForm = $(`#trip-form input[name="name"]`).val();
    parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
    const emailFromForm = $(`#trip-form input[name="email"]`).val();
    parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

    return parsedFormData;
  };


// function to send a post request to reserve the trip
const createReservation = (id) => {

  const reserveData = readFormData();

  const resURL = BaseURL + "/" + id + "/reservations";

  axios.post(resURL, reserveData)
  .then((response) => {
    reportStatus('Successfully reserved your trip request. We will shortly send you a confirmation via email.');
    clearForm();
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


$(document).ready(()=> {
  $('#load-all').click(loadTrips);
});
