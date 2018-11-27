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
        showTrip(trip.id);
      });
    });

  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
    console.log(error);
  });
};


const showTrip = (id) => {
  const tripInfo = $('.trip-info')
  tripInfo.empty();


  axios.get(URL + `/` + id).then((response) => {

    let trip = response.data
    $('.trip').append(`
      <div class="trip-info">
      <h1>Trip Details</h1>
      <p>Trip ID : ${trip.id}</p>
      <p>Trip Name : ${trip.name}</p>
      <p>Continent : ${trip.continent}</p>
      <p>Category : ${trip.category}</p>
      <p>Cost : $${trip.cost}</p>
      <p>Weeks : ${trip.weeks}</p>
      <p>About : <p>${trip.about}</p></p>
      </div>`)

      const reservationForm = $('.reservation')
      reservationForm.empty();

      $('.reservation').append(`
        <h1>Reserve Trip</h1>
        <form id="trip-form">
        <div>
        <label for="name">Name</label>
        <input type="text" name="name" />
        </div>

        <div>
        <label for="email">Email</label>
        <input type="text" name="email" />
        </div>

        <div>
        <label for="trip">Trip Name</label>
        <input type="text" name="trip" value="${trip.name}"/>
        </div>

        <div>
        <input type="hidden" value=${trip.id}/>
        </div>

        <input type="submit" name="reserve-trip" value="Reserve Trip" />
        </form>
        `)

         $('#trip-form').on( "submit", function(event) {
           event.preventDefault();
           reserveTrip(trip);
         })
      });

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


    const readFormData = () => {
      const parsedData = $('#trip-form').serialize();
      return parsedData;
    };

    const clearForm = () => {
      $('#trip-form')[0].reset();
    }

    const reserveTrip = (trip) => {

      const tripData = readFormData();
      // console.log(trip.id)

      console.log(tripData)

      axios.post(URL + `/` + trip.id + `/reservations`, tripData)
      .then((response) => {
        console.log(response);
        reportStatus('Reservation Successful!');
        clearForm();
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.data && error.response.data.console.errors) {
          reportError(
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
    });
