import { DateTime } from 'luxon';

export default {
    install(app) {
        app.config.globalProperties.$DayMonthYearHourMinutes = (dateString) => {
            const fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return DateTime.fromISO(dateString)
                .setZone(fuseau)
                .toFormat("dd MMMM yyyy à HH:mm");
        };

        app.config.globalProperties.$HourMinutes = (dateString) => {
            return DateTime.fromISO(dateString).toFormat("HH:mm");
        };

        app.config.globalProperties.$DayMonthYear = (dateString) => {
            return DateTime.fromISO(dateString).toFormat("dd MMMM yyyy");
        };

        app.config.globalProperties.$DayMonth = (dateString) => {
            return DateTime.fromISO(dateString).toFormat("dd MMMM");
        };
        app.config.globalProperties.$DayMonthYear2 = (dateString) => {
            return DateTime.fromISO(dateString).toFormat("dd/MM/yyyy");
        };
    },
};
