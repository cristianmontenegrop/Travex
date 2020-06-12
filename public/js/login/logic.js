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
}