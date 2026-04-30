/**
 * googleRating.js
 *
 * Eleventy global data file.
 * Fetches the live ratingValue and reviewCount from the Google Places API
 * at build time so the aggregateRating schema always reflects real numbers.
 *
 * Requires two environment secrets:
 *   GOOGLE_PLACES_API_KEY  — a Places API key with Places Details enabled
 *   GOOGLE_PLACE_ID        — the Place ID for the Google Business Profile
 *                            (e.g. ChIJ…)  Find it at:
 *                            https://developers.google.com/maps/documentation/places/web-service/place-id
 *
 * If either secret is missing, or if the API call fails for any reason,
 * the file falls back to the static values in client.json so the build
 * never breaks.
 */

const https = require("https");
const path  = require("path");
const fs    = require("fs");

function getStaticFallback() {
    const clientPath = path.join(__dirname, "client.json");
    const client = JSON.parse(fs.readFileSync(clientPath, "utf8"));
    return {
        ratingValue: client.rating.ratingValue,
        reviewCount: client.rating.reviewCount,
        bestRating:  client.rating.bestRating,
        source:      "static",
    };
}

const TIMEOUT_MS = 8000;

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error("Failed to parse Google Places API response"));
                }
            });
        });

        req.setTimeout(TIMEOUT_MS, () => {
            req.destroy(new Error(`Google Places API request timed out after ${TIMEOUT_MS}ms`));
        });

        req.on("error", reject);
    });
}

module.exports = async function () {
    const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
        console.log("[googleRating] API key or Place ID not set — using static client.json values.");
        return getStaticFallback();
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json`
        + `?place_id=${encodeURIComponent(placeId)}`
        + `&fields=rating,user_ratings_total`
        + `&key=${encodeURIComponent(apiKey)}`;

    try {
        const json = await fetchJson(url);

        if (json.status !== "OK") {
            console.warn(`[googleRating] Places API returned status "${json.status}" — using static fallback.`);
            return getStaticFallback();
        }

        const result = json.result || {};
        const rating = typeof result.rating === "number" ? result.rating : null;
        const count  = typeof result.user_ratings_total === "number" ? result.user_ratings_total : null;

        if (rating === null || count === null) {
            console.warn("[googleRating] Places API response missing rating or user_ratings_total — using static fallback.");
            return getStaticFallback();
        }

        const fallback = getStaticFallback();
        console.log(`[googleRating] Live data fetched — rating: ${rating}, reviewCount: ${count}`);

        return {
            ratingValue: rating,
            reviewCount: count,
            bestRating:  fallback.bestRating,
            source:      "google",
        };
    } catch (err) {
        console.warn(`[googleRating] API fetch failed (${err.message}) — using static fallback.`);
        return getStaticFallback();
    }
};
