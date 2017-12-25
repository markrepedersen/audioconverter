export class Server {
    private express: any = require("express");
    private app: any = this.express();
    private https: any = require("https");
    private api_key = "AIzaSyA4Dlm-ONcHO_JP4udStiEmLlOxs3jIjEQ";
    private server;

    constructor(private port: number) {
        this.server = this.app.listen(this.port);
    }

    end() {
        if (typeof server != 'undefined') {
            this.server.close();
        }
    }


    getURLId(url: string) {
        let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            //well shit
        }
    }

    convertVideoToMP3(url: string) {
        let videoTitle: string = "";
        let that = this;
        const ytAudioStream = require("youtube-audio-stream");
        const fs = require("fs");
        let apiRequestPath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + this.getURLId(url) + '&fields=items(id%2Csnippet)&key=' + this.api_key;
        this.https.get(apiRequestPath, function (res: any) {
            let buffer: Array<any> = [];
            res.on("data", chunk => {
                    buffer.push(chunk);
            })
                .on("end", function () {
                    try {
                        let response: string = JSON.parse(Buffer.concat(buffer).toString());
                        let videosObject: any = response["items"];
                        videoTitle = videosObject[0]["snippet"]["title"].replace('/', '%2F');
                        let audioFile: any = fs.createWriteStream("/Users/markpedersen/Music/iTunes/iTunes Media/Music/" + videoTitle + ".mp3");
                        ytAudioStream(url)
                            .pipe(audioFile)
                            .on("finish", () => {
                                console.log("Successfully added \"" + videoTitle + "\" to iTunes library.");
                                audioFile.close();
                                that.end();
                            });

                    }
                    catch (err) {
                        console.log("Well, this is embarrassing...\n" + err);
                    }
                });
        });
    }
}

let server = new Server(10000);
let url: string = process.argv.slice(2)[0];
if (url) {
    server.convertVideoToMP3(process.argv.slice(2)[0]);
}
else {
    server.end();
}
