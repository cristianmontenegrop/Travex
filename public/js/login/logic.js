$(document).ready(() => {
    $.get('/google-data', data => {
        console.log('google' + data)
        if (data) {
            sessionStorage.setItem('Data', data)
            // $('.profile-header').addClass('reveal')
            // $('.profile-header').attr('src', data.photos[0].value);
            // $('.login').replaceWith(` <li><a href="#footer">${data.name.givenName}'s Trips</a></li>`)
        }
    })
    $.get('/github-data', data => {
        console.log('github' + data)
        if (data) {
            sessionStorage.setItem('Data', data)
            console.log(data)
            // $('.profile-header').addClass('reveal')
            // $('.profile-header').attr('src', data.photos[0].value);
            // $('.login').replaceWith(` <li><a href="/trips">${data.displayName}'s Trips</a></li>`)
        }
    })
})

window.fbAsyncInit = () => {
    FB.init({
        appId: '2597657447149490',
        cookie: true,
        xfbml: true,
        version: 'v7.0'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
    console.log(response);
});