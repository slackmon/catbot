const catbotModule = require('./catbot-runner');
// In the future we should serve a pretty webpage with user stats!
// For now we have a simple app that doesn't do anything but listen
// and serve a dummy webpage

const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ignoreTopics = ['bowtie', 'squirrel', 'glitch_crab', 'piggy', 'cubimal_chick', 'dusty_stick', 'pride', 'thumbsup_all', 'shipit', 'white_square', 'black_square', 'simple_smile'];

var http_port = process.env.PORT || '8080';
var bot_name = process.env.BOT_NAME || 'catbot';
var slackToken = process.env.SLACK_API_TOKEN;
var slackClient = require('@slack/client');

var app = express();

if (process.env.PROXY_URI) {
    app.use(process.env.PROXY_URI), {
        forwardPath: function (req, res) {
            return require('url').parse(req.url).path
        }
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send('\n 😻😻 ' + bot_name + ' 😻😻 \n')
});
app.use(express.static(__dirname + '/assets'));


app.listen(http_port, function (err) {
    if (err) {
        throw err;
    }

    console.log('Listening on ' + http_port);

    var catbotRunner = new catbotModule.CatRunner();

    var WebClient = slackClient.WebClient;
    var web = new WebClient(slackToken);

    var globalTopics = [];
    web.emoji.list(function(err, res){
        // console.log("Got emojis");
        // console.dir(res);
        var emojis = Object.keys(res.emoji);
        // console.log("Emojis are " + emojis.join(', '));

        for (var i=0; i < emojis.length ; i++) {
            if (ignoreTopics.indexOf(emojis[i]) == -1) {
                globalTopics.push(emojis[i]);
            }
        }

        // ['Ruby', 'PHP', 'MySQL', 'NodeJS', 'Bots', 'Engineering', 'Salesforce', 'Workday', 'Golang', 'Jira', 'AWS', 'Java', 'Python', 'Javascript', 'Mulesoft'];
        console.log("Custom Topics are " + globalTopics.join(', '));
        catbotRunner.init(slackClient.RtmClient, slackClient.RTM_EVENTS, slackToken, globalTopics);
        catbotRunner.start();
    });
});
