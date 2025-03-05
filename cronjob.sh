#!/bin/bash
node scripts/scrape.js
node scripts/processData.js
node scripts/compareData.js
node scripts/generateReport.js
