const NodeMediaServer = require('node-media-server');
require('dotenv').config();

const config = {
	rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: false,
    ping: 15,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: process.env.MEDIA_ROOT || './public',
  },
  relay: {
    ffmpeg: process.env.FFMPEG_BIN || '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'stream',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/hls_1080p',
      },
      {
        app: 'stream',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/hls_720p',
      },
      {
        app: 'stream',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/hls_480p',
      },
      {
        app: 'stream',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/hls_360p',
      },
    ],
  },
  trans: {
    ffmpeg: process.env.FFMPEG_BIN || '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'hls_1080p',
        hls: true,
        ac: 'aac',
        acParam: ['-b:a', '192k', '-ar', 48000],
        vcParams: [
          '-vf',
          "'scale=1920:-1'",
          '-b:v',
          '5000k',
          '-preset',
          'fast',
          '-profile:v',
          'baseline',
          '-bufsize',
          '7500k'
        ],
        hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
      },
      {
        app: 'hls_720p',
        hls: true,
        ac: 'aac',
        acParam: ['-b:a', '128k', '-ar', 48000],
        vcParams: [
          '-vf',
          "'scale=1280:-1'",
          '-b:v',
          '2800k',
          '-preset',
          'fast',
          '-profile:v',
          'baseline',
          '-bufsize',
          '4200k'
        ],
        hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
      },
      {
        app: 'hls_480p',
        hls: true,
        ac: 'aac',
        acParam: ['-b:a', '128k', '-ar', 48000],
        vcParams: [
          '-vf',
          "'scale=854:-1'",
          '-b:v',
          '1400k',
          '-preset',
          'fast',
          '-profile:v',
          'baseline',
          '-bufsize',
          '2100k'
        ],
        hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
      },
      {
        app: 'hls_360p',
        hls: true,
        ac: 'aac',
        acParam: ['-b:a', '96k', '-ar', 48000],
        vcParams: [
          '-vf',
          "'scale=480:-1'",
          '-b:v',
          '800k',
          '-preset',
          'fast',
          '-profile:v',
          'baseline',
          '-bufsize',
          '1200k'
        ],
        hlsFlags: '[hls_time=10:hls_list_size=0:hls_flags=delete_segments]',
      },
    ],
  }
};

var nms = new NodeMediaServer(config)
nms.run();


nms.on('getFilePath', (streamPath, oupath, mp4Filename) => {
  console.log('---------------- get file path ---------------');
  console.log(streamPath);
  console.log(oupath);
  console.log(mp4Filename);
  utils.setMp4FilePath(oupath + '/' + mp4Filename);
});

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
	//console.log('KEY: ',stream_key);
	/*
    User.findOne({stream_key: stream_key}, (err, user) => {
        if (!err) {
            if (!user) {
                let session = nms.getSession(id);
                session.reject();
            } else {
                // do stuff
            }
        }
    });
	*/
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

nms.on('postConnect', (id, args) => {
  console.log(
    '[NodeEvent on postConnect]',
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on('doneConnect', (id, args) => {
  console.log(
    '[NodeEvent on doneConnect]',
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on prePublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on postPublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on donePublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on prePlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on postPlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on donePlay]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});