import { BaseEntity } from './../../shared';

export class IssuePriority implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public color?: string,
    ) {
    }
}
