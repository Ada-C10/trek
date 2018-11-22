
const baseURL = "https://trektravel.herokuapp.com/trips";

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

const loadTrip = () => {
  const tripList = $('#trip');
  console.log(tripList.className);

  reportStatus('Reload the page.. or something else');


  tripList.empty();
  tripList.removeClass();
  tripList.addClass('detail');
}

const loadTrips = () => {

  const tripList = $('#trip');
  tripList.empty();
  tripList.removeClass();
  tripList.addClass('list');

  axios.get(baseURL)
  .then( (response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);

    response.data.forEach( (response) => {

      const imageLink = imageObj[response["continent"]];
      let continental = "";

      if (response["continent"] === "Europe") {
        continental = response["continent"] + "an";
      }
      else {
        continental = response["continent"] + "n";
      }

      tripList.append(`<div><li><img src=${imageLink} alt="Iconic ${continental} image"></li><strong><li>${continental} Adventure</li></strong>
      <li>${response["name"]}</li>
      <li>${response["weeks"]} Weeks</li>
      <li><button class="select-trip" id=${response["id"]}>Trek here!</button></li></div>`);
    });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  });
};

const toggleList = () => {

  $('.toggle').on('change', (event) => {

    const tripDiv =  $('#trip')

    if (event.target.checked && tripDiv.hasClass('detail')){

      // are you sure you want to do that
      //if yes then empty div

      reportStatus("Can't do that with the trip on the page.");
    }
    else if (event.target.checked) {
      loadTrips();
    }
    else {

      if (tripDiv.hasClass('list')) {
        tripDiv.empty();
        reportStatus('Trips emptied.');
      }
      else {
        reportStatus('Use toggle button to load your next adventure!');
      }
    }
  })

  $('.select-trip').click( function(){
    console.log(this);
    loadTrip();
    console.log("here")
  })
};


$(document).ready(() => {

  toggleList();
  reportStatus("Choose your own adventure. Toggle me!");

});
