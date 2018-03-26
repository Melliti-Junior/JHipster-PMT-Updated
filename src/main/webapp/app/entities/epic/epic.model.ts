import { BaseEntity } from './../../shared';

export class Epic implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public summary?: string,
        public color?: string,
    ) {
    }
}
