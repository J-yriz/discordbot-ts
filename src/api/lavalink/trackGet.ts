import axios from "axios";
import config, { lavalink } from "../../config";
import { IDataResponse, ITrackGet } from "../../utils/interface";

const trackGet = async (dataMusic: string): Promise<ITrackGet[]> => {
    const trackResponse: IDataResponse = await axios.get(`${lavalink()}/v3/loadtracks`, {
        headers: { Authorization: config.Lavalink.LavaPass },
        params: { identifier: `ytsearch: ${dataMusic}` },
    });
    return trackResponse.data.tracks;
};

export default trackGet;
