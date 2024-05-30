export function parseTime(value: string): { hours: number; minutes: number; seconds: number; } {
    let time = /(\d?\d):?(\d?\d)?:?(\d?\d)?/.exec(value);

    if (!time) {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    let h = parseInt(time[1], 10);
    let m = parseInt(time[2], 10) || 0;
    let s = parseInt(time[3], 10) || 0;

    if (h > 24) {
        time = /(\d)(\d?\d?):?(\d?\d)?/.exec(value);

        if (!time) {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        h = parseInt(time[1], 10);
        m = parseInt(time[2], 10) || 0;
        s = parseInt(time[3], 10) || 0;
    }

    return {
        hours: h,
        minutes: m,
        seconds: s,
    };
}
