const reportStatus = (message) => {
  $('#status-message').html(message);
};

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
                    $('.detail-list').empty()
                    $('.detail-list').prepend(`<h1>${escape.name}</h1>`)

                    $('.detail-list').append(`<li><b>Continent:</b> ${escape.continent}</li>
                    <li><b>Category:</b> ${escape.category}</li>
                    <li><b>Weeks:</b> ${escape.weeks}</li>
                    <li><b>Cost:</b> ${escape.cost}</li>
                    <li><b>About:</b> ${escape.about}</li>`)
                    // console.log($('input[name="escape"]'))
                    $('input[name="escape"]').val(`${escape.name}`)
                    $('input[name="id"]').val(`${escape.id}`)
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


const readFormData = () => {
  const formData = {};

  const name = $(`input[name="name"]`).val();
  formData['name'] = name ? name : undefined;

  const email = $(`input[name="email"]`).val();
  formData['email'] = email ? email : undefined;

  const escape = $(`input[name="escape"]`).val();
  formData['escape'] = escape ? escape : undefined;

  const id = $(`input[name="id"]`).val();
  formData['id'] = id ? id : undefined;

  return formData;
};



const bookEscape = () => {
  //keeps page from refreshing on the submit (default behavior reloads page)
  event.preventDefault();

  const bookingInfo = readFormData()
  //clears out form data
  $( '#escape-form' ).each(function(){
    this.reset();
  });

  const postUrl = `https://trektravel.herokuapp.com/trips/${bookingInfo.id}/reservations`

  axios.post(postUrl, bookingInfo)
    .then((response) => {
      console.log(response);
      reportStatus('Successfully booked!');
    })
    .catch((error) => {
      console.log(error.response);
        if (error.response.data && error.response.data.errors) {
          // User our new helper method
          reportError(
            `Encountered an error: ${error.message}`,
            error.response.data.errors
          );
        } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
    });
}

const reportError = (message, errors) => {
  let content = `<p>${message}</p>`
  content += "<ul>";
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

$(document).ready( function() {

  // load all escapes
  $('#load').click(loadEscapes);

  // submit escape booking form
  $('input[name="book-escape"]').click(bookEscape)

});
