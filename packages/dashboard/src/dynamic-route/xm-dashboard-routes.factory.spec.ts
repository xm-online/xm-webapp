import { Dashboard } from '@xm-ngx/dashboard';
import { Routes } from '@angular/router';
import * as _ from 'lodash';
import { XmDashboardRouteFactory, xmDashboardRoutesFactory } from './xm-dashboard-routes.factory';

describe('xmDashboardRoutesFactory', () => {
    const routeFactory: XmDashboardRouteFactory = (dashboard, slug: string) => ({
        path: slug,
        data: { dashboard },
    });

    const containerFactory: XmDashboardRouteFactory = (dashboard, slug: string) => ({
        path: slug,
        data: { dashboard },
        children: [routeFactory(dashboard, '')],
    });


    it('empty dashboards should be empty routes', () => {
        const dashboards: Dashboard[] = [];
        const expectedResult: Routes = [];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard slug "" should be routes with path ""', () => {
        const dashboards: Dashboard[] = [{ config: { slug: '' } }];
        const expectedResult: Routes = [{ path: '', data: { dashboard: dashboards[0] } }];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard slug "users" should be routes with path "users"', () => {
        const dashboards: Dashboard[] = [{ config: { slug: 'users' } }];
        const expectedResult: Routes = [{ path: 'users', data: { dashboard: dashboards[0] } }];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard without slug should be routes with id instead', () => {
        const dashboards: Dashboard[] = [{ id: 1, config: { slug: null } }];
        const expectedResult: Routes = [{ path: '1', data: { dashboard: dashboards[0] } }];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard slug "users" and "users/:id" and "users/:id/edit" should be routes with path "users" and children and "", ":id" as a parent for "/edit"', () => {
        const dashboards: Dashboard[] = [
            { config: { slug: 'users' } },
            { config: { slug: 'users/:id' } },
            { config: { slug: 'users/:id/edit' } },
        ];
        const expectedResult: Routes = [{
            path: 'users',
            data: { dashboard: dashboards[0] },
            children: [
                { path: '', data: { dashboard: dashboards[0] } },
                {
                    path: ':id', data: { dashboard: dashboards[1] },
                    children: [
                        { path: '', data: { dashboard: dashboards[1] } },
                        { path: 'edit', data: { dashboard: dashboards[2] } },
                    ],
                },
            ],
        }];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard slug "users" and "users/:id" should be routes with path "users" and children ":id" and ""', () => {
        const dashboards: Dashboard[] = [
            { config: { slug: 'users' } },
            { config: { slug: 'users/:id' } },
        ];
        const expectedResult: Routes = [{
            path: 'users',
            data: { dashboard: dashboards[0] },
            children: [
                { path: '', data: { dashboard: dashboards[0] } },
                { path: ':id', data: { dashboard: dashboards[1] } },
            ],
        }];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard orderIndex "users" and "users/:id" and "users/new" should be routes with path "users" and children and "", "new", ":id"', () => {
        const dashboards: Dashboard[] = [
            { config: { orderIndex: 0, slug: 'users' } },
            { config: { orderIndex: 1, slug: 'users/new' } },
            { config: { orderIndex: 2, slug: 'users/:id' } },
        ];
        const expectedResult: Routes = [{
            path: 'users', data: { dashboard: dashboards[0] },
            children: [
                { path: '', data: { dashboard: dashboards[0] } },
                { path: 'new', data: { dashboard: dashboards[1] } },
                { path: ':id', data: { dashboard: dashboards[2] } },
            ],
        }];

        const result = xmDashboardRoutesFactory(_.shuffle([...dashboards]), containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });

    it('dashboard invalid orderIndex "users" and "users/:id" and "users/new" should be routes with random order and with path "users" and children and "", "new", ":id"', () => {
        const dashboards: Dashboard[] = [
            { config: { orderIndex: 0, slug: 'users' } },
            { config: { orderIndex: -1, slug: 'users/new' } },
            { config: { orderIndex: -2, slug: 'users/:id' } },
        ];
        const expectedResult: Routes = [{
            path: 'users', data: { dashboard: dashboards[0] },
            children: [
                { path: '', data: { dashboard: dashboards[0] } },
                { path: 'new', data: { dashboard: dashboards[1] } },
                { path: ':id', data: { dashboard: dashboards[2] } },
            ],
        }];

        const result = xmDashboardRoutesFactory(_.shuffle([...dashboards]), containerFactory, routeFactory);
        void expect(result).not.toEqual(expectedResult);
    });

    it('dashboard slug only "users/:id" should not create', () => {
        const dashboards: Dashboard[] = [
            { config: { slug: 'users/:id' } },
        ];
        const expectedResult: Routes = [];

        const result = xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
        void expect(result).toEqual(expectedResult);
    });
});
