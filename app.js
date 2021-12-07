import express from 'express';
import * as binance from './business/binance.js';

const app = express();
const port = process.env.PORT || 8080;

let balances;

// add CORS headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

balances = await binance.getAssets();

app.get('/api/balances', async (req, res) => {
    res.json(balances);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}/api`);
});
