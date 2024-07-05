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

const getDetailVideo = async (uri: string): Promise<{title: string, author: string}> => {
    const info = await ytdl.getInfo(uri);
    const title = info.videoDetails.title;
    const author = info.videoDetails.author.name;

    return { title, author };
}

export { playTrack, getDetailVideo };
