import { Spot } from "@binance/connector";

let BINANCE_API_KEY = process.env.BINANCE_API_KEY;
let BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;

if (!BINANCE_API_KEY || !BINANCE_API_SECRET) {
    console.log("Please set BINANCE_API_KEY, BINANCE_API_SECRET environment variables.");
    process.exit(1);
}

const client = new Spot(BINANCE_API_KEY, BINANCE_API_SECRET);

// Get account information
let res = await client.account();
client.logger.log(res.data);
