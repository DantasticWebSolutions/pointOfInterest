async function add_recomendations(poi_id, region) {
  try {
    // Fetch api without need to reload or open a new link
    const response = await fetch(`/recom/${poi_id}`);
    // Convert the response to json
    const result = await response.json();
    if (result.length === 0) {
      alert(
        `There isn't any data for: ${region}. Try searching for London or Milan`
      );
    } else {
      // Update details by calling function
      ajaxSearch(region);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function ajaxSearch(region) {
  try {
    // Capitalize region
    const lower = region.toLowerCase();
    const first = region.charAt(0).toUpperCase();
    const new_region = first + lower.slice(1);

    const response = await fetch(`/poi/${new_region}`);
    const poi_data = await response.json();

    // Check if there is documents for the region searched
    if (poi_data.length === 0) {
      alert(
        `There isn't any data for: ${new_region}. Try searching for London or Milan`
      );
    } else {
      // Create averages for coordinates to get the best position for the map (in the middle of the points )
      let latavg = 0.0,
        lonavg = 0.0;

      // Loop through the array of JSON objects and add the results to averages
      poi_data.forEach((location) => {
        // Add new coordinates to average
        latavg = latavg + location.lat;
        lonavg = lonavg + location.lon;
      });

      // Divide by number of point of interest to get the average
      latavg = latavg / poi_data.length;
      lonavg = lonavg / poi_data.length;

      // Remove previous map
      var div = document.getElementById("map1");
      div.remove();

      // Create a new map with the same id
      var div = document.createElement("div");
      div.id = "map1";
      div.class = "center";
      document.body.appendChild(div);
      // Set new Map with average coordinates
      var map = L.map("map1").setView([latavg, lonavg], 14);
      mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; " + mapLink + " Contributors",
        maxZoom: 18,
      }).addTo(map);
      // Add Markers for each poi inside the databse
      for (var i = 0; i < poi_data.length; i++) {
        var popup = L.popup();
        // When marker is clicked the popup will open at the correct coordinates
        function onMarkerClick(e) {
          popup.setLatLng(e.latlng).openOn(map);
        }

        // Set a marker on the map for the current poi_data coordinates
        var marker = L.marker([poi_data[i].lat, poi_data[i].lon])
          .addTo(map)
          .on("click", onMarkerClick);
        // Set up the link to be used inside the PopUp
        var linkr = "/review/" + poi_data[i].poi_id;

        // Set Content of the markers and link to review page for each one
        marker.addTo(map).bindPopup(
          `<div class="popUpLinkTitle">${poi_data[i].name} </div> <br/> <div class="popUpLinkDescription">${poi_data[i].description}</div> <br/><div class="popUpLinkTitle">${poi_data[i].recomendations} likes</div>
					  <a href="${linkr}" class="popUpLink" target="_blank" rel="noopener noreferrer nofollow ugc">
					  Show Reviews
					  </a>`
        );
      }

      //MAP CLICK
      function onMapClick(e) {
        const elat = JSON.stringify(e.latlng.lat);
        const lat = elat.slice(0, 8);
        // alert(lat);

        const elon = JSON.stringify(e.latlng.lng);
        const lon = elon.slice(0, 9);
        // alert(lon);

        var link = `http://localhost:8000/addpoi/${lat}/${lon}`;
        // alert(link);
        window.open(link);
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
      }

      map.on("click", onMapClick);

      // PRINT DATA
      print_details(poi_data);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function print_details(data) {
  // Delete data already in div
  var div = document.getElementById("show_data");
  div.remove();
  // Create new div where to add the data divs
  var result = document.createElement("div");
  result.id = "show_data";
  result.class = "show_data";
  document.body.appendChild(result);

  for (var i = 0; i < data.length; i++) {
    // The data is expressed like this:
    // _id,name,type,country,region,lon,lat,description,recomendations,poi_id,__v

    // For each data object print card div element
    result.innerHTML += `<div class="card"><h2> ${data[i].name}</h2><br/>
		  <p> ${data[i].region}, ${data[i].country} </p>
		  <p> ${data[i].lat} / ${data[i].lon}</p>
		  <p> ${data[i].type} </ p>
		  <p> ${data[i].description} </p>
		  <h2 class="alignCenter"> ${data[i].recomendations} <br/><span class="txtRecom">recommendations</span></h2>
		  <div class="buttonContainer">
			  <form class='recomendation' action="javascript:add_recomendations(${data[i].poi_id}, '${data[i].region}')">
				  <button type="submit" class="btnRecom"> 
				  Recommend
				  </button>
			  </form>
			  <form class='recomendation'">
			  <button type="submit" class="btnRecom"> 
				  <a href="/review/${data[i].poi_id}">
						  Reviews
						  </a>
					  </button>
			  </form>
		  </div>
		  </div>`;
  }
}

function showMap() {
  // MARKER CLICK

  var popup = L.popup();
  function onMarkerClick(e) {
    popup.setLatLng(e.latlng).setContent("Solent University").openOn(map);
  }

  const pos = [51.518037, -0.112707];
  const map = L.map("map1").setView(pos, 13);
  const attrib =
    "Map data copyright OpenStreetMap contributors, Open DatabaseLicence";
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: attrib,
  }).addTo(map);
  // L.marker(pos).addTo(map).bindPopup('Solent University').openPopup().on('click', onMarkerClick);
  L.marker(pos)
    .addTo(map)
    .bindPopup(`Solent University `)
    .on("click", onMarkerClick);

  //MAP CLICK
  function onMapClick(e) {
    const elat = JSON.stringify(e.latlng.lat);
    const lat = elat.slice(0, 8);
    // alert(lat);

    const elon = JSON.stringify(e.latlng.lng);
    const lon = elon.slice(0, 9);
    // alert(lon);

    var link = `http://localhost:8000/addpoi/${lat}/${lon}`;
    // alert(link);
    window.open(link);
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
  }

  map.on("click", onMapClick);
}
function openNav() {
  if (
    // Check if width of id is 0 or 0px

    document.getElementById("openedTab").style.width == 0 ||
    document.getElementById("openedTab").style.width == "0px"
  ) {
    // Set width to 250
    document.getElementById("openedTab").style.width = 250;
    // Add class to id
    document.getElementById("floatingButton").classList.add("open");
  } else if (
    // Check if width of id is 250 or 250px
    document.getElementById("openedTab").style.width == 250 ||
    document.getElementById("openedTab").style.width == "250px"
  ) {
    // Set width to 0
    document.getElementById("openedTab").style.width = 0;
    // Remove class from id
    document.getElementById("floatingButton").classList.remove("open");
  }
}

function validateForm() {
  var a = document.forms["Form"]["name"].value;
  var b = document.forms["Form"]["type"].value;
  var c = document.forms["Form"]["region"].value;
  var d = document.forms["Form"]["country"].value;
  var e = document.forms["Form"]["lat"].value;
  var f = document.forms["Form"]["lon"].value;
  var g = document.forms["Form"]["description"].value;
  var h = document.forms["Form"]["recommendations"].value;
  if (
    (a == null || a == "",
    b == null || b == "",
    c == null || c == "",
    d == null || d == "",
    typeof e === "number" || e == null || e == "",
    typeof f === "number" || f == null || f == "",
    g == null || g == "",
    h == null || h == "")
  ) {
    alert("Please Fill All Required Field");
    return false;
  }
}
