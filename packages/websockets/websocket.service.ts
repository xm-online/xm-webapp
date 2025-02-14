import { Injectable, OnDestroy } from '@angular/core';
import { XmAuthenticationStoreService } from '@xm-ngx/core/auth';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class XmSocketService implements OnDestroy {
    private sockets: Map<string, WebSocket> = new Map();
    private messageSubject = new Subject<{ typeKey: string; message: string }>();

    private reconnectAttempts = new Map<string, number>();
    private readonly maxReconnectAttempts = Infinity;
    private readonly reconnectDelay = 1000;
    private readonly maxDelay = 30000;

    constructor(private tokenService: XmAuthenticationStoreService) {}

    public connect(typeKey: string): Observable<{ typeKey: string; message: string }> {
        if (this.sockets.has(typeKey) && this.sockets.get(typeKey)?.readyState === WebSocket.OPEN) {
            console.warn(`[XmWebSocket] Already connected for typeKey=${typeKey}`);
            return this.messageSubject.asObservable();
        }

        const token = this.tokenService.getAuthenticationToken();
        if (!token) {
            console.error('[XmWebSocket] Missing authentication token.');
            return this.messageSubject.asObservable();
        }

        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        const url = `${protocol}://${location.host}/websocket/connect?typeKey=${typeKey}&token=${token}`;

        console.warn(`[XmWebSocket] Connecting to ${url}...`);
        const socket = new WebSocket(url);
        this.sockets.set(typeKey, socket);

        socket.onopen = () => {
            console.warn(`[XmWebSocket] Connected for typeKey=${typeKey}`);
            this.reconnectAttempts.set(typeKey, 0);
        };

        socket.onmessage = (event) => {
            console.warn(`[XmWebSocket] Message received for typeKey=${typeKey}:`, event.data);
            this.messageSubject.next({ typeKey, message: event.data });
        };

        socket.onclose = (event) => {
            console.warn(`[XmWebSocket] Disconnected for typeKey=${typeKey}. Code: ${event.code}, Reason: ${event.reason}`);

            this.sockets.delete(typeKey);

            if (event.code === 1000) {
                console.warn('[XmWebSocket] Normal closure, no reconnection.');
                return;
            }

            this.tryReconnect(typeKey);
        };

        socket.onerror = (error) => {
            console.error(`[XmWebSocket] Error for typeKey=${typeKey}:`, error);
        };

        return this.messageSubject.asObservable();
    }

    private tryReconnect(typeKey: string): void {
        const attempts = (this.reconnectAttempts.get(typeKey) || 0) + 1;

        if (attempts >= this.maxReconnectAttempts) {
            console.error(`[XmWebSocket] Max reconnect attempts reached for typeKey=${typeKey}. Stopping.`);
            return;
        }

        this.reconnectAttempts.set(typeKey, attempts);

        const delay = attempts === 1 ? 0 : Math.min(attempts * this.reconnectDelay, this.maxDelay);
        console.warn(`[XmWebSocket] Reconnect attempt ${attempts} for typeKey=${typeKey} in ${delay} ms...`);

        setTimeout(() => {
            this.connect(typeKey);
        }, delay);
    }

    public getSocket(typeKey: string): WebSocket | undefined {
        return this.sockets.get(typeKey);
    }

    public disconnect(typeKey: string): void {
        const socket = this.sockets.get(typeKey);
        if (socket) {
            console.warn(`[XmWebSocket] Closing connection for typeKey=${typeKey}`);
            socket.close();
            this.sockets.delete(typeKey);
        }
    }

    public sendMessage(typeKey: string, message: string): void {
        const socket = this.sockets.get(typeKey);
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.warn(`[XmWebSocket] Sending message to ${typeKey}:`, message);
            socket.send(message);
        } else {
            console.warn(`[XmWebSocket] Cannot send message, socket for ${typeKey} is not open.`);
        }
    }

    public ngOnDestroy(): void {
        this.sockets.forEach((socket, typeKey) => this.disconnect(typeKey));
        this.messageSubject.complete();
    }
}
