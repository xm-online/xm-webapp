import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';

import { DEBUG_INFO_ENABLED } from 'src/app/xm.constants';
import { RatingSpec } from '../shared/rating-spec.model';
import { Rating } from '../shared/rating.model';
import { RatingService } from '../shared/rating.service';
import { Vote } from '../shared/vote.model';
import { VoteService } from '../shared/vote.service';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-rating-list-section',
    templateUrl: './rating-list-section.component.html',
})
export class RatingListSectionComponent implements OnChanges {

    @Input() public xmEntityId: number;
    @Input() public ratingSpecs: RatingSpec[];

    public xmEntity: XmEntity;
    public ratings: Rating[] = [];
    public votesNumber: {} = {};

    constructor(private xmEntityService: XmEntityService,
                private ratingService: RatingService,
                private voteService: VoteService,
                private toasterService: XmToasterService) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public getRatingByRatingSpec(ratingSpec: RatingSpec): Rating {
        const result = this.ratings ? this.ratings.filter((r) => r.typeKey === ratingSpec.key).shift() : null;
        if (!result) {
            return {
                typeKey: ratingSpec.key,
                value: 0,
                startDate: new Date().toJSON(),
                xmEntity: this.xmEntity,
            };
        }
        return Object.assign({}, result);
    }

    public onChange(voteValue: number, rating: Rating): void {
        const vote: Vote = {
            userKey: '',
            value: voteValue,
            message: '',
            entryDate: new Date().toJSON(),
            xmEntity: this.xmEntity,
        };
        rating.value = this.recalculateRating(voteValue, rating);
        if (!rating.id) {
            this.addRating(rating, vote);
        } else {
            this.updateRating(rating, vote);
        }
    }

    private load(): void {
        if (!this.ratingSpecs || !this.ratingSpecs.length) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: no spec no call');
            }
            return;
        }
        this.xmEntityService.find(this.xmEntityId, {embed: 'ratings'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.ratings) {
                this.ratings = [...xmEntity.body.ratings];
            }

            for (const rating of this.ratings) {
                this.voteService.search({query: `rating.id:${rating.id}`}).subscribe(
                    (response: HttpResponse<Vote[]>) => {
                        this.votesNumber[rating.typeKey] = parseInt(response.headers.get('X-Total-Count'), 10);
                    },
                    // TODO: error processing
                    (err) => console.info(err),
                );
            }
        });
    }

    private recalculateRating(voteValue: number, rating: Rating): number {
        const votesNumber = this.votesNumber.hasOwnProperty(rating.typeKey) ? this.votesNumber[rating.typeKey] : 0;
        return ((rating.value * votesNumber) + voteValue) / (votesNumber + 1);
    }

    private addRating(rating: Rating, vote: Vote): void {
        this.ratingService.create(rating).subscribe((response: HttpResponse<Rating>) => {
            vote.rating = response.body;
            this.addVote(vote);
        }, () => this.toasterService.success('xm-entity.rating-list-section.vote-error'));
    }

    private updateRating(rating: Rating, vote: Vote): void {
        this.ratingService.update(rating).subscribe((response: HttpResponse<Rating>) => {
            vote.rating = response.body;
            this.addVote(vote);
        }, () => this.toasterService.success('xm-entity.rating-list-section.vote-error'));
    }

    private addVote(vote: Vote): void {
        this.voteService.create(vote).subscribe(() => {
            this.load();
            this.toasterService.success('xm-entity.rating-list-section.vote-success');
        }, () => this.toasterService.error('xm-entity.rating-list-section.vote-error'));
    }

}
