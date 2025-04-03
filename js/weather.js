async function getIPAndLocation() {
  const ipElement = document.getElementById("ip");
  ipElement.innerText = "Fetching your IP address and location...";

  try {
    // Fetch the IP address using ipify API
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    if (!ipResponse.ok) {
      throw new Error(`HTTP error! Status: ${ipResponse.status}`);
    }

    const ipData = await ipResponse.json();
    // console.log(ipData);

    const ipAddress = ipData.ip;
    // FETCH THE LOCATION USING THE IP ADDRESS
    const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
    if (!locationResponse.ok) {
      throw new Error(`HTTP error! Status: ${locationResponse.status}`);
    }
    console.log(locationResponse);

    const locationData = await locationResponse.json();
    const { lat, lon, city } = locationData;
    console.log(locationData);

    ipElement.innerText = `
      Location: ${city}    `;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,wind_speed_10m_max,rain_sum&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`
    ).then((res) =>
      res.json().then((data) => {
        function checkmainweather() {
          if (data.current.rain == 0) {
            weatherstate = "sun";
          } else if (data.current.rain < 1) {
            weatherstate = "cloud";
          } else if (data.current.rain < 5) {
            weatherstate = "sun-cloud";
          } else if (data.current.rain >= 5) {
            weatherstate = "cloud-thunder";
          }
        }
        checkmainweather();

        document.getElementById("mainicon").src =
          "../images/weathericons/" + weatherstate + ".gif";
        let currentweather = data.current;
        console.log(data, currentweather);
        document.getElementById("temp").innerHTML =
          currentweather.temperature_2m;
        document.getElementById("humidity").innerHTML =
          currentweather.relative_humidity_2m;
        document.getElementById("wind").innerHTML =
          currentweather.wind_speed_10m;
        document.getElementById("rain").innerHTML = currentweather.rain;
        let dailydata = data.daily;
        console.log(dailydata);
        let dailyweatherrain = data.daily.rain_sum;
        let dailyweatherwind = data.daily.wind_speed_10m_max;
        let dailyweathertemp = data.daily.temperature_2m_max;
        console.log(dailyweatherrain, dailyweatherwind, dailyweathertemp);
        document.getElementById("weekweather").innerHTML = "";
        let currentdate = dailydata.time.map((dateStr) => {
          const [year, month, day] = dateStr.split("-");
          return `${day}-${month}`; // Format: "DD-MM"
        });
        for (let i = 0; i < 6; i++) {
          let weatherdailyicon;
          function checkdailyweather() {
            if (dailyweatherrain[i] == 0) {
              weatherdailyicon = "sun";
            } else if (dailyweatherrain[i] < 1) {
              weatherdailyicon = "cloud";
            } else if (dailyweatherrain[i] < 5) {
              weatherdailyicon = "sun-cloud";
            } else if (dailyweatherrain[i] >= 5) {
              weatherdailyicon = "cloud-thunder";
            }
          }
          checkdailyweather();
          let weathericonurl =
            "../images/weathericons/" + weatherdailyicon + ".gif";
          console.log(weathericonurl);
          let dailycard = document.createElement("div");
          dailycard.classList.add("weekweathercard");

          dailycard.innerHTML = `<h5>${currentdate[i]}</h5><div class="weekweatherframe">
                <img src="${weathericonurl}" alt="" />
              </div>
              <div class="weekweathertemp">
                <h4>
                  <div class="weekweathericontemp">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M136,153V88a8,8,0,0,0-16,0v65a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,128,200Zm40-66V48a40,40,0,0,0-80,0v86a64,64,0,1,0,80,0Zm-40,98a48,48,0,0,1-27.42-87.4A8,8,0,0,0,104,138V48a24,24,0,0,1,48,0v90a8,8,0,0,0,3.42,6.56A48,48,0,0,1,128,232Z"
                      ></path>
                    </svg>
                  </div>
                  <span>${dailyweathertemp[i]}</span>
                  <span>&#8451;</span>
                </h4>
              </div>
              <div class="weekweatherrain">
                <h4>
                  <div class="weekweathericonrain">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"></path></svg>
                  </div>
                  <span>${dailyweatherrain[i]}</span>
                  <span>&#37;</span>
                </h4>
              </div>`;

          document.getElementById("weekweather").appendChild(dailycard);
        }
      })
    );
  } catch (error) {
    ipElement.innerText =
      "Failed to fetch IP address or location. Please try again later.";
    console.error("Error fetching IP address or location:", error);
  }
}

getIPAndLocation();

/*
1. krijimi i nje array me vetem adresat e ikonave
2. marrja e kohes per gjithe javen
3. vendosja e search per location
*/
