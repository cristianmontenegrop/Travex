$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(data => {
        console.log(data);
        $(".username").text("Welcome, " + data.username + "!");
    });
});

$(document).load(() => {
    if ($('.country-search').val() !== '' || $('.country-search').val() !== null && $('.city-search').val() !== '' || $('.city-search').val() !== null) {
        var country = $('.city-search').val().replace(/\s+/g, '-').toLowerCase();
        var city = $('.city-search').val().replace(/\s+/g, '-').toLowerCase();
        $('/api/things-to-do/' + country + '/' + city, trips_data => {
            if (trips_data) {
                $('/api/pictures/' + city, pictures_data => {
                    let i = 0;
                    while (i < trips_data.length - 1) {
                        trip_data.map(item => {
                            document.querySelector('.container-grid').innerHTML +=
                                `
                          <div class="box">
                              <div class="post-module">
                              <div class="thumbnail">
                                  <div class="date">
                                      <div class="day">27</div>
                                      <div class="month">Mar</div>
                                  </div><img src="${pictures_data[0][(i)].urls.full}" />
                              </div>
                              <div class="post-content">
                                  <div class="category" id="${(item[0][(i)].properties.name).replace(/\s+/g, '-').toLowerCase()}" onclick="myFunction()">Add</div>
                                  <h1 class="title"></h1>
                                  <h2 class="sub_title">${city},  ${country}</h2>
                                  <p class="description">New York, the largest city in the U.S., is an architectural marvel with plenty of historic monuments, magnificent buildings and countless dazzling skyscrapers.</p>
                                  <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
                              </div>
                              </div>
                          </div>
                      `
                        })
                        i++
                    }
                })
            }
            else {
                document.querySelector('.container-grid').innerHTML = 'We do not service this city at the moment. Please try again later. '
            }
        })
    }
})

function myFunction() {
    if (sessionStorage.getItem('User') == null || sessionStorage.getItem('User') == undefined || sessionStorage.getItem('User') == '') {
        let tripData = {
            user: sessionStorage.getItem('User').replace(/\s+/g, '-').toLowerCase(),
            country: country.replace(/\s+/g, '-').toLowerCase(),
            city: city[0].replace(/\s+/g, '-').toLowerCase(),
            activity_one: event.target.id,

        }
        $.post("/api/trips", tripData)
    } else {
        alert('Error! Please login to continue')
    }

}





