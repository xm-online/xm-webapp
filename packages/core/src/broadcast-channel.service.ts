import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BroadcastChannelService implements OnDestroy {
    private channels: Map<string, BroadcastChannel> = new Map();
    private handlers: Map<string, ((data: any) => void)> = new Map();

    public connect(channelName: string): void {
        if (this.channels.has(channelName)) {
            return;
        }
        const newChannel = new BroadcastChannel(channelName);
        newChannel.onmessage = (event: MessageEvent<any>) => {
            this.handleIncomingMessage(channelName, event.data);
        };
        this.channels.set(channelName, newChannel);
    }

    public onMessage<T>(channelName: string, handler: (data: T) => void): void {
        this.handlers.set(channelName, handler);
    }

    public sendMessage<T>(channelName: string, message: T): void {
        const channel = this.channels.get(channelName);
        if (!channel) {
            return;
        }
        channel.postMessage(message);
    }

    public disconnect(channelName: string): void {
        const channel = this.channels.get(channelName);
        if (channel) {
            channel.close();
            this.channels.delete(channelName);
            this.handlers.delete(channelName);
        }
    }

    public ngOnDestroy(): void {
        const channelNames = Array.from(this.channels.keys());
        channelNames.forEach(name => this.disconnect(name));
    }

    private handleIncomingMessage(channelName: string, data: any): void {
        const handler = this.handlers.get(channelName);
        if (handler) {
            handler(data);
        }
    }
}
