
const BaseURL = 'https://trektravel.herokuapp.com/trips';

const reportStatus = (message) => {
  $('#status-message').html(message);
};


//Loading all trips
const loadTrips = () => {
  const tripList = $('#trip-list');
  tripList.empty();

  axios.get(BaseURL)
  .then((response) => {

    title = $(`<h1>List of trips</h1>`);
    tripList.append(title);

    response.data.forEach((trip) => {
      let single_trip = $(`<li>${trip.name}</li>`)
      tripList.append(single_trip);

      // call the load one trip function to pass in the trip info so that at a click it will show
      const loadtrip = loadOneTrip(trip);
      single_trip.click(loadtrip);
    });
  })

  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
  });
};

const loadOneTrip = (trip) => {

  return () => {
    const oneTrip = $('#one-trip');
    oneTrip.empty();

    axios.get(BaseURL + '/'+ trip.id)
    .then((response) => {

      oneTrip.append(`<h1>Trip Details</h1>
        <h3>Name: ${response.data.name}</h3>
        <p>ID: ${response.data.id}</p>
        <p>Continent: ${response.data.continent}</p>
        <p>About: ${response.data.about}</p>
        <p>Category: ${response.data.category}</p>
        <p>Duration: ${response.data.weeks}</p>
        <p>Cost: ${response.data.cost}</p>`);
      });
    };
  };


  const reserveTrip = () => {

  };


  $(document).ready(()=> {
    $('#load-all').click(loadTrips)

  });
