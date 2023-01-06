import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JhiDateUtils } from 'ng-jhipster';
import { XmEntityService } from './xm-entity.service';

describe('XmEntityService', () => {
    const v2ResourceUrl = '/entity/api/v2/xm-entities';
    const resourceUrl = '/entity/api/xm-entities';
    const resourceSearchUrl = '/entity/api/_search/xm-entities';
    const resourceProfileUrl = '/entity/api/profile';
    const resourceSearchTemplateUrl = '/entity/api/_search-with-template/xm-entities';
    const getEntitiesByIdUrl = '/entity/api/xm-entities-by-ids';

    let service: XmEntityService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                XmEntityService,
                { provide: JhiDateUtils, useValue: { toDate: r => r, convertDateTimeFromServer: r => r } },
            ],
        });
        httpTestingController = TestBed.inject<HttpTestingController>(HttpTestingController);
        service = TestBed.inject<XmEntityService>(XmEntityService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    describe('serchApi', () => {
        it('should call find() with correct url', (done) => {
            const id = 123;
            service.find(id).subscribe(() => done());
            const req = httpTestingController.expectOne(`${resourceUrl}/${id}`);
            req.flush({ id: 123 });
        });

        it('should call getEntitiesByIds() with correct url', (done) => {
            service.getEntitiesByIds().subscribe(() => done());
            const req = httpTestingController.expectOne(getEntitiesByIdUrl);
            req.flush([{ id: 123 }]);
        });

        it('should call query() with correct url', (done) => {
            service.query().subscribe(() => done());
            const req = httpTestingController.expectOne(resourceUrl);
            req.flush([{ id: 123 }]);
        });

        it('should call search() with correct url', (done) => {
            service.search().subscribe(() => done());
            const req = httpTestingController.expectOne(resourceSearchUrl);
            req.flush([{ id: 123 }]);

        });

        it('should call searchByTemplate() with correct url', (done) => {
            service.searchByTemplate().subscribe(() => done());
            const req = httpTestingController.expectOne(resourceSearchTemplateUrl);
            req.flush([{ id: 123 }]);

        });

        it('should call getProfile() with correct url', (done) => {
            service.getProfile().subscribe(() => done());
            const req = httpTestingController.expectOne(resourceProfileUrl);
            req.flush({ id: 123 });

        });

        it('should call findLinkTargets() with correct url', (done) => {
            const id = 123;
            const linkType = 'test;';
            service.findLinkTargets(id, linkType).subscribe(() => done());
            const req = httpTestingController.expectOne(`${resourceUrl}/${id}/links/targets?typeKey=${linkType}`);
            req.flush({ id: 123 });

        });

        it('should call findLinkSources() with correct url', (done) => {
            const id = 123;
            const linkType = 'test;';
            service.findLinkSources(id, linkType).subscribe(() => done());
            const req = httpTestingController.expectOne(`${resourceUrl}/${id}/links/sources?typeKey=${linkType}`);
            req.flush({ id: 123 });

        });

        it('should call findLinkSourcesInverted() with correct url', (done) => {
            const idOrKey = '123';
            const linkType = ['test'];
            service.findLinkSourcesInverted(idOrKey, linkType).subscribe(() => done());
            const req = httpTestingController.expectOne(
                `${v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkType}`);
            req.flush({ id: 123 });

        });
    });
});
