import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmConfigService } from '../../../../../src/app/shared';
import { finalize, map } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
    ExportEntitiesService, ExportEntityFlatNode,
    ExportEntityItemNode
} from '@xm-ngx/administration/maintenance/export-entities.service';

@Component({
    selector: 'xm-export-entities-details',
    templateUrl: './export-entities-details.component.html',
    styleUrls: ['./export-entities-details.component.scss'],
    providers: [ExportEntitiesService]
})
export class ExportEntitiesDetailsComponent implements OnInit, OnDestroy {

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    public flatNodeMap: Map<ExportEntityFlatNode, ExportEntityItemNode> =
        new Map<ExportEntityFlatNode, ExportEntityItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    public nestedNodeMap: Map<ExportEntityItemNode, ExportEntityFlatNode> =
        new Map<ExportEntityItemNode, ExportEntityFlatNode>();

    /** A selected parent node to be inserted */
    public selectedParent: ExportEntityFlatNode | null = null;

    public treeControl: FlatTreeControl<ExportEntityFlatNode>;

    public treeFlattener: MatTreeFlattener<ExportEntityItemNode, ExportEntityFlatNode>;

    public dataSource: MatTreeFlatDataSource<ExportEntityItemNode, ExportEntityFlatNode>;

    /** The selection for checklist */
    public checklistSelection: SelectionModel<ExportEntityFlatNode> =
        new SelectionModel<ExportEntityFlatNode>(true /* multiple */);


    public showLoader: boolean = true;
    public config: any;
    public selectedTypeKey: string[];

    constructor(private service: XmConfigService, private exportEntitiesService: ExportEntitiesService) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<ExportEntityFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        this.exportEntitiesService.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    public getLevel: any = (node: ExportEntityFlatNode) => node.level;

    public isExpandable: any = (node: ExportEntityFlatNode) => node.expandable;

    public getChildren: any = (node: ExportEntityItemNode): ExportEntityItemNode[] => node.children;

    public hasChild: any = (_: number, _nodeData: ExportEntityFlatNode) => _nodeData.expandable;

    public hasNoContent: any = (_: number, _nodeData: ExportEntityFlatNode) => _nodeData.item === '';

    public ngOnInit(): void {
        this.service
            .getConfigJson('/entity/xmentityspec.yml?toJson')
            .pipe(
                map((config) => {
                    return config.types.map(t => Object.assign(t, {selected: false}))
                }),
                takeUntilOnDestroy(this),
                finalize(() => this.showLoader = false),
            ).subscribe((config) => {
                this.config = config;
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this)
    }

    public checkType(type: any, e: MatCheckboxChange): void {
        this.config = this.config.map(c => {
            if (c.key === type.key) {
                c.selected = e.checked;
            }
            return c;
        });
    }

    public onSelectionChange(): void {
        const selectedEntityKey = this.selectedTypeKey[0];
        let selectedSpec = this.config.filter(c => c.key === selectedEntityKey)[0];

        if (!selectedSpec.treeData) {
            selectedSpec = {...selectedSpec, treeDta: this.exportEntitiesService.getInitialTreeData(selectedSpec)}
        }
        this.exportEntitiesService.initialize(selectedSpec.treeDta);
    }


    public transformer: any = (node: ExportEntityItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item
            ? existingNode
            : new ExportEntityFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;

        flatNode.expandable = !!node.children?.length;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    public descendantsAllSelected(node: ExportEntityFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.length > 0 && descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
        return descAllSelected;
    }

    public descendantsPartiallySelected(node: ExportEntityFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }


    public itemSelectionToggle(node: ExportEntityFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);

        console.warn(this.checklistSelection.selected);
    }

    public leafItemSelectionToggle(node: ExportEntityFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);

        console.warn(this.checklistSelection.selected);
    }

    public checkAllParentsSelection(node: ExportEntityFlatNode): void {
        let parent: ExportEntityFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    public checkRootNodeSelection(node: ExportEntityFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.length > 0 && descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    public getParentNode(node: ExportEntityFlatNode): ExportEntityFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
}
