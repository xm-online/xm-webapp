// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
    context(path: string, deep?: boolean, filter?: RegExp): {
        keys(): string[];
        <T>(id: string): T;
    };
};

@NgModule({
    providers: [provideZoneChangeDetection()],
})
class ZoneChangeDetectionTestingModule {
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    [BrowserDynamicTestingModule, ZoneChangeDetectionTestingModule],
    platformBrowserDynamicTesting(),
);
