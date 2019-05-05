const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const cars = require("./cars");

cars.map(async car => {
  const response = await axios.get(car.url);
  console.log(response);

  if (response.status !== 200) {
    return console.log("Error in fetching HTML");
  }

  const html = response.data;
  const $ = cheerio.load(html);

  const price = $(".price").text();
  console.log("Price: ", price);

  fs.writeFile("sc300.txt", html, err => {
    if (err) return console.log(err);
    console.log("successfully wrote to file");
  });
});
