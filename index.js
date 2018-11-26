
const baseURL = "https://trektravel.herokuapp.com/trips/";

const imageObj = {
  Europe: "https://www.jigsawstore.com.au/assets/full/RB14756-4.jpg",
  Asia: "https://thumbs-prod.si-cdn.com/bYNUZCqmAA-Y23yybqCJig3v-O0=/800x600/filters:no_upscale():focal(1471x1061:1472x1062)/https://public-media.smithsonianmag.com/filer/b6/30/b630b48b-7344-4661-9264-186b70531bdc/istock-478831658.jpg",
  "South America": "https://exclusivesmedia.webjet.com.au/uploads/2017/06/Taste-Galapagos-Machu-Picchu-5-min.jpg",
  "North America": "https://boutique.ping-deco.fr/blog/wp-content/uploads/2015/06/Lempire-State-Building-un-style-art-d%C3%A9co-1024x678.jpg",
  Africa: "http://www.toptraveldestinationdeals.com/wp-content/uploads/2016/03/618_348_1.jpg",
  Australasia: "http://cdn.earthporm.com/wp-content/uploads/2015/07/the-great-barrier-reef-facts-for-kids-turtle-and-clownfish.jpg",
  Antarctica: "https://static.boredpanda.com/blog/wp-content/uploads/2015/03/dsc02117-3_1600x1200px__880.jpg"
}

const findNumTrips = function(){
  return axios.get(baseURL)
  .then(response => {
    reportStatus('Loading available trips...');
    return response.data
  })
};

const loadRandomTrip = (numTrips) =>{
  const tripId = Math.ceil(Math.random() * (numTrips));
  loadTrip(tripId);
};

const reportStatus = (message) => {
  const statusDiv = $('#status-message')
  statusDiv.empty();
  statusDiv.html(message);
};

const reloadHome = () => {
  $('body').addClass('static');
  $('.main ul').removeClass();
  $('.main ul').addClass('main-empty');
  $('.main-empty').html("Choose your adventure!");
  $('.footer').attr('id', 'body-empty');
  $('.trek').attr('id', 'home-header');
  reportStatus(`Choose your own adventure. Click toggle or tap on words below.`);
}

const createForm = (tripDiv) => {
  tripDiv.append('<div><h2>Take me there!</h2></div>');
  tripDiv.append('<div><label for=name><strong>Name</strong></label><input name=name type=text/></div>');
  tripDiv.append('<div><label for=email><strong>Email</strong></label><input name=email type=text/></div>');
  tripDiv.append('<div><label for=age><strong>Age (optional)</strong></label><input type=text name=age></div>');
  tripDiv.append('<div id=form-button><input name=reserve-trip type=submit value="Book Trip" /></div>');
  tripDiv.append('<div id=form-button><input name=clear-trip type=reset value="Clear Data" /></div>')
};

const submitForm = (event) => {

  event.preventDefault();
  const tripId = $('.trip-form').get()[0].id;
  const tripName = $.parseHTML($('#trip-name').html())[0].textContent;
  const url = baseURL + tripId + "/reservations/";
  const tripData = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val(),
  };

  reportStatus('Sending trip data...');

  axios.post(url, tripData)
  .then((response) => {
    reportStatus(`Successfully reserved trip ${tripName} with id ${tripId} for ${response.data.name}`);
    $('.trip-form').get()[0].reset();
  })
  .catch((error) => {
    reportStatus(`Encountered an error while reserving this trip: ${error.message}`);
  });
};

const loadTrip = function(tripID) {

  const savedId = tripID;
  $('#trip').empty();
  $('#trip').removeClass();
  $('#trip').addClass('detail');
  $('body').removeClass();

  const tripDetail = $('#trip');
  reportStatus('Retrieving info for this trip...');

  axios.get(baseURL + savedId)
  .then( (response) => {

    reportStatus(`Reserve the ${response.data.name} trip below or toggle twice to pick a different trip.`);

    let weeks = "0";
    let about = "";

    if (response.data.weeks == "1") {
      weeks = "1 week";
    }
    else {
      weeks = response.data.weeks + " Weeks";
    }

    if (response.data.about == null) {
      about = "";
    }
    else{
      about = response.data.about;
    }

    $('.footer').removeAttr('id');
    $('.trek').removeAttr('id');
    //show
    tripDetail.append('<div class=trip-show></div>');
    tripDetail.append(`<div class=trip-form-div><form class="trip-form" id=${savedId}></form></div>`);
    const tripShow = $('.trip-show');
    const tripForm = $('.trip-form');

    tripShow.append(`<li><strong>Continent: </strong>${response.data.continent}</li>`)
    tripShow.append(`<li><strong>Name: </strong><div id="trip-name">${response.data.name}</div></li>`);
    tripShow.append(`<li><strong>Category: </strong>${response.data.category}</li>`);
    tripShow.append(`<li><strong>Length: </strong>${weeks}</li>`);
    tripShow.append(`<li><strong>Cost: </strong>$${response.data.cost}</li>`);
    tripShow.append(`<li><strong>About: </strong>${about}</li>`);

    //edit form
    createForm(tripForm);
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trip: ${error.message}`);
  });
}

const loadTrips = () => {

  const tripList = $('#trip');
  tripList.empty();
  tripList.removeClass();
  tripList.addClass('list');
  $('body').removeClass();

  axios.get(baseURL)
  .then( (response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);

    response.data.forEach( (response) => {

      const imageLink = imageObj[response["continent"]];
      let continental = "";

      if (response["continent"] === "Europe") {
        continental = response["continent"] + "an";
      }
      else if (response["continent"] === "Antarctica") {
        continental = "Antarctic";
      }
      else {
        continental = response["continent"] + "n";
      }

      $('.footer').removeAttr('id');
      $('.trek').removeAttr('id');

      tripList.append(`<li id=${response["id"]}></li>`);
      const tripItem = $(`#trip.list li#${response["id"]}`);
      tripItem.append(`<div><img src=${imageLink} alt="Iconic ${continental} image"></div>`);
      tripItem.append(`<div><strong>${continental} Adventure</strong></div>`);
      tripItem.append(`<div>${response["name"]}</div>`);
      tripItem.append(`<div><button class="select-trip" id=${response["id"]}>Trek here!</button></div`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  });
};

const toggleList = () => {

  $('.toggle').on('change', (event) => {

    const tripDiv = $('#trip')

    if (event.target.checked && tripDiv.hasClass('detail')){
      alert("This will clear out your current trip.");
      loadTrips();
    }
    else if (event.target.checked) {
      loadTrips();
    }
    else {
      if (tripDiv.hasClass('list')) {
        reloadHome();
        reportStatus('Trips emptied. Toggle to reload.');
      }
      else {
        reportStatus('Toggle once to load your next adventure!');
      }
    }
  })
};

$(document).ready(() => {

  //starting initial status
  reportStatus("Choose your own adventure. Click toggle twice or tap on words below!");

  //go home via click of heading
  $('body').on('click', '.trek', function(){
    reloadHome();
  })

  //load trips via clicking empty main words
  $('body').on('click', '.main-empty', function(){
    loadTrips();
  })

//pick random trip via clicking subhading
  $('body').on('click', '.sub-heading', function(){
    findNumTrips()
    .then(data => {
      loadRandomTrip(data.length);
    });
  })

  // load trips via toggle
  toggleList();

  // load trip via button
  $('body').on('click', '.select-trip', function(event){
    loadTrip(event.target.id);
  })

  // submit reservation via form elem
  $('body').on('submit', '.trip-form', function(event){
    submitForm(event);
  })
});
