// const getEscape = () => {
// //
// // }

const loadEscapes = () => {

  // list.empty() - do I need this?
  const getUrl = "https://trektravel.herokuapp.com/trips"
  const escapeList = $('#escape-list');

    axios.get(getUrl)
        .then((response) => {
          escapeList.prepend(`<h2>Quick! Get out of here! </h2>`);
          response.data.forEach((escape) => {
            const $tripItem = $(`<li>${escape.name}</li>`);

              $tripItem.click(() => {
                // console.log(escape.id)
                axios.get(getUrl + '/' + escape.id)
                  .then((response) => {
                    console.log(response.data)
                    let escape = response.data
                    $('.detail-list').prepend(`<h1>${escape.name}</h1>`)

                    $('.detail-list').append(`<li><b>Continent:</b> ${escape.continent}</li>
                    <li><b>Category:</b> ${escape.category}</li>
                    <li><b>Weeks:</b> ${escape.weeks}</li>
                    <li><b>Cost:</b> ${escape.cost}</li>
                    <li><b>About:</b> ${escape.about}</li>`)
                  })
              })

            escapeList.append($tripItem);
          })
          $( "#load" ).remove();
        })
        .catch((error) => {
        console.log(error);
        });

}

$(document).ready( function() {

  // load all escapes
  $('#load').click(loadEscapes);

  $('#escape-list').on('click', 'li', function() {
      console.log($(this).text())
      console.log($(this).html())
      // code to make the show details for a trip to appear on page
    })


});
