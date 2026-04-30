#!/usr/bin/env node
/**
 * update-reviews.js
 *
 * Updates the reviewCount (and optionally ratingValue) in src/_data/client.json.
 *
 * Run whenever new reviews come in on Google or Nextdoor:
 *
 *   npm run update-reviews -- --count 8
 *   npm run update-reviews -- --count 9 --rating 4.9
 *
 * Where to find the numbers:
 *   - Google: https://www.google.com/maps/place/Junky+Rabbit+Labor  (star count shown on listing)
 *   - Nextdoor: https://nextdoor.com/profile/01fYx_9bKZFb2nLMK/
 *   - Add the two counts together for the total reviewCount.
 */

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', '_data', 'client.json');

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--count'  && argv[i + 1]) args.count  = argv[++i];
        if (argv[i] === '--rating' && argv[i + 1]) args.rating = argv[++i];
    }
    return args;
}

const args = parseArgs(process.argv.slice(2));

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const currentCount  = data.rating.reviewCount;
const currentRating = data.rating.ratingValue;

if (!args.count && !args.rating) {
    console.log('\nCurrent review data in client.json:');
    console.log(`  reviewCount  : ${currentCount}`);
    console.log(`  ratingValue  : ${currentRating}`);
    console.log(`  bestRating   : ${data.rating.bestRating}`);
    console.log('\nUsage:');
    console.log('  npm run update-reviews -- --count <total>');
    console.log('  npm run update-reviews -- --count <total> --rating <avg>\n');
    console.log('Add Google reviews + Nextdoor reviews to get the total count.');
    process.exit(0);
}

let changed = false;

if (args.count !== undefined) {
    const newCount = parseInt(args.count, 10);
    if (isNaN(newCount) || newCount < 0) {
        console.error('Error: --count must be a non-negative integer.');
        process.exit(1);
    }
    data.rating.reviewCount = newCount;
    console.log(`reviewCount: ${currentCount} → ${newCount}`);
    changed = true;
}

if (args.rating !== undefined) {
    const newRating = parseFloat(args.rating);
    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
        console.error('Error: --rating must be a number between 1 and 5.');
        process.exit(1);
    }
    data.rating.ratingValue = newRating;
    console.log(`ratingValue: ${currentRating} → ${newRating}`);
    changed = true;
}

if (changed) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4) + '\n', 'utf8');
    console.log('\nclient.json updated. Rebuild the site to publish the change.');
}
