import * as dayjsLib from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween'

dayjsLib.extend(utc);
dayjsLib.extend(timezone);
dayjsLib.extend(isBetween);

export const dayjs = dayjsLib;
