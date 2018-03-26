import { BaseEntity } from './../../shared';

export class Status implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public description?: string,
        public icon?: string,
    ) {
    }
}
