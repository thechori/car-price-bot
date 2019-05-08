require("dotenv").config();
const program = require("commander");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const cars = require("./cars");

// Initialize Twilio client
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

program.option("-v --verbose");
program.parse(process.argv);

const { verbose } = program;

verbose && console.log("*** VERBOSE MODE ***");

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
      verbose && console.log(`Found existing price for ${car.description}.`);

      // Read file content
      fs.readFile(`prices/${car.filename}`, "utf-8", (err, oldPrice) => {
        if (err) return console.log("error: ", err);

        verbose && console.log("Previous price: ", oldPrice);
        verbose && console.log("New price: ", newPrice);

        // Check for a price change
        if (oldPrice === newPrice) {
          verbose &&
            console.log("There was no price change, skipping file update...");
        } else {
          verbose && console.log("There was a price change! Updating...");
          updatePrice(car, newPrice);
        }
      });
    } else {
      // No file exists
      verbose && console.log("No file exists, updating!");
      updatePrice(car, newPrice);
    }
  } catch (error) {
    return console.log(error);
  }
});

function updatePrice(car, newPrice) {
  fs.writeFile(`prices/${car.filename}`, newPrice, err => {
    if (err) return console.log(err);
    verbose && console.log("Successfully updated text file with new price.");

    // Check for lower price
    if (car.desiredPrice) {
      verbose &&
        console.log(
          "Found a desired price, checking to see if the new price falls beneath it..."
        );
      // Parse dollar string values for comparison
      if (parseDollarString(newPrice) <= parseDollarString(car.desiredPrice)) {
        // Found a price equal to or lower than desired price
        verbose && console.log("Desired price met!");
        sendText(car, newPrice);
      } else {
        // Price is not lower, do nothing
        verbose && console.log("Desired price not met...");
      }
    } else {
      // User did not specify a `desiredPrice`, always send a text on price change
      sendText(car, newPrice);
    }
  });
}

function sendText(car, newPrice) {
  verbose && console.log("Sending a text to ", process.env.CLIENT_PHONE_NUMBER);
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.CLIENT_PHONE_NUMBER,
      body: `${car.description}: Price updated to ${newPrice}. Check it out: ${
        car.url
      }`
    })
    .then(message => console.log("Sent text: ", message.sid))
    .catch(error => console.log("Error: ", error));
}

// Example input: "$15000"
// Example output: "15000"
function parseDollarString(input) {
  return input.split("$")[1];
}
