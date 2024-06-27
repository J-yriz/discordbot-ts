import ytdl from "ytdl-core";

const playTrack = (uri: string) => {
    return ytdl(uri, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: "lowestaudio",
    });
};

export default playTrack;
