const URL =  'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};


const loadTrips = () => {
  reportStatus('Loading trips...');



  const tripList = $('#trip-list');
  tripList.empty();


  axios.get(URL)
    .then((response) => {
      response.data.forEach((trip) => {
        let tripID = trip.id
        tripList.append(`<li id="${tripID}"> ${trip.name} </li>`);
      });
      reportStatus(`Successfully loaded ${response.data.length} trips`)
    })
    .catch((error) => {
      console.log(error);
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
    });
};

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#form input[name="name"]`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#form input[name="email"]`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  const tripFromForm = $(`#form input[name="tripID"]`).val();
  parsedFormData['tripID'] = tripFromForm ? tripFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`form input[name="name"]`).val('');
  $(`form input[name="email"]`).val('');
  $(`form input[name="trip"]`).val('');
}

const createReservation = (event) => {
  reportStatus("Submitting new reservation....");
  event.preventDefault();

  const tripData = readFormData();
  console.log(tripData);
  const postURL = `https://trektravel.herokuapp.com/trips/${tripData.tripID}/reservations`
  axios.post(postURL, tripData)
  .then((response) =>{
    console.log(response);
    reportStatus('Sucessfully added a reservation!!!');
    clearForm();
  })
  .catch((error) =>{
    console.log(error.response);
    if (error.response.data && error.response.data.errors) {
      reportError(
        `Encountered an error: ${error.message}`,
        error.response.data.errors
      );
    } else {
      reportStatus(`Encountered an error: ${error.message}`);
    }
  });
}

const showTrip = (id) => {
const singleURL = `https://trektravel.herokuapp.com/trips/${id}`;

  axios.get(singleURL)
  .then((response) =>{
    if (response.data){
      console.log(response.data);
      let id = response.data.id
      let name = response.data.name;
      let continent = response.data.continent;
      let about = response.data.about;
      let weeks = response.data.weeks;
      let cost = response.data.cost;
      let category = response.data.category;
        ($('.id')).html(`TripID: ${id}`);
        ($('.name')).html(`Name: ${name}`);
        ($('.continent')).html(`Continent: ${continent}`);
        ($('.about')).html(`About: ${about}`);
        ($('.weeks')).html(`Weeks: ${weeks}`);
        ($('.cost')).html(`Cost: ${cost}`);
        ($('.category')).html(`Category: ${category}`);

    }    })
};

const bookForm = (id) =>{
  $('#form').show();
  document.getElementById('tripID').value = id



}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click','li', function(){
    showTrip(this.id);
    console.log(this.id);
    bookForm(this.id)
  });
  $('#form').submit(createReservation);
});
