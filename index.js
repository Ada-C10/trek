//wave 1
const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus("loading trip detail...")

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

      trips.on("click", function() {
        $("#addForm").toggle()
        loadReservationForm(`${trip.id}`)

      });


    });
  })
  .catch((error) => {
    reportStatus(error);
  });

};

// wave 3

// const loadReservationForm = (tripId) => {
//   const URLPOST = `https://trektravel.herokuapp.com/trips/${tripId}/reservations`
// }
//
// const CreateReservation = () => {
//
//   event.preventDefault();
//
//   console.log("in CreateReservation");
//   reportStatus('Sending trip data....');
//
//
//   const dataToSendWithPost = {
//     name: $('input[name="name"]').val(),
//     age:  $('input[name="email"]').val()
//
//     axios.post(URLPOST, dataToSendWithPost)
//     .then((response) => {
//       reportStatus(`Successfully added a pet with ID ${response.data.id}! and the name ${response.data.name}, age: ${response.data.age}`);
//     })
//     .catch((error) => {
//       reportStatus(error);
//       console.log(error);
//     });
//   }
//
// }



//wave 2

const URL1 = 'https://trektravel.herokuapp.com/trips/';

const loadTripDetails = (tripId) => {

  reportStatus("loading trips...")

  const tripDetail = $('#trip-detail');
  tripDetail.empty();

  axios.get(URL1+`${tripId}`)
  .then((response) => {
    reportStatus(`successfully loaded ${response.data.length}`)
    tripDetail.append(`<p> Trip Detail </p>`);

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
  $('#load').click(loadTrips);
  $('#addForm').submit(CreateReservation);
});
