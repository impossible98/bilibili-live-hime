const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;

class FFmpeg {
    constructor(rtmp, socket) {
        this.socket = socket;
        this.ff = this.create(rtmp.crop, rtmp.url);
        this.ff.stdout.on('data', data => console.log(String(data)));
        this.ff.stderr.on('data', data => console.log(String(data)));
        FFmpeg.instances.set(socket, this);
    }

    static getInstance(socket) {
        return this.instances.get(socket);
    }

    static destroy() {
        [...this.instances.values()].forEach(item => item.destroy());
    }

    create(crop, rtmp) {
		var cropVar = 'crop='+crop;
		return spawn(ffmpegPath, [
		    '-re',
		    '-i',
		    '-',
		    // '-vcodec',
		    // 'copy',
		    // '-acodec',
		    // 'aac',
		    // '-b:a',
		    // '192k',
		    // '-filter:v',
		    '-vf',
		    cropVar,
		    '-c:a',
		    'copy',
		    '-c:v',
		    'libx264',
		    '-crf',
		    '1',
		    '-acodec',
		    'aac',
		    '-f',
		    'flv',
		    rtmp,
		]);
        // return spawn(ffmpegPath, [
        //     '-re',
        //     '-i',
        //     '-',
        //     '-vcodec',
        //     'copy',
        //     '-acodec',
        //     'aac',
        //     '-b:a',
        //     '192k',
        //     '-f',
        //     'flv',
        //     rtmp,
        // ]);
    }

    write(data) {
        if (this.ff) {
            this.ff.stdin.write(data);
        }
    }

    onClose(callback) {
        if (this.ff) {
            this.ff.on('close', callback);
        }
    }

    destroy() {
        if (this.ff) {
            try {
                this.ff.stdin.end();
                this.ff.kill('SIGINT');
            } catch (error) {}
            this.ff = null;
        }
        FFmpeg.instances.delete(this.socket);
    }
}

Object.defineProperty(FFmpeg, 'instances', {
    value: new Map(),
});

module.exports = FFmpeg;
