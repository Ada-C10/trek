const URL =  "https://trektravel.herokuapp.com/trips/";

const reportStatus = (message) => {
    $('#status-message').html(message);
};

const reportAPIError = (message, errors) => {
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

const loadDetails = (id) => {
    console.log(URL + id);
    axios.get(URL + id)
        .then((response) => {
            // reportStatus(`Successfully loaded ${response.data.length} trips`);
            console.log(response);
            $('.trip-details').html(`<h2>${response.data.name}</h2>
                                    <p class="description">${response.data.about}</p>
                                    <ul>
                                    <li>Category: ${response.data.category}</li>
                                    <li>Continent: ${response.data.continent}</li>  
                                    <li>Culture: ${response.data.culture}</li>
                                    <li>Duration: ${response.data.weeks} week(s)</li>
                                    <li id="money">Cost: $${response.data.cost}</li></ul>`);
            })
        .catch((error) => {
            reportStatus(`Encountered an error while loading trips: ${error.message}`);
            console.log(error);
        });


};


const loadTrips = () => {
    // Prep work
    const tripList = $('#trip-list');
    tripList.empty();

    // show user what's up, this can go anywhere b/c of async loading
    reportStatus('Loading trips...');

    // Actually load the pets
    axios.get(URL)
        .then((response) => {
            reportStatus(`Successfully loaded ${response.data.length} trips`);
            response.data.forEach((trip) => {
                console.log(trip);
                tripList.append(`<li><a class="trip-info" id="${trip.id}">${trip.name}</a></li>`);
            });
        })
        .catch((error) => {
            reportStatus(`Encountered an error while loading trips: ${error.message}`);
            console.log(error);
        });
};

const readFormData = () => {
    // const parsedFormData = {};
    const parsedFormData = $('#reservation-form').serialize();
    console.log(parsedFormData);

    return parsedFormData;
};

const clearForm = () => {
    const inputs = ["name", "age", "email"];
    for(let inp of inputs){
        $(`#reservation-form input[name="${inp}"]`).val('');
    }
};

const createRsv = (event) => {
    // Note that createPet is a handler for a `submit`
    // event, which means we need to call `preventDefault`
    // to avoid a page reload
    let tripRsvId = event.target.className;
    event.preventDefault();

    const rsvData = readFormData();
    console.log(rsvData);

    reportStatus('Sending reservation data...');
    console.log(URL + tripRsvId + "/reservations");
    axios.post(URL + tripRsvId + "/reservations", rsvData)
        .then((response) => {
            reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
            // clearForm();
        })
        .catch((error) => {
            console.log(error.response);
            if (error.response.data && error.response.data.errors) {
                reportAPIError(
                    `Encountered an error: ${error.message}`,
                    error.response.data.errors
                );
            } else {
                reportStatus(`Encountered an error: ${error.message}`);
            }
        });
};

$(document).ready(() => {
    $('.rsv-form').hide();
    $('#load').click(loadTrips);

    $('#trip-list').on('click', 'a', function(event){
        console.log(this.id);
        // event.preventDefault();
        loadDetails(this.id);
        $('.rsv-form').show();
        $("#reservation-form").addClass(`${this.id}`);
    });

    $('#reservation-form').submit(createRsv);

    $('.add-a-trip').on('click', () =>{
        $('.trip-form').show();
        addTrip();

    })

});