const loadEscapes = () => {

  // list.empty() - do I need this?
  const getUrl = "https://trektravel.herokuapp.com/trips"
  const escapeList = $('#escape-list');

    axios.get(getUrl)
        .then((response) => {
          escapeList.prepend(`<h2>Quick! Get out of here! </h2>`);
          response.data.forEach((escape) => {
            escapeList.append(`<li>${escape.name}</li>`);
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

  // $('#escape-list').on('click', 'li', function() {
  //     // code to make the show details for a trip to appear on page
  //   })


});
