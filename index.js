const url =  "https://trektravel.herokuapp.com/trips";

const loadTreks = () => {
  // Prep work
  const trekList = $('#trek-list');
  trekList.empty();

  // Actually load the pets
  axios.get(url)
    .then((response) => {
      response.data.forEach((trek) => {
        trekList.append(`<li>${trek.name}</li>`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

$(document).ready(() => {
  $('#load').click(loadTreks);
});
