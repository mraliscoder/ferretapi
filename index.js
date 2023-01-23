const express = require("express"),
    fs = require("fs");

require("dotenv").config();

const app = express();
let ferrets = [];

let files = fs.readdirSync('./ferret-images/');
for (let i = 0; i < files.length; i++) {
    if (files[i].endsWith(".jpg") || files[i].endsWith(".png")) {
        ferrets.push(files[i]);
    }
}

console.log("Loaded ferrets:", ferrets.length);
const BASEURL = process.env.BASE_URL;

app.use(express.static(__dirname + '/static'));

app.get('/json', (req, res) => {
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify({ferret: '/ferret-image/' + getRandomFerret() }));
});

app.get('/image', (req, res) => {
    res.sendFile(__dirname + '/ferret-images/' + getRandomFerret());
});
app.get('/ferret-image/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    if (!/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(jpg|png)/gm.test(uuid)) {
        res.header("Content-Type", "application/json");
        res.status(403).send(JSON.stringify({ error: "Forbidden" }));
        return;
    }
    const file = __dirname + '/ferret-images/' + uuid;
    if (!fs.existsSync(file)) {
        res.header("Content-Type", "application/json");
        res.status(404).send(JSON.stringify({ error: "Not found" }));
        return;
    }
    res.sendFile(__dirname + '/ferret-images/' + uuid);
});

app.listen(process.env.PORT || 8321, () => {
    console.log("Started webserver");
});

function getRandomFerret() {
    return ferrets[Math.floor(Math.random()*ferrets.length)];
}