const URL =  "https://trektravel.herokuapp.com/trips";

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
    console.log(URL + "/" + id);
    axios.get(URL + "/" + id)
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



$(document).ready(() => {
    $('.rsvp-form').hide();
    $('#load').click(loadTrips);


    $('#trip-list').on('click', 'a', function(event){
        console.log(this.id);
        // event.preventDefault();
        loadDetails(this.id);
        $('.rsvp-form').show();

        // $("button").click(function(){
    });
});