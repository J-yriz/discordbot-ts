export interface IQueue {
    title: string;
    uri: string;
    author: string;
    length: number;
}

export interface IDataResponse {
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