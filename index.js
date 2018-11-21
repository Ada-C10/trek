const URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  // Prep work
  const tripList = $('#trips');
  // if this .empty is not here, it will keep appending more and more trips to the list.
  tripList.empty();

  // Actually load the trips
  // const $tripList = $('#trip-list')

  axios.get(URL)
  .then((response) => {
    // console.log(response);
    reportStatus(`Successfully loaded ${response.data.length} trips`)
    response.data.slice(0, 10).forEach((trip) => {
      // const $tripItem = $(`<li id="trip-${trip.id}">${trip.name}</li>`);
      const $tripItem = $(`<li>${trip.name}</li>`);

      // console.log($tripItem);
      tripList.append($tripItem);

      $tripItem.click((event) => {
        // console.log(event.target.id);
        // const tripId = event.target.id.split('-')[1];
        // console.log(tripId);
        axios.get(URL + '/' + trip.id)
          .then((response) => {
            const trip = response.data;

            $('body').append(`
                <div class="trip-info">
                  <p>${trip.name}</p>
                  <p>${trip.continent}</p>
                  <p>${trip.about}</p>
                  <p>${trip.category}</p>
                  <p>${trip.weeks}</p>
                  <p>${trip.cost}</p>
                </div>`);
          });
      });
      // const tripList = (`<li>${trip.name}</li>`);

      // tripList.append(`<li><a href="https://trektravel.herokuapp.com/trips/${trip.id}">${trip.name}</li>`);


    });
  })

  // if there is a problem, call this function instead
  .catch((error) => {
    reportStatus(error);
    console.log(error);
  });
};

// const getTripDetail () => {
//   // const tripList = $('#trip-list');
//
// }

$(document).ready(() => {
  $('#load').click(loadTrips);
});
