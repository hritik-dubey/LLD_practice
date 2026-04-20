import { RecurrenceRule } from './RecurrenceRule';
import { TimeRange } from './TimeRange';
import { RecurrenceType } from './RecurrenceType';

export class RecurrenceService {
    expand(rule: RecurrenceRule, start: Date, end: Date): TimeRange[] {
        const ranges: TimeRange[] = [];
        let currentDate = new Date(start);
        const duration = end.getTime() - start.getTime();
        let count = 0;

        while (true) {
            // Check if we've exceeded the count limit
            if (rule.count !== undefined && count >= rule.count) {
                break;
            }

            // Check if we've exceeded the until date
            if (rule.until && currentDate > rule.until) {
                break;
            }

            // Check if we've exceeded the end date
            if (currentDate > end) {
                break;
            }

            const rangeEnd = new Date(currentDate.getTime() + duration);
            ranges.push(new TimeRange(new Date(currentDate), rangeEnd));

            count++;

            // Calculate next occurrence based on recurrence type
            switch (rule.type) {
                case RecurrenceType.DAILY:
                    currentDate = new Date(currentDate);
                    currentDate.setDate(currentDate.getDate() + rule.interval);
                    break;
                case RecurrenceType.WEEKLY:
                    currentDate = new Date(currentDate);
                    currentDate.setDate(currentDate.getDate() + (7 * rule.interval));
                    break;
                case RecurrenceType.MONTHLY:
                    currentDate = new Date(currentDate);
                    currentDate.setMonth(currentDate.getMonth() + rule.interval);
                    break;
                default:
                    break;
            }
        }

        return ranges;
    }
}

