import { Component, Input, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import { Comment } from '../shared/comment.model';

@Component({
    selector: 'xm-comment-card',
    templateUrl: './comment-card.component.html',
    styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
    @Input() public comment: Comment;

    public commentator$: Observable<XmEntity>;

    constructor(private entityService: XmEntityService) {
    }

    public ngOnInit(): void {
        this.commentator$ = this.entityService.getProfileByKey(this.comment.userKey).pipe(
            map((responce) => responce.body),
            catchError(() => of({})),
        );
    }
}
