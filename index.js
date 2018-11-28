const URL = "https://trektravel.herokuapp.com/trips/" //travel trip API

// =======STATUS MESSAGES========
const reportStatus = (message) => {
  $('#status-message').html(message);
};

// =======HIDDEN TOGGLE=========
const toggleMe = (id) => { //hide and show items
  $(`article[id$=${id}] h3`).click(() => { //when article ending with id is clicked
    $(`summary[id=trip-${id}]`).toggleClass("hidden"); //unhide loaded trip information
    $(`form`).toggleClass("hidden"); //unhide form info
    clearForm()  ;
    $(`form`).submit( {"trip": id}, submitReservation); //FORM SUBMISSION FUNCTION, PASS ON DATA TO BE USED IN FORM, only submits per each trip
    $(`article[id!=trip-info-${id}]`).toggleClass("hidden"); //hide trips that do not equal this article's id
});
}

// =======FORM DATA========
const readFormData = () => {
  const parsedFormData = {};

  const nameFromForm = $( `input[name='name']`).val();
  parsedFormData['name'] = nameFromForm ? nameFromForm : undefined;
  console.log(nameFromForm);

  const emailFromForm = $(`input[name='email']`).val();
  console.log(emailFromForm);
  parsedFormData['email'] = emailFromForm ? emailFromForm : undefined;

  console.log()
  console.log(parsedFormData);
  return parsedFormData;

};

const clearForm = () => { //clear out form after submission
  $('form')[0].reset();
}

// =======FORM SUBMISSIONS=======
  const submitReservation = (event) => {
    const tripID = event.data.trip
    event.preventDefault(); //prevents reload
    const reserveData = readFormData();
    const sendData = {
        'name': reserveData["name"],
        'email': reserveData["email"]
    };
    console.log(tripID);

    const postURL = URL+tripID+"/reservations";

    axios.post(postURL, sendData)
      .then((response) => {
        clearForm;
        reportStatus(`Successfully submitted reservation ${response.data.id}!`);
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
  }

// =======TRIPS LIST VIEW========
const allTripView = () => {
  let tripInfo = [];
  const tripsSection = (data) => {return $(`
    <article id='trip-info-${data.id}'>
      <h3 class='name'> ${data.name}, ${data.continent} </h3>
      <summary id='trip-${data.id}' class='hidden'>

      </summary>
    </article>
    `)
  };

  axios.get(URL)
  .then((response) => {
    tripInfo = response.data;
    console.log(tripInfo);
    tripInfo.forEach((trip) => {
      $("#trip-info").append(tripsSection(trip));
      singleTripInfo(trip.id); //DOWNLOAD TRIP INFORMATION
      toggleMe(trip.id); //TOGGLE FUNCTION WHEN ARTICLE CLICKED
      });
  })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
  });
}

// ========CREATE FORM ===============
const createForm = () => {

  return $(`
    <form class='hidden'>
      <label for="name">Name</label>
      <input type="text" name="name" />
      <label for="email">eMail</label>
      <input type="text" name="email" />

      <input type="submit" name="reservation" value="Reserve Your Space Now!"/>
    </form>
  `)
}

// ==========SINGLE TRIP INFO=========
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
    $(`#trip-${id}`).append(singleTripInfo(singleTrip)); // APPEND TO SUMMARY WITH TRIP ID
   })
  .catch((error) => {
    reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
  });
};


$(document).ready(() => {
  $("#trip-view").click( () => {
    allTripView();
    $("#trip-view").hide();
  });
  $('main').append(createForm); //only one form for everyone
});





//
