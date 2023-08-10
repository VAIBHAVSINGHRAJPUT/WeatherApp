const express = require('express');
const https = require('https');
const bodyParser = require("body-parser");
const router = express.Router();
const ejs = require("ejs");

// DYNAMIC DATE 
let fulldate = new Date();
let date = fulldate.getDate();
let day = fulldate.getDay();
let month = fulldate.getMonth();
let year = fulldate.getFullYear();

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let fullDate = `${date} ${months[month]}, ${year} | ${days[day]}`;
// console.log(fullDate);

// GET REQUEST 
router.get('/', (req, res) => {
    res.render("index",
        {
            humidity: '',
            windSpeed: '',
            pressure: '',
            maxTemp: '',
            CityName: 'City Name',
            Temp: '',
            dayTemp: '',
            dayTemp2: '',
            dayTemp3: '',
            forecastHumidity: '',
            forecastHumidity2: '',
            forecastHumidity3: '',
            forecaseWindSpeed: '',
            forecaseWindSpeed2: '',
            forecaseWindSpeed3: '',
            forecastPressure: '',
            forecastPressure2: '',
            forecastPressure3: '',
            desc: '',
            desc2: '',
            desc3: '',
            date: '',
            date2: '',
            date3: '',
            today: fullDate,
            year:year
        }
    );
});

// SEARCH BAR FORM REQUEST 
router.post('/', (req, res) => {
    const city = req.body.place;
    var apiKey = '90b4f089ab08eb34b991a30349e56221';
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=metric";

    https.get(url, (response) => {
        // console.log(url);
        var stat = response.statusCode;
        // console.log('statusCode:', response.statusCode);
        let rawdata = '';
        response.on('data', data => { rawdata += data });
        response.on('end', () => {
            if (stat === 200) {
                const weatherData = JSON.parse(rawdata);
                const today = weatherData.list[0];
                const dayOne = weatherData.list[8];
                const cityTemp = today.main.temp;
                const dayTwo = weatherData.list[16];
                const dayThree = weatherData.list[24];
                res.render('index', {
                    humidity: today.main.humidity + "%",
                    windSpeed: today.wind.speed + " m/s",
                    pressure: today.main.pressure + " hPa",
                    maxTemp: today.main.temp_max + "°C",
                    CityName: city,
                    Temp: cityTemp + "°C",
                    dayTemp: dayOne.main.temp + "°C",
                    dayTemp2: dayTwo.main.temp + "°C",
                    dayTemp3: dayThree.main.temp + "°C",
                    forecastHumidity: dayOne.main.humidity + "%",
                    forecastHumidity2: dayTwo.main.humidity + "%",
                    forecastHumidity3: dayThree.main.humidity + "%",
                    forecaseWindSpeed: dayOne.wind.speed + " m/s",
                    forecaseWindSpeed2: dayTwo.wind.speed + " m/s",
                    forecaseWindSpeed3: dayThree.wind.speed + " m/s",
                    forecastPressure: dayOne.main.pressure + " hPa",
                    forecastPressure2: dayTwo.main.pressure + " hPa",
                    forecastPressure3: dayThree.main.pressure + " hPa",
                    desc: dayOne.weather[0].description,
                    desc2: dayTwo.weather[0].description,
                    desc3: dayThree.weather[0].description,
                    date: dayOne.dt_txt,
                    date2: dayTwo.dt_txt,
                    date3: dayThree.dt_txt,
                    today: fullDate,
                    year: year
                });
            }else{
                res.redirect('/');
            }
        });
    })
});

module.exports = router;