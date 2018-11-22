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
        // here is after we have loaded trips
        // and added one entry to the list
        // set up the click handler for that entry
        listItem.on('click', () => {loadOneTrek(`${trek.id}`)});
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadOneTrek = (id) => {
  const trekNumber = oneTrekUrl + id;

  axios.get(trekNumber)
    .then((response) => {
      $('#tttrek').empty();
      const trekData = response.data
        $('#tttrek').append(`<li> ${trekData.id}</li>`);
        $('#tttrek').append(`<li> ${trekData.name}</li>`);
        $('#tttrek').append(`<li> ${trekData.continent}</li>`);
        $('#tttrek').append(`<li> ${trekData.about}</li>`);
        $('#tttrek').append(`<li> ${trekData.category}</li>`);
        $('#tttrek').append(`<li> ${trekData.weeks}</li>`);
        $('#tttrek').append(`<li> ${trekData.cost}</li>`);
    })
    .catch((error) => {
      console.log(error);
    });
};



$(document).ready(() => {
  $('#load').click(loadAllTreks);
});
