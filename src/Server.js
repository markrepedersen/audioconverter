"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server = /** @class */ (function () {
    function Server(port) {
        this.port = port;
        this.express = require("express");
        this.app = this.express();
        this.https = require("https");
        this.api_key = "AIzaSyA4Dlm-ONcHO_JP4udStiEmLlOxs3jIjEQ";
        this.server = this.app.listen(this.port);
    }
    Server.prototype.end = function () {
        if (typeof server != 'undefined') {
            this.server.close();
        }
    };
    Server.prototype.getURLId = function (url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        }
        else {
            //well shit
        }
    };
    Server.prototype.convertVideoToMP3 = function (url) {
        var videoTitle = "";
        var that = this;
        var ytAudioStream = require("youtube-audio-stream");
        var fs = require("fs");
        var apiRequestPath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + this.getURLId(url) + '&fields=items(id%2Csnippet)&key=' + this.api_key;
        this.https.get(apiRequestPath, function (res) {
            var buffer = [];
            res.on("data", function (chunk) {
                buffer.push(chunk);
            })
                .on("end", function () {
                try {
                    var response = JSON.parse(Buffer.concat(buffer).toString());
                    var videosObject = response["items"];
                    videoTitle = videosObject[0]["snippet"]["title"].replace('/', '%2F');
                    var audioFile_1 = fs.createWriteStream("/Users/markpedersen/Music/iTunes/iTunes Media/Music/" + videoTitle + ".mp3");
                    ytAudioStream(url)
                        .pipe(audioFile_1)
                        .on("finish", function () {
                        console.log("Successfully added \"" + videoTitle + "\" to iTunes library.");
                        audioFile_1.close();
                        that.end();
                    });
                }
                catch (err) {
                    console.log("Well, this is embarrassing...\n" + err);
                }
            });
        });
    };
    return Server;
}());
exports.Server = Server;
var server = new Server(10000);
var url = process.argv.slice(2)[0];
if (url) {
    server.convertVideoToMP3(process.argv.slice(2)[0]);
}
else {
    server.end();
}
//# sourceMappingURL=Server.js.map