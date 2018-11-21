// Error Handling
// Optional Sorting All Trips
// Search Queries
// Create Trip
const INDEX_URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const clearForm = () => {
  $("#form")[0].reset();
};

const parsedTripDetails = (response) => {
  const div = $('<div></div>');
  div.append(`Trip ID: ${response.data.id}<br />`);
  div.append(`Trip Name: ${response.data.name}<br />`);
  div.append(`Continent: ${response.data.continent}<br />`);
  div.append(`Category: ${response.data.category}<br />`);
  div.append(`Weeks: ${response.data.weeks}<br />`);
  div.append(`Cost: ${response.data.cost}<br />`);
  div.append(`Description: ${response.data.about}`);
  return div;
}

const readFormData = () => {
  const parsedFormData = {};

  let formData = $("#trip-form").serializeArray();

  for(let field of formData){
    parsedFormData[field.name] = field.value
  }

  return parsedFormData;
};

const createReservation = (event) => {
  event.preventDefault();
  const id = $(event.target)[0]["elements"][2]["dataset"]["id"];
  const tripData = readFormData();
  const url = `https://trektravel.herokuapp.com/trips/${id}/reservations`;

  axios.post(url, tripData)
    .then((response) => {
      reportStatus(`Successfully added a trip with ID ${response.data.id}!`);
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
  // $('#query').addClass("hidden");
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
      // reportStatus(`Successfully loaded ${sevenWonders.length} wonders`);
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadTripDetails = (event) => {
  event.preventDefault();
  const url = $(event.target)[0].href;
  // const id = $(event.target).data("id");

  const tripDetails = $('#trip');
  tripDetails.empty();

  axios.get(url)
    .then((response) => {
      tripDetails.append('<h4>Details</h4>');
      tripDetails.append(parsedTripDetails(response));
      const form = $('#form');
      form.empty();
      form.append('<h4>Reserve Today!</h4>');
      form.append(createForm(event));
      // reportStatus(`Successfully loaded ${sevenWonders.length} wonders`);
    })
    .catch((error) => {
      console.log(error);
    });
}

$(document).ready(() => {
  $('#load').on('click', loadTrips);
  $('#trips').on('click', loadTripDetails);
  $('#form').on('submit', createReservation);
  $('#search').on('click', (event) => {
    event.preventDefault();
    $('#query').removeClass("hidden");
  })
});
