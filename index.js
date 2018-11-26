const URL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus('Loading trips...');

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(URL)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);

      tripList.append('<h4>All Trips</h4>');
      response.data.forEach((trip) => {
        const idName = `${trip['id']}`;
        tripList.append(`<li id=${idName} class="list-group-item">${trip['name']}</li>`);

      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);

    });
};

const loadTripsByContinent = (continent) => {
  reportStatus('Loading trips by continent...');
  let url = `https://trektravel.herokuapp.com/trips/continent?query=${continent}`;
  if (continent == "All continents"){
    url = 'https://trektravel.herokuapp.com/trips';
  }

  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(url)
    .then((response) => {
      reportStatus(`Successfully loaded ${response.data.length} trips`);

      tripList.append(`<h4>All Trips in ${continent} </h4>`);
      response.data.forEach((trip) => {
        const idName = `${trip['id']}`;
        tripList.append(`<li id=${idName} class="list-group-item">${trip['name']}</li>`);

      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);

    });

};

const addForm = function addForm(tripName,id) {

  $('#tripReserve').empty();
  $('#tripReserve').append(
    `<section>
       <h4>Make a reservation</h4>
       <form id="trip-form" class="form-horizontal">
         <input class="form-control" type="hidden" name="id" value='${id}'></input>
         <div class="form-group">
           <label for="name">Name</label>
           <input class="form-control" type="text" name="name" value="Your Name "></input>
         </div>
         <div class="form-group">
           <label for="email">Email</label>
           <input class="form-control" type="text" name="email" value="Your Email"></input>
        </div>
         <div class="form-group">
           <label for="tripName">Trip Name</label>
           <input class="form-control" type="text" name="tripName" value='${tripName}'></input>
        </div>
        <div >
           <input type="submit" name="reserve" value="reserve" class="btn btn-primary" data-toggle="modal" ></input>
        </div>
      </form>
    </section>`);
   $('#tripNew').empty();
   $('#tripNew').append(
    `<section>
       <h4>Add a new Trip</h4>
       <form id="new-form" class="form-horizontal">

         <div class="form-group">
           <label for="name">Name</label>
           <input class="form-control" type="text" name="name" value="Trip Name "></input>
         </div>
         <div class="form-group">
           <label for="continent">Continent</label>
           <input class="form-control" type="text" name="continent" value="Trip continent"></input>
        </div>
         <div class="form-group">
           <label for="about">About</label>
           <input class="form-control" type="text" name="about" ></input>
        </div>
        <div class="form-group">
          <label for="category">Category</label>
          <input class="form-control" type="text" name="category" ></input>
       </div>
       <div class="form-group">
         <label for="weeks">Weeks</label>
         <input class="form-control" type="number" name="weeks" ></input>
      </div>
      <div class="form-group">
        <label for="cost">Cost</label>
        <input class="form-control" type="float" name="cost" ></input>
     </div>
        <div >
           <input type="submit" name="add trip" value="add trip" class="btn btn-primary" data-toggle="modal" ></input>
        </div>
      </form>
    </section>
    `);
};

const listTripDetail = function listTripDetail(id) {
   const url = `https://trektravel.herokuapp.com/trips/${id}`;

   axios.get(url)
   .then((response) =>{
     //console.log(response);  => used for get the data at development tools >cosnole to review what get back from api.
     reportStatus(`Successfully loaded trip ${response.data['name']}`);
     $('#tripDetail').empty();

     $('#tripDetail').append(
       `<h4>Trip Details</h4>
        <p><strong>Name: ${response.data['name']}</strong></p>
        <p><strong>Continent: </strong>${response.data['continent']}</p>
        <p><strong>Category: </strong>${response.data['category']}</p>
        <p><strong>Weeks:</strong> ${response.data['week']}</p>
        <p><strong>Cost: </strong>$${response.data['cost']}</p>
        <p><strong>About:</strong> ${response.data['about']}</p>
        `);
      addForm(response.data['name'],response.data['id']);
   })
 .catch((error) => {
   reportStatus(`Encountered an error while loading trip: ${error.message}`);
   console.log(error);
 });
};

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#trip-form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#trip-form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#trip-form input[name="name"]`).val('');
  $(`#trip-form input[name="email"]`).val('');
};

const makeReservation = (event) => {

  event.preventDefault();


  const reserveData = readFormData();
  const id = $(`#trip-form input[name="id"]`).val();
  const postUrl = "https://trektravel.herokuapp.com/trips/"+id+"/reservations";

  reportStatus('Sending reservation data...');

  axios.post(postUrl, reserveData)
    .then((response) => {
      reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
      clearForm();
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors) {
        reportStatus(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });

};

const readTripData = () => {
  const parsedTripData = {};

  const nameFromTrip = $(`#new-form input[name="name"]`).val();
  parsedTripData['name'] = nameFromTrip ? nameFromTrip : undefined;

  const continentFromTrip = $(`#new-form input[name="continent"]`).val();
  parsedTripData['continent'] = continentFromTrip ? continentFromTrip : undefined;

  const aboutFromTrip = $(`#new-form input[name="about"]`).val();
  parsedTripData['about'] = aboutFromTrip ? aboutFromTrip: undefined;

  const categoryFromTrip = $(`#new-form input[name="category"]`).val();
  parsedTripData['category'] = categoryFromTrip ? categoryFromTrip : undefined;

  const weekFromTrip = $(`#new-form input[name="weeks"]`).val();
  parsedTripData['weeks'] = weekFromTrip ? weekFromTrip : undefined;

  const costFromTrip = $(`#new-form input[name="cost"]`).val();
  parsedTripData['cost'] = costFromTrip ? costFromTrip : undefined;

  return parsedTripData;
};

const clearTripData = () => {
  $(`#new-form input[name="name"]`).val('');
  $(`#new-form input[name="continent"]`).val('');
  $(`#new-form input[name="about"]`).val('');
  $(`#new-form input[name="category"]`).val('');
  $(`#new-form input[name="weeks"]`).val('');
  $(`#new-form input[name="cost"]`).val('');
};

const addTrip = (event) => {

  event.preventDefault();

  const tripData = readTripData();

  reportStatus('Sending reservation data...');

  axios.post(URL, tripData)
    .then((response) => {
      reportStatus(`Successfully added a new tripNew with ID ${response.data.id}!`);
      clearTripData();
    })
    .catch((error) => {
      if (error.response.data && error.response.data.errors) {
        reportStatus(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });

};

$(document).ready(() => {
  $('#load').click(loadTrips);

  $('#continent').change(function(){
    let selectedVal = $(this).find(':selected').val();
    loadTripsByContinent(selectedVal);

  });


  $('#trip-list').on('click','li',function(event) {
    const idSelected = event.target.id;
    listTripDetail(idSelected);
  });

  $('#tripReserve').on('submit','#trip-form',makeReservation);

  $('#tripNew').on('submit','#new-form',addTrip);

});
