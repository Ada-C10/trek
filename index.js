const INDEX_URL = "https://trektravel.herokuapp.com/trips";

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

const clearForm = () => {
  $("#form")[0].reset();
}

const createForm = (event) => {
  const form = $('<form></form>');
  form.attr("id", "trip-form");

  const options = ["name", "email", "trip-name"];
  for (let option of options){
    const div = $('<div></div>');
    div.append(`<label for="${option}">${option}</label>`);
    if(option === "trip-name"){
      div.append(`<input type="text" name="${option}" class="${option}" value="${$(event.target).text()}"/>`);
    } else {
      div.append(`<input type="text" name="${option}" class="${option}"/>`);
    }
    form.append(div);
  }

  form.append(`<input type="submit" name="add-trip" value="Add Trip" />`);

  return form;
}

// const reportStatus = (message) => {
//   $('#status-message').html(message);
// };

const loadTrips = () => {
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
  tripDetails.append('<h4>Details</h4>');

  axios.get(url)
    .then((response) => {
      tripDetails.append(parsedTripDetails(response));
      // reportStatus(`Successfully loaded ${sevenWonders.length} wonders`);
    })
    .catch((error) => {
      console.log(error);
    });

  const form = $('#form');
  form.empty();
  form.append('<h4>Reserve Today!</h4>');
  form.append(createForm(event));
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trips').on('click', loadTripDetails);
});
