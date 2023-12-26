/*
 Copyright 2016-2021 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

/**
 * An utility service for date.
 */
@Injectable({
    providedIn: 'root',
})
export class JhiDateUtils {
    private pattern = 'yyyy-MM-dd';
    private datePipe: DatePipe;

    constructor() {
        this.datePipe = new DatePipe('en');
    }

    /**
     * Method to convert the date time from server into JS date object
     */
    public convertDateTimeFromServer(date: any): any {
        if (date) {
            return new Date(date);
        } 
        return null;
        
    }

    /**
     * Method to convert the date from server into JS date object
     */
    public convertLocalDateFromServer(date: any): any {
        if (date) {
            const dateString = date.split('-');
            return new Date(dateString[0], dateString[1] - 1, dateString[2]);
        }
        return null;
    }

    /**
     * Method to convert the JS date object into specified date pattern
     */
    public convertLocalDateToServer(date: any, pattern = this.pattern): any {
        if (date) {
            const newDate = new Date(date.year, date.month - 1, date.day);
            return this.datePipe.transform(newDate, pattern);
        } 
        return null;
        
    }

    /**
     * Method to get the default date pattern
     */
    public dateformat(): any {
        return this.pattern;
    }

    // TODO Change this method when moving from datetime-local input to NgbDatePicker
    public toDate(date: any): Date {
        if (date === undefined || date === null) {
            return null;
        }
        const dateParts = date.split(/\D+/);
        if (dateParts.length === 7) {
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5], dateParts[6]);
        }
        if (dateParts.length === 6) {
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
        }
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);
    }
}
