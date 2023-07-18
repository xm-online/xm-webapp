import { AfterViewInit, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { buildMapId } from '@xm-ngx/operators';
import { FunctionContext } from '@xm-ngx/core/entity';
import { FunctionContextService } from '@xm-ngx/core/entity';
import { XmEntity } from '@xm-ngx/core/entity';
import { OsmPolygonDialogComponent } from './osm-polygon-dialog.component';

declare let L: any;

@Component({
    selector: 'xm-area',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements AfterViewInit {

    @Input() public xmEntity: XmEntity;
    @Input() public functionContext: FunctionContext;
    public mapId: string;
    public context: FunctionContext;
    private map: any;
    private gmLayer: any;
    private drawnItems: any;
    private drawControl: any;

    constructor(private functionContextService: FunctionContextService,
                private modalService: MatDialog) {
        this.mapId = buildMapId('area');
        this.context = {};
        this.context.key = this.mapId;
        this.context.typeKey = 'AREA';
    }

    public ngAfterViewInit(): void {
        this.init();
    }

    public addPolygonInternal(polygon: any): void {
        const layer = L.polygon(
            polygon.map((el) => [el.lat, el.lon]),
            {fillColor: '#009688', fillOpacity: 0.6, opacity: 1, weight: 3, color: '#009688'},
        );
        this.drawnItems.addLayer(layer);
        this.saveFunction(this.drawnItems);
        this.map.fitBounds(this.drawnItems.getBounds(), {padding: [1, 1]});
    }

    public onClickAddPolygon(): void {
        const modalRef = this.modalService.open(OsmPolygonDialogComponent, {width: '500px'});
        modalRef.componentInstance.addPolygonInternal = this.addPolygonInternal.bind(this);
    }

    private init(): void {
        this.context.xmEntity = this.xmEntity;
        if (this.functionContext) {
            Object.assign(this.context, this.functionContext);
        }
        setTimeout(() => {
            this.map = L.map(this.mapId, {
                closePopupOnClick: false,
            }).setView([50, 30.2], 8);
            this.map.scrollWheelZoom.disable();
            L.control.scale({imperial: false}).addTo(this.map);
            this.initLayers();
            this.initDrawInterface();
            this.attachEventHandlers();
            if (this.functionContext && this.functionContext.data && this.functionContext.data.polygons) {
                this.drawPolygons(this.functionContext.data.polygons);
            }
        }, 500);
    }

    private initLayers(): void {
        this.gmLayer = L.gridLayer.googleMutant({
            type: 'roadmap',
        });
        this.map.addLayer(this.gmLayer);
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);
    }

    private initDrawInterface(): void {
        if (!this.map) {
            return;
        }
        this.drawControl = new L.Control.Draw({
            draw: {
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                        color: '#009688',
                    },
                },
                rectangle: {
                    shapeOptions: {
                        color: '#009688',
                    },
                },
                circle: false,
                marker: false,
            },
            edit: {
                featureGroup: this.drawnItems,
                edit: true,
                remove: true,
            },
        });
        this.map.addControl(this.drawControl);
    }

    private attachEventHandlers(): void {
        this.map.on('draw:created', (e) => {
            this.drawnItems.addLayer(e.layer);
            this.saveFunction(this.drawnItems);

        });

        this.map.on('draw:edited', () => {
            this.saveFunction(this.drawnItems);
        });

        this.map.on('draw:deleted', () => {
            this.saveFunction(this.drawnItems);
        });

    }

    private drawPolygons(list: any): void {
        list.forEach((item) => {
            const layer = L.polygon(
                item.paths.map((el) => [el.lat, el.lng]),
                {fillColor: '#009688', fillOpacity: 0.6, opacity: 1, weight: 3, color: '#009688'},
            );
            this.drawnItems.addLayer(layer);
        });
        this.map.fitBounds(this.drawnItems.getBounds(), {padding: [1, 1]});
    }

    private saveFunction(options: any): void {
        const data = {polygons: []};
        for (const layerName of Object.keys(options._layers)) {
            const layer = options._layers[layerName];
            data.polygons.push({paths: layer._latlngs[0]});
        }
        this.context.data = data;
        if (this.context.id) {
            this.context.updateDate = new Date().toJSON();
            this.functionContextService.update(this.context).subscribe();
        } else {
            this.context.description = 'description';
            this.context.startDate = new Date().toJSON();
            this.context.updateDate = new Date().toJSON();
            this.functionContextService.create(this.context).subscribe();
        }
    }

}
