#!/bin/bash

# Navigate to script directory
cd /root/scrapping_script/

# Run the scraper and save logs
node src/scrap.js >> logs/scraper.log 2>&1
