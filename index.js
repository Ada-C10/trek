const URL =  'https://trektravel.herokuapp.com/trips'

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadTrips = () => {
  reportStatus('Loading trips...');


  // Prep work
  const tripList = $('#trip-list');
  tripList.empty();

  // Actually load the pets
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

const bookForm = () =>{
  $('#form').show();
}

$(document).ready(() => {
  $('#load').click(loadTrips);
  $('#trip-list').on('click','li', function(){
    showTrip(this.id);
    console.log(this.id);
    bookForm(this.id)
  })
});
