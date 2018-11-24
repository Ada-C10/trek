// To practice a more advanced POST, allow the user to create a new trip. Create form in html
// Work on Search!
// Think about asynchronous stuff
// DRY up the code, limit CSS

const INDEX_URL = "https://trektravel.herokuapp.com/trips";

const hideDetails = () => {
  $('#alert-container').hide();
  $('#search-container').hide();
  $('#trip-details-container').hide();
  $('#trips-container').hide();
};

const reportStatus = (message, status) => {
  $('#alert').removeClass();
  $('#alert').addClass(`alert alert-${status}`);
  $('#status-message').html(message);
  $('#alert-container').show();
};

const clearForm = () => {
  $("#trip-form")[0].reset();
};

const readFormData = () => {
  const parsedFormData = {};
  let formData = $("#trip-form").serializeArray();

  for(let field of formData){
    parsedFormData[field.name] = field.value
  }

  return parsedFormData;
}

const parsedTripDetails = (response) => {
  const div = $(`<p><strong>Trip ID</strong>: ${response.data.id}</p>
                <p><strong>Trip Name</strong>: ${response.data.name}</p>
                <p><strong>Continent</strong>: ${response.data.continent}</p>
                <p><strong>Category</strong>: ${response.data.category}</p>
                <p><strong>Weeks</strong>: ${response.data.weeks}</p>
                <p><strong>Cost</strong>: ${response.data.cost}</p>
                <p><strong>Description</strong>: ${response.data.about}</p>`);
  return div;
}

const fillForm = (event) => {
  $(`#trip-form input[name="trip-name"]`).attr("value", `${$(event.target).text()}`);
  $(`#trip-form input[name="id"]`).attr("value", `${$(event.target).data("id")}`)
};


const createReservation = (event) => {
  event.preventDefault();
  let tripData = readFormData();
  const id = tripData["id"];
  const location = tripData["trip-name"];
  tripData = {
    "name": tripData["name"],
    "email": tripData["email"]
  }
  const url = `https://trektravel.herokuapp.com/trips/${id}/reservations`;

  axios.post(url, tripData)
    .then(() => {
      reportStatus(`${tripData["name"]}, you successfully reserved the trip: ${location}!`, 'success');
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      // if (error.response.data && error.response.data.errors) {
      //   // User our new helper method
      //   reportError(
      //     `Encountered an error: ${error.message}`,
      //     error.response.data.errors
      //   );
      // } else {
      //   // This is what we had before
      //   reportStatus(`Encountered an error: ${error.message}`);
      // }
    })
};

const loadTrips = () => {
  hideDetails();
  $('#trips-container').show();

  const tripList = $('#trips');
  tripList.empty();

  const ul = $('<ul></ul>');

  axios.get(INDEX_URL)
    .then((response) => {
      response.data.forEach((trip) => {
        const li = $('<li></li>');
        const a = $(`<a>${trip.name}</a>`);
        a.attr('href', `https://trektravel.herokuapp.com/trips/${trip.id}`);
        a.data('id', trip.id);
        li.append(a);
        ul.append(li);
      });
      tripList.append(ul);
      reportStatus(`Successfully loaded ${response.data.length} trips.`, 'success');
    })
    .catch((error) => {
      reportStatus(`Could not load. ${error}.`, 'warning');
    });
};

const loadTripDetails = (event) => {
  event.preventDefault();
  const url = $(event.target)[0].href;
  $('#trip-details-container').show();

  const tripDetails = $('#trip');
  tripDetails.empty();

  axios.get(url)
    .then((response) => {
      tripDetails.append(parsedTripDetails(response));
      fillForm(event);
      reportStatus(`Successfully loaded ${response.data.name}.`, 'success');
    })
    .catch((error) => {
      reportStatus(`Could not load. Error: ${error}.`, 'warning');
    });
}

$(document).ready(() => {
  hideDetails();
  $('#load').on('click', loadTrips);
  $('#trips').on('click', 'a[href]', loadTripDetails);
  $('#trip-form').on('submit', createReservation);
  $('#search').on('click', (event) => {
    event.preventDefault();
    hideDetails();
    $('#search-container').show();
  })
});
