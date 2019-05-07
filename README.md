# Car Price Bot

Node.js script that will monitor cars of interest and notify via Twilio when prices have changed

## Requirements

- You must setup a [Twilio account](https://www.twilio.com/try-twilio) for text message notifications

## Setup

1. Rename `cars.example.js` to `cars.js` and populate with cars of interest (`desiredPrice` is optional -- if this value is set, notifications will only be sent if the post's price is _BELOW_ or _EQUAL_ to the value)

1. Setup the `.env` file to properly configure Twilio notifications

1. Setup cronjob for script to run once a day at 6:45am

- `$ crontab -e`
- `45 6 * * * path/to/node /path/to/car-price-bot/index.js`
