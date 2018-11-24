const treksUrl =  "https://trektravel.herokuapp.com/trips";
const oneTrekUrl = "https://trektravel.herokuapp.com/trips/";

const reportStatus = (message) => {
  $('#status-message').html(message);
};

const loadAllTreks = () => {
  // Prep work
  const trekList = $('#trek-list');
  trekList.empty();

  // Actually load the pets
  axios.get(treksUrl)
    .then((response) => {
      response.data.forEach((trek) => {
        const listItem = $(`<li class="${trek.id}"> ${trek.name}</li>`);

        trekList.append(listItem);
        listItem.on('click', () => {
          loadOneTrek(`${trek.id}`);
          $('#trek-form').empty();
          $('#trek-form').append(`<div>
            <label for="name">Trek name</label>
            <input type="text" name="name" id="name"/>
          </div>`);
          $('#trek-form').append(`<div>
            <label for="age">Age</label>
            <input type="text" name="age" id="age"/>
          </div>`);
          $('#trek-form').append(`<div>
            <label for="email">Email</label>
            <input type="text" name="email" id="email"/>
          </div>`);
          $('#trek-form').append(`<input type="submit" name="add-trek" value="Add Trek" />`);
          $('#trek-form').submit(reserveTrek(`${trek.id}`));
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

const reserveTrek = (id) => {

  id.preventDefault();



  const reserveTrekUrl = 'https://trektravel.herokuapp.com/trips/' + id + '/reservations';

  const trekData = () => {
    return {
      name: $('#trek-form input[name="name"]').val(),
      age: $('#trek-form input[name="age"]').val(),
      email: $('#trek-form input[name="email"]').val()
    }
  }

  const clearForm = () => {
    $(`#pet-form input[name="name"]`).val('');
    $(`#pet-form input[name="age"]`).val('');
    $(`#pet-form input[name="email"]`).val('');
  }

  const hello = trekData();
  reportStatus('Sending trek data...');
  axios.post(reserveTrekUrl, hello)
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
