// let i = 0;
const citySearch = $("form.searchNow");
const cityInput = $("input.city-search");
let userData = {};
let globalData = {};
let dataArr = [];
// const eventData = [];
// const activityArr = [];

$(document).ready(() => {
  $.get("/api/user_data").then(data => {
    console.log(data);
    userData = data;
    $(".username").text("Welcome, " + data.first + "!");

    // $.get("/api/activities/" + userData.id, response => {
    //   console.log("Activities", response);
    //   console.log("UserData:", userData.id);
    //   $("#Activity1").text("City: " + response[0].City);
    //   $("#Activity1").append("<br/>Description: " + response[0].Description);
    //   $("#Activity2").text("City: " + response[1].City);
    //   $("#Activity2").append("<br/>Description: " + response[1].Description);
    //   $("#Activity3").text("City: " + response[2].City);
    //   $("#Activity3").append("<br/>Description: " + response[2].Description);
    // });

    $.get("/api/activities/" + userData.id, response => {
      console.log("Response", response);

      let i = 0;
      document.querySelector(".container-grid").innerHTML = "";
      // eslint-disable-next-line array-callback-return
      response.map(item => {
        document.querySelector(
          ".grid-x"
        ).innerHTML += `
        <div class="cell">
                <img class="thumbnail" src=${item.ImageURL} />
                <h5>${item.City}, ${item.Country}</h5>
        </div>`;
        i += 1;
      });
    });

    
  });

  // Event Handler for axisOTM query:
  citySearch.on("submit", event => {
    event.preventDefault();
    console.log("click");
    const search = {
      city: cityInput.val().trim()
    };

    if (!search.city) {
      return;
    }
    console.log(search.city);
    getCitySearch(search.city);
  });

  function getCitySearch(city) {
    $.get("/api/user_data/" + city, data => {
      dataArr = data;
      let i = 0;
      console.log(data);
      globalData = data;
      document.querySelector(".container-grid").innerHTML = "";
      // eslint-disable-next-line array-callback-return
      data.map(item => {
        document.querySelector(
          ".container-grid"
        ).innerHTML += 
        // `<div class="box">
        //         <div class="post-module">
        //         <div class="thumbnail">
        //             <div class="date">
        //                 <div class="day">27</div>
        //                 <div class="month">Mar</div>
        //             </div><img src=${item.image} />
        //         </div>
        //         <div class="post-content">
        //             <div class="category" id="${(item.name).replace(/\s+/g, '-').toLowerCase()}" onclick="myFunction(${i})">Add</div>
        //             <h1 class="title">${item.name}</h1>
                    
        //             <p class="description">${item.description}</p>
        //             <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
        //         </div>
        //         </div>
        //     </div>`
            `<div class="card" style="width: 300px;">
               <img src=${item.image}>
              <div class="card-section">
               <h4>${item.name}</h4>
               
                <p>${item.description}</p>
                <div class="category buttonColor" id="${(item.name).replace(/\s+/g, '-').toLowerCase()}" onclick="myFunction(${i})">Add</div>
             </div>
            </div>`;
        i += 1;
      });

      $(".category").click(event => {
        // Don't follow the link
        event.preventDefault();
        // Log the clicked element in the console
        console.log(event.target);
        console.log("global data", globalData);
      });
    });
  }

  //   function isClicked() {
  //     i++;
  //   }
});

// eslint-disable-next-line no-unused-vars
function myFunction(item) {
  console.log("clicky");
  console.log(item);
  console.log("data arr: ", dataArr[item]);
  if (
    sessionStorage.getItem("User") === null ||
    sessionStorage.getItem("User") === undefined ||
    sessionStorage.getItem("User") === ""
  ) {
    $.post("/api/activities", {
      // eslint-disable-next-line camelcase
      User_id: userData.id,
      Country: dataArr[item].country,
      City: dataArr[item].city,
      ImageURL: dataArr[item].image,
      Description: dataArr[item].description
    }).then(data => {
      console.log(data);
      console.log("userData is:", userData);
    });
  } else {
    alert("Error! Please login to continue");
  }
}
