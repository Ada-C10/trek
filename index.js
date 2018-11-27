
const URL = 'https://trektravel.herokuapp.com/trips';

const loadTrips = () => {
  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();


  axios.get(URL).then((response) => {
      response.data.forEach((trip) => {
        const tripHTML = $(`<li><a href="#">${trip.name}</a></li>`);
        tripList.append(tripHTML);

        tripHTML.click(() => {
          loadTripDetail(trip.id);
        })
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadTripDetail = (id) => {

const tripDetail = $('#trip-details');
tripDetail.empty();

 axios.get(URL + "/" + id).then((response) => {
   //reportStatus(`Loading trip ....`);
   let trip = response.data
    console.log(trip)

   tripDetail.append(`
     <p>Trip Name : ${trip.name}</p>
     <p>Continent : ${trip.continent}</p>
     <p>Cost : ${trip.cost}</p>
     <p>Weeks : ${trip.weeks}</p>
     <p>About : ${trip.about}</p>
     `)
     const reservationForm = $('.reservation')
      reservationForm.empty();

      $('.reservation').append(`
        <h1>Reserve Trip</h1>
        <form id="trip-form">
        <div>
        <label for="name">Name</label>
        <input type="text" name="name" />
        </div>

        <div>
        <label for="email">Email</label>
        <input type="text" name="email" />
        </div>

        <div>
        <label for="trip">Trip Name</label>
        <input type="text" name="trip" value="${trip.name}"/>
        </div>

        <div>
        <input type="hidden" value=${trip.id}/>
        </div>

        <input type="submit" name="reserve-trip" value="Reserve Trip" />
        </form>
        `)

});
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  //$('#trip-list').on("click", "a", function (){
  //})

  });
//});
//
// $(document).ready(() => {
//   $('<a>').click(loadTripDetail)
// });
