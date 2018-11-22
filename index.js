// For more practice working with data, filter trips by search queries (like by continent, budget, etc.). You'll need to explore the API to see what functionality exists.
// To practice a more advanced POST, allow the user to create a new trip.
// For more jQuery practice, use jQuery to sort list of trips by specific attributes, like budget or time remaining

const INDEX_URL = "https://trektravel.herokuapp.com/trips";

const hideDetails = () => {
  $('#alert-container').hide();
  $('#search-container').hide();
  $('#trips').hide();
  $('#trip-details-container').hide();
};

const reportStatus = (message, status) => {
  $('#alert').removeClass();
  $('#alert').addClass(`alert alert-${status}`);
  $('#status-message').html(message);
  $('#alert-container').show();
};

const clearForm = () => {
  $("#form")[0].reset();
};

const readFormData = () => {
  return $("#trip-form").serialize();
}

const parsedTripDetails = (response) => {
  const div = $(`<div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <p><strong>Trip ID</strong>: ${response.data.id}</p>
                      <p><strong>Trip Name</strong>: ${response.data.name}</p>
                      <p><strong>Continent</strong>: ${response.data.continent}</p>
                      <p><strong>Category</strong>: ${response.data.category}</p>
                      <p><strong>Weeks</strong>: ${response.data.weeks}</p>
                      <p><strong>Cost</strong>: ${response.data.cost}</p>
                      <p><strong>Description</strong>: ${response.data.about}</p>
                    </div>
                  <div>
                </div>`);
  return div;
}


const createReservation = (event) => {
  event.preventDefault();
  const id = $(event.target)[0]["elements"][2]["dataset"]["id"];
  const tripData = readFormData();
  const url = `https://trektravel.herokuapp.com/trips/${id}/reservations`;

  axios.post(url, tripData)
    .then((response) => {
      reportStatus(`Successfully added a trip with ID ${response.data.id}!`, 'success');
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

const createForm = (event) => {
  const form = $('<form></form>');
  form.attr("id", "trip-form");

  const options = ["name", "email", "trip-name"];
  for (let option of options){
    const div = $('<div></div>');
    div.append(`<label for="${option}">${option}</label>`);
    if(option === "trip-name"){
      div.append(`<input type="text" name="${option}" class="${option}" value="${$(event.target).text()}" data-id="${$(event.target).data("id")}"/>`);
    } else {
      div.append(`<input type="text" name="${option}" class="${option}"/>`);
    }
    form.append(div);
  }

  form.append(`<input type="submit" name="add-trip" value="Add Trip" />`);

  return form;
};

const loadTrips = () => {
  hideDetails();
  $('#trips').show();
  const tripList = $('#trips');
  tripList.empty();
  tripList.append('<h4>All Trips</h4>');

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
      tripDetails.append('<h4 class="card-title">Details</h4>');
      tripDetails.append(parsedTripDetails(response));
      const form = $('#form');
      form.empty();
      form.append('<h4>Reserve Today!</h4>');
      form.append(createForm(event));
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
  $('#form').on('submit', createReservation);
  $('#search').on('click', (event) => {
    event.preventDefault();
    $('#search-container').show();
  })
});
