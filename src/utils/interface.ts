export interface IQueue {
    title: string;
    uri: string;
    author: string;
    length: number;
}

export interface ITrackGet {
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

export interface IDataResponse {
    data: {
        loadType: string;
        tracks: [ITrackGet];
    };
}
