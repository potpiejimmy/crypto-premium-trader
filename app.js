import fetch from "node-fetch";

let DISCORD_API_ENDPOINT = 'https://discord.com/api/v8';
let DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
let DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
let DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_CHANNEL_ID) {
    console.log("Please set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CHANNEL_ID environment variables.");
    process.exit(1);
}

(async () => {

    let result = await fetch(DISCORD_API_ENDPOINT + "/oauth2/token", {
        method: 'POST',
        headers: {
            "Authorization": "Basic " + Buffer.from(DISCORD_CLIENT_ID + ":" + DISCORD_CLIENT_SECRET).toString('base64'),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            'scope': 'identify connections messages.read',
            'grant_type': 'client_credentials'
        })
    });

    let token = await result.json();

    console.log(JSON.stringify(token, 0, 4));

    result = await fetch(DISCORD_API_ENDPOINT + "/channels/" + DISCORD_CHANNEL_ID + "/messages?limit=3", {
        headers: {
            "Authorization": "Bearer " + token.access_token
        }
    });

    // result = await fetch("https://discordapp.com/api/users/@me/channels", {
    //     headers: {
    //         "Authorization": "Bearer " + token.access_token
    //     }
    // });

 //   https://discord.com/api/oauth2/authorize?client_id=<app_clientid>&scope=bot&permissions=65536


    result = await result.json();

    console.log(JSON.stringify(result, 0, 4));

})();
