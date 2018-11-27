const BASE = 'https://trektravel.herokuapp.com/'

const loadTrips = () => {
  axios.get(BASE + 'trips')
    .then((response) => {
      $('#triplist').css('height', 'max-content');
      $('#triplist').css('border', '4px solid black');
      response.data.forEach((trip) => {
        $('#triplist').append(`<li data-id="${trip.id}">${trip.name}</li>`);
      })
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trips: ${error.message}`);
      console.log(error);
    });
};

const getDetails = (id) => {
  axios.get(BASE + 'trips/' + id)
    .then((response) => {
      console.log(response.data);
      $('#tripdetails').css('border', '4px solid orangered');
      $('#tripdetails').css('borderRadius', '10px');
      $('#tripdetails').css('boxShadow', '5px 5px 20px red');
      clearBorder();

      $('#tripdetails').html(`<ul><li id="title">${response.data.name}</li><li id="about">${response.data.about}<li><li class="rightalign">${response.data.cost}</li><li class="rightalign">${response.data.weeks} weeks</li><li class="rightalign" id="bookit" data-id="${response.data.id}">book it!</li></ul>`);

      $('#bookit').on('click', function() {
        bookTrip($(this).attr('data-id'));
      });
    })
    .catch((error) => {
      reportStatus(`Encountered an error while loading trip: ${error.message}`);
      console.log(error);
    });
};

const bookTrip = (id) => {
  $('#booktrip').css('border', '3px solid dodgerblue');
  $('#booktrip').css('boxShadow', '5px 5px 20px skyblue');

  $('#booktrip').html(
    `<form data-id="${id}">
      <label>name</label>
      <input type="text" name="name" />
      <label>email</label>
      <input type="text" name="email" />
      <input type="submit" id="submit"/>
    </form>`);

    $('form').submit(submitForm);
};

const submitForm = (e) => {
  e.preventDefault();

  const data = {};
  data['name'] = $('form input[name="name"]').val();
  data['email'] = $('form input[name="email"]').val();
  console.log(data);

  reportStatus('Sending ur deets...');

  const url = BASE + `trips/${$('form').attr('data-id')}/reservations`
  axios.post(url, data)
    .then((response) => {
      reportStatus(`Successfully did a reserve for ${response.data.name}!`);
      $('form input[name="name"]').val('');
      $('form input[name="email"]').val('');
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    })
};

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += '</ul>';
  reportStatus(content);
};

const clearStatus = () => {
  $('#status-message').html('');
};

const clearBorder = () => {
  $('#booktrip').css('border', '');
};


$(document).ready(() => {
  $('#loadtrips').on('click', () => {
    clearStatus();
    loadTrips();
  });

  $('ul').on('click', 'li', function() {
    clearStatus();
    $('#booktrip').html('');
    getDetails($(this).attr('data-id'));
  });
})
