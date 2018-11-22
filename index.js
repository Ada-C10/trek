const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus("loading trips...")

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
  .then((response) => {
    reportStatus(`successfully loaded ${response.data.length}`)
    response.data.forEach((trip) => {
      const trips = $(`<li>${trip.name}</li>`)
      tripList.append(trips);


      trips.on('click', () => {
        loadTripDetails(`${trip.id}`)
      })

      // function Tripdetail() {
      //   const tripId = (trip.id)
      //   function getTripDetails() {
      //     ('#trip-list').click(loadTripDetails(tripId))
      //   }
      //   return getTripDetails;
      // }

    });
  })
  .catch((error) => {
    reportStatus(error);
  });

};



const URL1 = 'https://trektravel.herokuapp.com/trips/';

const loadTripDetails = (tripId) => {

  reportStatus("loading trips...")

  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  axios.get(URL1+`${tripId}`)
  .then((response) => {
    reportStatus(`successfully loaded ${response.data.length}`)
    tripDetail.append(`<li>Id: ${response.data.id}</li>`);
    tripDetail.append(`<li>Name: ${response.data.name}</li>`);
    tripDetail.append(`<li>continent: ${response.data.continent}</li>`);
    tripDetail.append(`<li> Details: ${response.data.about}</li>`);
    tripDetail.append(`<li> Category: ${response.data.category}</li>`);
    tripDetail.append(`<li> Weeks: ${response.data.weeks}</li>`);
    tripDetail.append(`<li>Cost: ${response.data.cost}</li>`);
  })
  .catch((error) => {
    reportStatus(error);
  });

};




$(document).ready(() => {
  $('#load').click(loadTrips)
  // Tripdetail();
});


///wave 2 need to get the trips's id: two different options:
// need ref to trip id in its click handler. use html and event delegation

//or the other option is to use closure-both are valid-one is more javascripty
/*
* Nest a function inside a function
* Reference a variable from the outer function in the inner function
* Make the inner function available outside the outer function
* Usually this means you return the inner function from the outer function
* We'll see other ways to do this later
*/
