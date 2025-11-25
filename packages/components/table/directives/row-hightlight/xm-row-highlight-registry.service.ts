import { Injectable } from '@angular/core';

export interface HighlightableRow {
    setHighlighted(selected: boolean): void;
}

@Injectable()
export class XmRowHighlightRegistry {
    private rows: Set<HighlightableRow> = new Set<HighlightableRow>();
    private currentHighlightedIndex: number;

    public register(row: HighlightableRow): void {
        this.rows.add(row);
    }

    public unregister(row: HighlightableRow): void {
        this.rows.delete(row);
    }

    public select(target: HighlightableRow, targetIndex: number): void {
        if (this.currentHighlightedIndex !== undefined) {
            Array.from(this.rows)[this.currentHighlightedIndex].setHighlighted(false);
        }

        target.setHighlighted(true);
        this.currentHighlightedIndex = targetIndex;
    }

    public clear(target: HighlightableRow): void {
        target.setHighlighted(false);
    }
}
