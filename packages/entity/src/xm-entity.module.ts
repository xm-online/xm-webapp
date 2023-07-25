import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { RatingModule } from '@xm-ngx/components/rating';
import { EntityStateModule } from './entity-state';
import { StatesManagementDialogModule } from './states-management-dialog';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';

import { XmSharedModule } from '@xm-ngx/shared';
import { AttachmentCardComponent } from './attachment-card/attachment-card.component';
import { AttachmentDetailDialogComponent } from './attachment-detail-dialog/attachment-detail-dialog.component';
import { AttachmentListBaseComponent } from './attachment-list/attachment-list-base.component';
import { AttachmentListSimplifiedComponent } from './attachment-list/attachment-list-simplified.component';
import { AttachmentListComponent } from './attachment-list/attachment-list.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';
import { CalendarViewComponent } from './calendar-card/calendar-view/calendar-view.component';
import { CalendarEventDialogComponent } from './calendar-event-dialog/calendar-event-dialog.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommentDetailDialogComponent } from './comment-detail-dialog/comment-detail-dialog.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { EntityCardCompactComponent } from './entity-card-compact/entity-card-compact.component';
import { EntityCardComponent } from './entity-card/entity-card.component';
import { EntityDataCardComponent } from './entity-data-card/entity-data-card.component';
import { EntityDetailDialogModule } from './entity-detail-dialog/entity-detail-dialog.component';
import { EntityDetailFabComponent } from './entity-detail-fab/entity-detail-fab.component';
import { EntityListCardComponent } from './entity-list-card/entity-list-card.component';
import { EntityListComponent } from './entity-list-card/entity-list/entity-list.component';
import { EntityListFabComponent } from './entity-list-fab/entity-list-fab.component';
import { FunctionCallDialogComponent } from './function-call-dialog/function-call-dialog.component';
import {
    FunctionListSectionCompactComponent
} from './function-list-section-compact/function-list-section-compact.component';
import { FunctionListSectionComponent } from './function-list-section/function-list-section.component';
import { AreaComponent } from './functions/area/area.component';
import { OsmPolygonDialogComponent } from './functions/area/osm-polygon-dialog.component';
import { OverpassApiService } from './functions/area/overpass-api.service';
import { LinkDetailDialogComponent } from './link-detail-dialog/link-detail-dialog.component';
import { LinkDetailNewSectionComponent } from './link-detail-dialog/link-detail-new-section.component';
import { LinkDetailSearchSectionComponent } from './link-detail-dialog/link-detail-search-section.component';
import { LinkListCardComponent } from './link-list-card/link-list-card.component';
import { LinkListTreeSectionComponent } from './link-list-tree-section/link-list-tree-section.component';
import { LinkListComponent } from './link-list/link-list.component';
import { LocationDetailDialogComponent } from './location-detail-dialog/location-detail-dialog.component';
import { LocationCardNamePipe } from './location-list-card/location-card-name.pipe';
import { LocationListCardComponent } from './location-list-card/location-list-card.component';
import { RatingListSectionComponent } from './rating-list-section/rating-list-section.component';
import {
    AttachmentService,
    CalendarService,
    CommentService,
    ContentService,
    EventService,
    FunctionContextService,
    FunctionService,
    LinkService,
    LocationService,
    RatingService,
    TagService,
    VoteService,
    XmEntityService,
    XmEntitySpecService,
} from '@xm-ngx/core/entity';

import { StateChangeDialogComponent } from './state-change-dialog/state-change-dialog.component';
import { TagListSectionComponent } from './tag-list-section/tag-list-section.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CalendarChangeService } from './calendar-card/calendar-view/calendar-change.service';
import { XmEntityIconPipe } from '@xm-ngx/entity/pipes';

const MODULES = [
    StatesManagementDialogModule,
    EntityStateModule,
    EntityDetailDialogModule,
];

const COMPONENTS = [
    AreaComponent,
    AttachmentCardComponent,
    AttachmentDetailDialogComponent,
    AttachmentListComponent,
    AvatarDialogComponent,
    CalendarCardComponent,
    CalendarEventDialogComponent,
    CalendarViewComponent,
    CommentCardComponent,
    CommentDetailDialogComponent,
    CommentListComponent,
    EntityCardComponent,
    EntityCardCompactComponent,
    EntityDataCardComponent,
    EntityDetailFabComponent,
    EntityListCardComponent,
    EntityListFabComponent,
    FunctionCallDialogComponent,
    StateChangeDialogComponent,
    FunctionListSectionComponent,
    FunctionListSectionCompactComponent,
    LinkDetailDialogComponent,
    LinkDetailNewSectionComponent,
    LinkDetailSearchSectionComponent,
    LinkListComponent,
    LinkListCardComponent,
    LinkListTreeSectionComponent,
    LocationDetailDialogComponent,
    LocationListCardComponent,
    OsmPolygonDialogComponent,
    RatingListSectionComponent,
    TagListSectionComponent,
    LocationCardNamePipe,
    AttachmentListSimplifiedComponent,
    AttachmentListBaseComponent,
    EntityListComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        XmSharedModule,
        RouterModule,
        ImageCropperModule,
        RatingModule,
        TagInputModule,
        MODULES,
        ModalCloseModule,
        OwlDateTimeModule,
        XmEntityIconPipe,
    ],
    declarations: [
        COMPONENTS,
    ],
    exports: [
        MODULES,
        COMPONENTS,
    ],
    providers: [
        AttachmentService,
        CalendarService,
        CommentService,
        ContentService,
        EventService,
        FunctionService,
        FunctionContextService,
        LinkService,
        LocationService,
        OverpassApiService,
        RatingService,
        TagService,
        VoteService,
        XmEntityService,
        XmEntitySpecService,
        CalendarChangeService,
    ],
})
export class XmEntityModule {
}
