import { Widget } from '@xm-ngx/dynamic';

export class DashboardBase {
    // Back compatibility matrix
    private mapWidgets: any = {
        'xm-widget-available-offerings': 'ext-common-entity/xm-widget-available-offerings',
        'xm-widget-clock': 'ext-common/xm-widget-clock',
        'xm-widget-general-countries': 'ext-common-entity/xm-widget-general-countries',
        'xm-widget-general-map': 'ext-common-entity/xm-widget-general-map',
        'xm-widget-stats': 'ext-common-entity/xm-widget-stats',
        'xm-widget-chartist-line': 'ext-common-entity/xm-widget-chartist-line',
        'xm-widget-tasks': 'ext-common-entity/xm-widget-tasks',
        'xm-widget-weather': 'ext-common/xm-widget-weather',
        'xm-widget-exchange-calculator': 'ext-common/xm-widget-exchange-calculator',
        'xm-widget-md': 'ext-common/xm-widget-md',
        'xm-widget-lots': 'ext-auction/xm-widget-lots',
        'xm-widget-welcome': 'ext-common/xm-widget-welcome',
        'xm-widget-entities-list': 'ext-common-entity/xm-widget-entities-list',
        'xm-widget-sign-in-up': 'ext-common/xm-widget-sign-in-up',
        'xm-widget-iframe': 'ext-common/xm-widget-iframe',
        'xm-widget-provide-customer-info': 'ext-common-entity/xm-widget-provide-customer-info',
        'xm-widget-coin-account': 'ext-crypto-wallet/xm-widget-coin-account',
        'xm-widget-coin-wallets': 'ext-crypto-wallet/xm-widget-coin-wallets',
        'xm-widget-jbs-board': 'ext-tenant-jsales/xm-jbs-board-widget',
        'xm-widget-zendesk-tickets': 'ext-zendesk/xm-widget-zendesk-tickets',
        'xm-widget-coin-wallet-escrow': 'ext-crypto-wallet/xm-widget-coin-wallet-escrow',
        'xm-widget-news': 'ext-common/xm-widget-news',
        'xm-widget-ico': 'ext-ico/xm-widget-ico',
    };

    protected getWidgetComponent(widget: Widget = {}): Widget {
        widget.selector = widget.selector ? widget.selector : 'ext-common/xm-widget-welcome';
        const mapComponents = this.mapWidgets;
        if (typeof mapComponents[widget.selector] === 'string' || mapComponents[widget.selector] instanceof String) {
            widget.selector = mapComponents[widget.selector];
        } else {
            widget.component = mapComponents[widget.selector];
        }
        if (widget.selector.indexOf('/') > 0) {
            widget.module = widget.selector.split('/')[0];
            widget.selector = widget.selector.split('/')[1];
        }
        widget.config = widget.config || {};
        Object.assign(widget.config, {
            id: widget.id,
            name: widget.name,
        });
        return widget;
    }

    protected getWidgetsComponent(widgets: Widget[]): Widget[] {
        return widgets.map((widget) => {
            if (typeof this.mapWidgets[widget.selector] === 'string'
                || this.mapWidgets[widget.selector] instanceof String) {
                widget.selector = this.mapWidgets[widget.selector];
            } else {
                widget.component = this.mapWidgets[widget.selector];
            }
            if (widget.selector.indexOf('/') > 0) {
                widget.module = widget.selector.split('/')[0];
                widget.selector = widget.selector.split('/')[1];
            }
            widget.config = widget.config || {};
            Object.assign(widget.config, {id: widget.id, name: widget.name});
            return widget;
        });
    }
}
