# Car Price Bot

Node.js script that will monitor cars of interest and notify via Twilio when prices have changed

## Requirements

- [Node.js 10+](https://nodejs.org/en/)

- You must setup a [Twilio account](https://www.twilio.com/try-twilio) for text message notifications

## Setup

1. Rename `cars.example.js` to `cars.js` and populate with cars of interest (`desiredPrice` is optional -- if this value is set, notifications will only be sent if the post's price is _BELOW_ or _EQUAL_ to the value)

1. Rename `.env.example` to `.env` and configure using your Twilio account settings

1. Setup cronjob for script to run at desired times (_below example is everyday at 6:45am_)

- `$ crontab -e`
- `45 6 * * * path/to/node /path/to/car-price-bot/index.js`

## Notes

This script was only tested with [Craigslist cars & trucks postings](https://houston.craigslist.org/d/cars-trucks/search/cta) and was verified on **2019/05/07**.

The `-v` or `--verbose` argument can be passed to the node script (or accessed via the `verbose` npm script) in order to print informative logs.
