
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

const reportStatus = (message) => {
  const statusDiv = $('#status-message')
  statusDiv.empty();
  statusDiv.html(message);
};

const createForm = (tripDiv) => {
  tripDiv.append('<div><h2>Take me there!</h2></div>');
  tripDiv.append('<div><label for=name>Name </label><input name=name type=text/></div>');
  tripDiv.append('<div><label for=email>Email</label><input name=email type=text/></div>');
  tripDiv.append('<div><label for=age>Age (optional)</label><input type=text name=age/></div>');
  tripDiv.append('<div><input name=reserve-trip type=submit value=Reserve /></div>');
  tripDiv.append('<div><input name=clear-trip type=reset value=Clear /></div>')
};

const submitForm = (event) => {
  console.log(event)

  event.preventDefault();

  const tripId= $('.trip-form').get()[0].id

  const url = baseURL + tripId + "/reservations/";
  const tripData = {
    name: $('input[name="name"]').val(),
    email: $('input[name="email"]').val()
  };

  reportStatus('Sending trip data...');

  axios.post(url, tripData)
  .then((response) => {
    console.log("here")
    reportStatus(`Successfully reserved trip for ${response.data.name}`);
  })
  .catch((error) => {

    console.log(tripData)
    console.log(url)
    reportStatus(`Encountered an error while reserving this trip: ${error.message}`);
  });
};

const loadTrip = function(tripID) {

  const savedId = tripID;

  $('#trip').empty();
  $('#trip').removeClass();
  $('#trip').addClass('detail');


  const tripDetail = $('#trip');
  reportStatus('Retrieving info for this trip...');

  axios.get(baseURL + savedId)
  .then( (response) => {

    reportStatus(`Reserve the ${response.data.name} trip below or toggle twice to pick a different trip.`);

    let weeks = "0";

    if (response.data.weeks == "1") {
      weeks = "1 week";
    }
    else {
      weeks = response.data.weeks + " Weeks";
    }

    $('.footer').removeAttr('id')
    //show
    tripDetail.append('<div class=trip-show></div>');
    tripDetail.append(`<div class=trip-form id=${savedId}></div>`);
    const tripShow = $('.trip-show');
    const tripForm = $('.trip-form');

    tripShow.append(`<li>${response.data.continent}</li>`)
    tripShow.append(`<li>${response.data.name}</li><li>${weeks}</li>`);
    tripShow.append(`<li>${response.data.category}</li>`);
    tripShow.append(`<li>${weeks}</li>`);
    tripShow.append(`<li>$${response.data.cost}</li>`);
    tripShow.append(`<li>${response.data.about}</li>`);

    //form
    createForm(tripForm);
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trip: ${error.message}`);
  });
  // $('.trip-form').submit(submitForm(savedId));

  // $('.trip-form').on('submit', function(event){
  //   console.log("here")
  //   submitForm(event);
  // })


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
        tripDiv.empty();
        $('body').addClass('static');
        $('.main ul').removeClass();
        $('.main ul').addClass('main-empty');
        $('.main-empty').html("Choose your adventure!");
        // $('.main ul')
        $('.footer').attr('id', 'body-empty');
        reportStatus('Trips emptied. Toggle to reload.');
      }
      else {
        reportStatus('Toggle once to load your next adventure!');
      }
    }
  })
};


$(document).ready(() => {

  // //do this once on start
  // $(window).on('load',function() {
  //
  //    //   .ios-toggle:checked + .checkbox-label:after {
  //    //   content:attr(data-on);
  //    // }
  // $('.toggle').get()[0].getsetAttribute("content", "data-off")
  //    $('.toggle').setAttribute("content", "data-on")
  // });

  // $('.ios-toggle').attr('checked');
  // $('body').on('load', '.toggle', function(event) {
  //   // $('.toggle').prop('checked', true);
  //   console.log("hi im here")
  //   event.target.checked = true
  // })

  toggleList();

  // $('body').on('load', '.select-trip', function(event){
  //   loadTrip(event.target.id);
  // })

  $('body').on('click', '.select-trip', function(event){
    loadTrip(event.target.id);
  })

  // $('body').on('submit', '.trip-form', function(event){
  //   submitForm(event);
  // })

  // $('.trip-form').submit(submitForm);
  // $('.trip-form').on('submit', submitForm);

  reportStatus("Choose your own adventure. Click toggle twice!");
});
