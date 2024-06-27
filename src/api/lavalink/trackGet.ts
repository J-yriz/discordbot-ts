import axios from "axios";
import config, { lavalink } from "../../config";

interface IDataResponse {
    data: {
        loadType: string;
        tracks: [
            {
                encode: string;
                track: string;
                info: {
                    identifier: string;
                    isSeekable: boolean;
                    author: string;
                    length: number;
                    isStream: boolean;
                    position: number;
                    title: string;
                    uri: string;
                    sourceName: string;
                };
            }
        ];
    };
}

const trackGet = async (dataMusic: string): Promise<string | {}> => {
    const trackResponse: IDataResponse = await axios.get(`${lavalink("http")}/v3/loadtracks`, {
        headers: { Authorization: config.Lavalink.LavaPass },
        params: { identifier: `ytsearch: ${dataMusic}` },
    });
    if (!trackResponse.data.tracks.length) {
        return "No tracks found";
    }
    return trackResponse.data.tracks[0].info;
};

export default trackGet;
