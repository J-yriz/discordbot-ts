import axios from "axios";
import config, { lavalink } from "../../config";
import { IDataResponse } from "../../utils/interface";

const trackGet = async (dataMusic: string): Promise<string | {}> => {
    const trackResponse: IDataResponse = await axios.get(`${lavalink("http")}/v3/loadtracks`, {
        headers: { Authorization: config.Lavalink.LavaPass },
        params: { identifier: `ytsearch: ${dataMusic}` },
    });
    return trackResponse.data.tracks;
};

export default trackGet;
