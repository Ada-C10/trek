const URL =  "https://trektravel.herokuapp.com/trips";




$(document).ready(() => {
    $('#load').click(loadTrips);
    $('#trip-form').submit(createTrip);
});