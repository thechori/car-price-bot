const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const cars = require("./cars");

cars.map(async car => {
  const response = await axios.get(car.url);

  if (response.status !== 200) {
    return console.log("Error in fetching HTML");
  }

  const html = response.data;
  const $ = cheerio.load(html);
  const price = $(".price").text();

  try {
    if (fs.existsSync(`prices/${car.filename}`)) {
      // File exists, check for price change
      console.log("file exists");

      fs.readFile(`prices/${car.filename}`, "utf-8", (err, content) => {
        if (err) return console.log("error: ", err);
        console.log("Previous price: ", content);
        console.log("New price: ", price);

        // Update price if there was a change
        if (content === price) {
          console.log("There was no price change, skipping file update...");
        } else {
          console.log("There was a price change! Updating...");
        }
      });
    } else {
      // No file exists
      console.log("No file exists, updating!");
      updatePrice(car);
    }
  } catch (error) {
    console.log("something happened");
    return console.log(error);
  }
});

function updatePrice(car, newPrice) {
  fs.writeFile(`prices/${car.filename}`, newPrice, err => {
    if (err) return console.log(err);
    console.log("successfully wrote to file");
  });
}
