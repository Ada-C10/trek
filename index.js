const URL = "https://trektravel.herokuapp.com/trips";

const reportStatus = (message) => {
 $('#status-message').html(message);
};

const loadTrips = () => {
 const tripList = $('#trips-list');
 tripList.empty();

 axios.get(URL).then((response) => {
   reportStatus(`Loading trips ....`);
   response.data.forEach((trip) => {

     reportStatus(`Successfully loaded ${response.data.length} trips`);
     tripObject = $(`<li class="info">${trip.name}</li>`)
     tripList.append(tripObject);


      $(tripObject).click(() => {
        loadTrip(trip.id);
      });
   });

 })
 .catch((error) => {
   reportStatus(`Encountered an error while loading trips: ${error.message}`);
   console.log(error);
 });
};


const loadTrip = (id) => {
 const tripDetails = $('#trip-details');
 tripDetails.empty();

 axios.post(URL + `/${id}`).then((response) => {
   reportStatus(`Loading trip ....`);
   let trip = response.data

   $('body').append(`
     <div class="trip-info">
     <p>Trip Name : ${trip.name}</p>
     <p>Continent : ${trip.continent}</p>
     <p>Cost : $${trip.cost}</p>
     <p>Weeks : ${trip.weeks}</p>
     <p>About : <p>${trip.about}</p></p>
     </div>`)

   });
 };


$(document).ready(() => {
   $('#load').click(loadTrips);
});
