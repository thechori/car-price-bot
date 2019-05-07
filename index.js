require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const cars = require("./cars");

// Initialize Twilio client
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Loop through each car in the `cars.js` file
cars.map(async car => {
  console.log(`Checking price for ${car.description}...`);

  const response = await axios.get(car.url);

  if (response.status !== 200) {
    return console.log("Error in fetching HTML");
  }

  // Grab price from post
  const html = response.data;
  const $ = cheerio.load(html);
  const newPrice = $(".price").text();

  try {
    // Check if file exists
    if (fs.existsSync(`prices/${car.filename}`)) {
      console.log(`Found existing price for ${car.description}.`);

      // Read file content
      fs.readFile(`prices/${car.filename}`, "utf-8", (err, oldPrice) => {
        if (err) return console.log("error: ", err);

        console.log("Previous price: ", oldPrice);
        console.log("New price: ", newPrice);

        // Update price if there was a change
        if (oldPrice === newPrice) {
          console.log("There was no price change, skipping file update...");
        } else {
          console.log("There was a price change! Updating...");
          updatePrice(car, newPrice);
        }
      });
    } else {
      // No file exists
      console.log("No file exists, updating!");
      updatePrice(car, newPrice);
    }
  } catch (error) {
    return console.log(error);
  }
});

function updatePrice(car, newPrice) {
  fs.writeFile(`prices/${car.filename}`, newPrice, err => {
    if (err) return console.log(err);
    console.log("Successfully updated text file with new price.");
    sendText(car, newPrice);
  });
}

function sendText(car, newPrice) {
  console.log("Sending a text to ", process.env.CLIENT_PHONE_NUMBER);
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.CLIENT_PHONE_NUMBER,
      body: `${car.description}: Price change to ${newPrice}. Check it out: ${
        car.url
      }`
    })
    .then(message => console.log("Sent text: ", message.sid))
    .catch(error => console.log("TWILIO ERROR: ", error));
}
