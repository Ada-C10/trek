const URL = "https://trektravel.herokuapp.com/trips/" //travel trip API

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const toggleMe = (id) => { //hide and show items
  $(`article[id$=${id}] h3`).click(() => { //when article ending with id is clicked
    $(`summary[id=trip-${id}]`).toggleClass("hidden"); //unhide loaded trip information
    $(`form`).toggleClass("hidden"); //unhide form info
    $(`article[id!=trip-info-${id}]`).toggleClass("hidden"); //hide trips that do not equal this article's id
});
}

const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $(`#form[id^='form-'] input name='name'`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;

  const emailFromForm = $(`#form[id^='form-'] input name='email'`).val();
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  return parsedFormData;
};

const clearForm = () => {
  $(`#form[id^='form-'] input name='name'`).val('');
  $(`#form[id^='form-'] input name='email'`).val('');
}

const submitReservation = (event) => {
  event.preventDefault();
  const postURL = URL+'reservations';

  const reserveData = readFormData();

  axios.post(postURL, reserveData)
    .then((response) => {
      reportStatus(`Successfully submitted reservation ${response.data.id}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
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

const allTripView = () => {
  let tripInfo = [];
  const tripsSection = (data) => {return $(`
    <article id='trip-info-${data.id}'>
      <h3 class='name'> ${data.name}, ${data.continent} </h3>
      <summary id='trip-${data.id}' class='hidden'>

      </summary>

      <form id='form-${data.id}' class='hidden'>
        <label for="name">Name</label>
        <input type="text" name="name" />
        <label for="email">eMail</label>
        <input type="text" name="email" />
        <input type="submit" name="reservation" value="Reserve Your Space Now!"/>
    </form>
    </article>
    `)
  };

  axios.get(URL)
  .then((response) => {
    tripInfo = response.data;
    console.log(tripInfo);
    tripInfo.forEach((trip) => {
      $("#trip-info").append(tripsSection(trip));
      singleTripInfo(trip.id);
      toggleMe(trip.id);
      $('form').submit(submitReservation)
      });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
  });
}

const singleTripInfo = (id) => {
  let singleTrip = [];
  const idURL = URL+id;

  const singleTripInfo = (data) => { return $(`
        <ul>
          <li> ${data.id} </li>
          <li> ${data.category} </li>
          <li> ${data.weeks} </li>
          <li> ${data.cost} </li>
        </ul>
        <p> ${data.about} </p>
    `)};

  axios.get(idURL)
  .then((response) => {
    singleTrip = response.data;
    $(`#trip-${id}`).append(singleTripInfo(singleTrip));
   })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
  });
};


$(document).ready(() => {
  $("#trip-view").click(allTripView);
});





//
