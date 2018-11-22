const URL =  'https://trektravel.herokuapp.com/trips';

const statusReport = (message) => {
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
}

const loadTrips = () => {
  statusReport("loading all trips....");

  // this bit keeps stuff from getting added on more and more each time stuff appends
  const tripList = $('#trip-list');

  tripList.empty();
  // load in the trips

  axios.get(URL)

  // promise

  .then((response) => {
    statusReport (`Successfully loaded ${response.data.length} trip`);

    // sort the trips

    response.data.forEach((trip) => {
      tripList.append(`<li>${trip.name}</li>`);
      tripList.append(`<button id="trip-details" > Trip Details </button>`)
    });
  })

  // if cant work, catch the error

  .catch((reportError) => {
    statusReport(reportError);
    console.log(reportError);
  });
};


$(document).ready(() => {
$( "#load" ).click(function(){
  $("loadTrips").toggle();
})


// $('#trip-details').click();
});
