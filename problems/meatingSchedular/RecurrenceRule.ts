import { RecurrenceType } from './RecurrenceType';

export class RecurrenceRule {
    constructor(
        public type: RecurrenceType,
        public interval: number,
        public count?: number,
        public until?: Date
    ) {}
}

