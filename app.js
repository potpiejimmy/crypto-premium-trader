import { Spot } from "@binance/connector";

let BINANCE_API_KEY = process.env.BINANCE_API_KEY;
let BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;

if (!BINANCE_API_KEY || !BINANCE_API_SECRET) {
    console.log("Please set BINANCE_API_KEY, BINANCE_API_SECRET environment variables.");
    process.exit(1);
}

const client = new Spot(BINANCE_API_KEY, BINANCE_API_SECRET);

const SMALL_BALANCE_LIMIT_BTC = 0.00001;
const ASSETS_IGNORELIST = ['TRIG', 'NFT'];

console.log(">>> Get ticker prices");
let ticker = await client.tickerPrice();
let prices = ticker.data;

console.log(">>> Get balances");
let res = await client.account();
let balances = res.data.balances;
balances = balances.filter(b => !ASSETS_IGNORELIST.includes(b.asset));
balances = balances.filter(b => b.free > 0 || b.locked > 0);

for (let b of balances) {
    b.total = parseFloat(b.free) + parseFloat(b.locked);
    if (b.asset === 'BTC') {
        b.btc = b.total;
    } else {
        let price = prices.find(p => p.symbol == b.asset+'BTC');
        if (price) {
            b.btc = b.total * price.price;
        } else {
            // cannot determine BTC value, ignore
            b.btc = 0;
        }
    }
}

balances = balances.filter(b => b.btc >= SMALL_BALANCE_LIMIT_BTC);

client.logger.log(balances);
