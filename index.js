const URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  // Prep work
  const tripList = $('#trip-list');
  // if this .empty is not here, it will keep appending more and more trips to the list.
  tripList.empty();

  // Actually load the trips
  axios.get(URL)
  .then((response) => {
    console.log(response);
    reportStatus(`Successfully loaded ${response.data.length} trips`)
    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
    });
  })

  // if there is a problem, call this function instead
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};


$(document).ready(() => {
  $('#load').click(loadTrips);
  // loadPets();
  // $('#pet-form').submit(createPet);
});
