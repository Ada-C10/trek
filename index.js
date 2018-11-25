const treksUrl =  "https://trektravel.herokuapp.com/trips";
const oneTrekUrl = "https://trektravel.herokuapp.com/trips/";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadAllTreks = () => {
  // Prep work
  const trekList = $('#trek-list');
  trekList.empty();

  axios.get(treksUrl)
    .then((response) => {
      response.data.forEach((trek) => {
        const listItem = $(`<li class="${trek.id}"> ${trek.name}</li>`);

        trekList.append(listItem);
        listItem.on('click', () => {
          $('.new-trek').empty();
          loadOneTrek(`${trek.id}`);
          reserveTrek(`${trek.id}`);
        });
      });
    })
    .catch((error) => {
      $('#status-message').append(`${error}`);
    });
};

const loadOneTrek = (id) => {

  const trekNumber = oneTrekUrl + id;

  axios.get(trekNumber)
    .then((response) => {
      $('.new-trek').append(`<div class="">
        <button id="load-detail">Details</button>
        <ul id="trek-detail"></ul>
      </div>`);
      const trekData = response.data
        $('#trek-detail').append(`<li> Id: ${trekData.id}</li>`);
        $('#trek-detail').append(`<li> Name:  ${trekData.name}</li>`);
        $('#trek-detail').append(`<li> Continent:  ${trekData.continent}</li>`);
        $('#trek-detail').append(`<li> Category:  ${trekData.category}</li>`);
        $('#trek-detail').append(`<li> Weeks:  ${trekData.weeks}</li>`);
        $('#trek-detail').append(`<li> Cost: $ ${trekData.cost}</li>`);
        $('#trek-detail').append(`<li> About:  ${trekData.about}</li>`);
    })
    .catch((error) => {
      $('#status-message').append(`${error}`);
    });
};

const clearForm = () => {
  $(`#trek-form input[name="name"]`).val('');
  $(`#trek-form input[name="age"]`).val('');
  $(`#trek-form input[name="email"]`).val('');
}

const reserveTrek = (id) => {
  // id.preventDefault();
  const formHtml = `<h1 id="testing">Reserve trek</h1>
  <form id="trek-form">
    <div>
      <label for="name">Trek name</label>
      <input type="text" name="name"/>
    </div>

    <div>
      <label for="age">Age</label>
      <input type="text" name="age"/>
    </div>

    <div>
      <label for="email">Email</label>
      <input type="text" name="email"/>
    </div>

    <input type="submit" name="add-trek" value="Add Trek" />
  </form>`;

    $('.new-trek').append(formHtml);

    const result = (event) => {
      event.preventDefault();
      createReservation( id );
    };

    $('#trek-form').submit(result);
};

const createReservation = (id) => {
  const reserveTrekUrl = 'https://trektravel.herokuapp.com/trips/' + id + '/reservations';

  const trekData = {
      name: $('#trek-form input[name="name"]').val(),
      age: $('#trek-form input[name="age"]').val(),
      email: $('#trek-form input[name="email"]').val()
    };

  reportStatus('Sending trek data...');

  axios.post(reserveTrekUrl, trekData)
    .then((response) => {
      console.log(response);
      reportStatus('Successfully reserved trip');
      $('#testing').append(response);
      clearForm();
    })
    .catch((error) => {
      $('#status-message').append(`${error}`);
    });
}

$(document).ready(() => {
  $('#load').click(loadAllTreks);
});
