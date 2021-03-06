import { BaseEntity } from './../../shared';

export class Transition implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public description?: string,
    ) {
    }
}
