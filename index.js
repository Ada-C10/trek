const URL = 'https://trektravel.herokuapp.com/trips';
 // Status Management
 const reportStatus = (message) => {
  $('#display-status').html(message);
};
 // Error Handling
 const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const error in errors) {
    for (const problem of errors[error]) {
      content += `<li>${error}: ${problem}</li>`;
    }
  }
  content += '</ul>';
  reportStatus(content);
  $('#display-status ul').addClass('error');
};
 // Load Trips
 const loadTrips = () => {
  reportStatus('Loading trips');
   const trips = $('#all-trips');
  trips.empty();
   axios.get(URL)
  .then((response) => {
    reportStatus(`Successfully loaded ${response.data.length} trips.`);
    response.data.forEach((trip) => {
      trips.append(`<li>${trip.name}</li>`);
      trips.append(`<span>${trip.id}</span>`);
      $('span').hide();
    });
  })
  .catch((error) => {
    console.log(error);
    reportStatus(`There was a problem loading the trips: ${error.response.statusText}.`);
  });
};
 const loadTrip = (id) => {
  reportStatus(`Loading trip ${id}`);
   const trip = $('#trip');
  trip.empty();
   axios.get(URL + '/' + id)
  .then((response) => {
    if (response.status == 200) {
      console.log();
      reportStatus(`Successfully loaded trip ${id}.`);
      let data = response.data;
      $('#trip').append(`
        <h3>Name: ${data.name}</h3>
        <div>
        <p><strong>Continent: </strong>${data.continent}</p>
        <p><strong>Category: </strong>${data.category}</p>
        <p><strong>Weeks: </strong>${data.weeks}</p>
        <p><strong>Cost: </strong>$${data.cost}</p></div>
        `);
        $('#about-trip').html(`        <strong>About: </strong><p>${data.about}</p>`);
        $('#trip').append(`<span>${id}</span>`);
        $('span').hide();
    } else {
      reportStatus(`There was a problem loading the trip: ${response.statusText}`);
    }
  })
  .catch((error) => {
    reportStatus(`There was a problem loading the trip: ${error.response.statusText}`);
  });
};
 
