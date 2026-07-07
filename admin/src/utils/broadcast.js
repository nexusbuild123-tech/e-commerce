const CHANNEL_NAME = 'app-refresh';

let channel = null;

export const getBroadcastChannel = () => {
    if (!channel) {
        try {
            channel = new BroadcastChannel(CHANNEL_NAME);
        } catch {
            channel = null;
        }
    }
    return channel;
};

export const broadcastRefresh = () => {
    const ch = getBroadcastChannel();
    if (ch) {
        ch.postMessage({ type: 'REFRESH', timestamp: Date.now() });
    }
};