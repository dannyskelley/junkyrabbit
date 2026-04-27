module.exports = {
    isProduction: process.env.ELEVENTY_ENV === "PROD",
    port: 5000,
    host: "0.0.0.0",
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
};
