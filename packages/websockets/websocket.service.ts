import { inject, Injectable, OnDestroy } from '@angular/core';
import { XmAuthenticationStoreService } from '@xm-ngx/core/auth';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class XmSocketService implements OnDestroy {
    private tokenService: XmAuthenticationStoreService = inject(XmAuthenticationStoreService);
    private socket: WebSocket | null = null;
    private messageSubject = new Subject<string>();

    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 3000;

    public connect(typeKey: string): Observable<string> {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn('[XmWebSocket] Already connected.');
            return this.messageSubject.asObservable();
        }

        const token = this.tokenService.getAuthenticationToken();
        if (!token) {
            console.error('[XmWebSocket] Missing authentication token.');
            return this.messageSubject.asObservable();
        }

        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        const url = `${protocol}://${location.host}/websocket/connect?typeKey=${typeKey}&token=${token}`;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.warn('[XmWebSocket] Connected.');
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            console.warn('[XmWebSocket] Message received:', event.data);
            this.messageSubject.next(event.data);
        };

        this.socket.onclose = (event) => {
            console.warn(`[XmWebSocket] Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
            this.tryReconnect(typeKey);
        };

        this.socket.onerror = (error) => {
            console.error('[XmWebSocket] Error:', error);
        };

        return this.messageSubject.asObservable();
    }

    private tryReconnect(typeKey: string): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.warn(`[XmWebSocket] Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
            setTimeout(() => this.connect(typeKey), this.reconnectDelay);
        } else {
            console.error('[XmWebSocket] Max reconnect attempts reached.');
        }
    }

    public sendMessage(message: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.warn('[XmWebSocket] Message sent:', message);
        } else {
            console.warn('[XmWebSocket] Cannot send message, socket is not open.');
        }
    }

    public disconnect(): void {
        if (this.socket) {
            console.warn('[XmWebSocket] Closing connection...');
            this.socket.close();
            this.socket = null;
        }
    }

    public isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    public ngOnDestroy(): void {
        this.disconnect();
    }
}
