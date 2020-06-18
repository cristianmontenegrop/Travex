// let i = 0
const citySearch = $("form.searchNow");
const cityInput = $("input.city-search");
const countryInput = $("input.country-search");
$(document).ready(() => {
  // jadamo 6/16/2020

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
      console.log(data);
      document.querySelector(".container-grid").innerHTML = "";
      // eslint-disable-next-line array-callback-return
      data.map(item => {
        document.querySelector(
          ".container-grid"
        ).innerHTML +=
          //  <div class="box">
          //       <div class="post-module">
          //       <div class="thumbnail">
          //           <div class="date">
          //               <div class="day">27</div>
          //               <div class="month">Mar</div>
          //           </div><img src=${item.image} />
          //       </div>
          //       <div class="post-content">
          //           <div class="category" id="${item.name.replace(/\s+/g, "-").toLowerCase()}" onclick="myFunction()">Add</div>
          //           <h1 class="title">${item.name}</h1>
                    
          //           <p class="description">${item.description}</p>
          //           <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
          //       </div>
          //       </div>
          //   </div>
                    ` <div class="card" style="width: 300px;">
                          <img src=${item.image}>
                          <div class="card-section">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                          </div>
                        </div>`;
      });
    });
  }
});
const activityArr = [];
// eslint-disable-next-line no-unused-vars
function myFunction() {
  if (
    sessionStorage.getItem("User") === null ||
    sessionStorage.getItem("User") === undefined ||
    sessionStorage.getItem("User") === ""
  ) {
    activityArr.push(event.target.id);
    const tripData = {
      // user: sessionStorage.getItem('User').replace(/\s+/g, '-').toLowerCase(),
      country: countryInput,
      city: cityInput,
      // eslint-disable-next-line camelcase
      Activity_1: event.target.id
    };
    console.log(activityArr);
    if (activityArr.length === 5) {
      alert("Exceeded 5");
    }
    $.post("/api/trips", tripData);
  } else {
    alert("Error! Please login to continue");
  }
}
