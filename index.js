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
      $('#trek-detail').empty();
      $('.new-trek').append(`<div class="">
        <button id="load-detail">Details</button>
        <ul id="trek-detail"></ul>
      </div>`);
      const trekData = response.data
        $('#trek-detail').append(`<li> ${trekData.id}</li>`);
        $('#trek-detail').append(`<li> ${trekData.name}</li>`);
        $('#trek-detail').append(`<li> ${trekData.continent}</li>`);
        $('#trek-detail').append(`<li> ${trekData.about}</li>`);
        $('#trek-detail').append(`<li> ${trekData.category}</li>`);
        $('#trek-detail').append(`<li> ${trekData.weeks}</li>`);
        $('#trek-detail').append(`<li> ${trekData.cost}</li>`);
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

  $('.new-trek').empty();
  $('.new-trek').append(formHtml);

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
      $('#testing').append(response);
      clearForm();
    })
    .catch((error) => {
      $('#status-message').append(`${error}`);
    });
};



$(document).ready(() => {
  $('#load').click(loadAllTreks);
});
