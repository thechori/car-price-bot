# Car Price Bot

Node.js script that will monitor cars of interest and notify via Twilio when prices have changed

## Setup

1. Be sure to setup the `.env` file to properly configure Twilio notifications

2. Setup cronjob for script to run once a day at 6:45am

- `$ crontab -e`
- `45 6 * * * path/to/node /path/to/car-price-bot/index.js`
