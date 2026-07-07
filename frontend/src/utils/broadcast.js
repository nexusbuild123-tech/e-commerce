const CHANNEL_NAME = 'app-refresh';

let channel = null;

export const getBroadcastChannel = () => {
    if (!channel) {
        try {
            channel = new BroadcastChannel(CHANNEL_NAME);
        } catch {
            // Fallback: BroadcastChannel not supported (unlikely in modern browsers)
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

export const listenForRefresh = (callback) => {
    const ch = getBroadcastChannel();
    if (!ch) return () => {};
    const handler = (event) => {
        if (event.data && event.data.type === 'REFRESH') {
            callback(event.data);
        }
    };
    ch.addEventListener('message', handler);
    return () => {
        ch.removeEventListener('message', handler);
    };
};