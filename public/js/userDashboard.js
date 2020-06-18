let i = 0
const citySearch = $("form.searchNow");
const cityInput = $("input.city-search")
const countryInput = $("input.country-search")
var userData= {};
var globalData= {};

$(document).ready(() => {

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(data => {
        console.log(data);
        userData = data;
        $(".username").text("Welcome, " + data.first + "!");
    });
    // Event Handler for axisOTM query:
    citySearch.on("submit", event => {
        event.preventDefault();
        console.log("click")
        const search = {
            city: cityInput.val().trim(),
            country: countryInput.val().trim()
        };

        if (!search.city) {
            return;
        }
        console.log(search.city);
        getCitySearch(search.city)

    });

    function getCitySearch(city) {
        $.get("/api/user_data/"+city, function (data) {
            console.log(data);
            globalData = data
            document.querySelector('.container-grid').innerHTML = "";
            data.map(item => {
                document.querySelector('.container-grid').innerHTML +=
                    `<div class="box">
                    <div class="post-module">
                    <div class="thumbnail">
                        <div class="date">
                            <div class="day">27</div>
                            <div class="month">Mar</div>
                        </div><img src=${item.image} />
                    </div>
                    <div class="post-content">
                        <div class="category" id="${(item.name).replace(/\s+/g, '-').toLowerCase()}" onclick="myFunction()">Add</div>
                        <h1 class="title">${item.name}</h1>
                        
                        <p class="description">${item.description}</p>
                        <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
                    </div>
                    </div>
                </div>`
            })

            $('.category').click(function (event) {

                // Don't follow the link
                event.preventDefault();
            
                // Log the clicked element in the console
                console.log(event.target);
                console.log("global data", globalData)
                var eventData = [];
 
            
            });



            //   var rowsToAdd = [];
            //   for (var i = 0; i < data.length; i++) {
            //     rowsToAdd.push(createAuthorRow(data[i]));
            //   }
            //   renderAuthorList(rowsToAdd);
            //   nameInput.val("");
        });
    }
    activityArr = [];
    // event handler


    function isClicked() {
        i++

    }

})

function myFunction(item) {
    console.log("clicky")
    console.log(item)
    if (sessionStorage.getItem('User') == null || sessionStorage.getItem('User') == undefined || sessionStorage.getItem('User') == '') {
        // activityArr.push(event.target.id);
        // let tripData = {
        //     Trip_ID: 1,
        //     // User_id: sessionStorage.getItem('User').replace(/\s+/g, '-').toLowerCase(),
        //     Country: countryInput,
        //     City: cityInput,
        //     Activity_1: event.target.id,

        // }
        // console.log(activityArr);
        // if (activityArr.length === 5) {
        //     alert("Exceeded 5");
        // }
        // $.post("/api/activities", tripData)
        console.log("item:",item);
        $.post("/api/activities",{
            User_id: userData.id,
            Country: item.country,
            City: item.city,
            ImageURL: item.image,
            Description: item.description
        }).then(data => {
            console.log(data);
            console.log("userData is:", userData);
        });
    } else {
        alert('Error! Please login to continue')
    }

}

// $(document).load(() => {
    // if ($('.country-search').val() !== '' || $('.country-search').val() !== null && $('.city-search').val() !== '' || $('.city-search').val() !== null) {
    //     var country = $('.city-search').val().replace(/\s+/g, '-').toLowerCase();
    //     var city = $('.city-search').val().replace(/\s+/g, '-').toLowerCase();
    //     $('/api/things-to-do/' + country + '/' + city, trips_data => {
    //         if (trips_data) {
    //             $('/api/pictures/' + city, pictures_data => {
    //                 let i = 0;
    //                 while (i < trips_data.length - 1) {
    //                     trip_data.map(item => {
    //                         document.querySelector('.container-grid').innerHTML +=
    //                             `
    //                         <div class="box">
    //                             <div class="post-module">
    //                             <div class="thumbnail">
    //                                 <div class="date">
    //                                     <div class="day">27</div>
    //                                     <div class="month">Mar</div>
    //                                 </div><img src="${pictures_data[0][(i)].urls.full}" />
    //                             </div>
    //                             <div class="post-content">
    //                                 <div class="category" id="${(item[0][(i)].properties.name).replace(/\s+/g, '-').toLowerCase()}" onclick="myFunction()">Add</div>
    //                                 <h1 class="title"></h1>
    //                                 <h2 class="sub_title">${city},  ${country}</h2>
    //                                 <p class="description">New York, the largest city in the U.S., is an architectural marvel with plenty of historic monuments, magnificent buildings and countless dazzling skyscrapers.</p>
    //                                 <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
    //                             </div>
    //                             </div>
    //                         </div>
    //                     `
    //                     })
    //                     i++
    //                 }
    //             })
    //         }
    //         else {
    //             document.querySelector('.container-grid').innerHTML = 'We do not service this city at the moment. Please try again later. '
    //         }
    //     })
    // }


// })




