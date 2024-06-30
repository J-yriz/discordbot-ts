import { Readable } from "stream";
import ytdl from "ytdl-core";

const playTrack = (uri: string): Readable => {
    return ytdl(uri, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: "highestaudio",
    });
};

export default playTrack;
