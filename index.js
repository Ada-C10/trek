const treksUrl =  "https://trektravel.herokuapp.com/trips";
const oneTrekUrl = "https://trektravel.herokuapp.com/trips/";

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

  const reserveTrekUrl = 'https://trektravel.herokuapp.com/trips/' + 1 + '/reservations';

  const trekData = () => {
    return {
      name: $('#trek-form input[name="name"]').val(),
      age: $('#trek-form input[name="age"]').val(),
      email: $('#trek-form input[name="email"]').val()
    }
  }

  const hello = trekData();

  axios.post(reserveTrekUrl, hello)
    .then((response) => {
      console.log(response);
      $('#testing').append(`${response.data}`);
    })
    .catch((error) => {
      $('#status-message').append(`${error}`);
    });
};



$(document).ready(() => {
  $('#load').click(loadAllTreks);
  $('#trek-form').submit(reserveTrek);
});
