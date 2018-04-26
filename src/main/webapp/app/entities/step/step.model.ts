import { BaseEntity } from './../../shared';

export class Step implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
    ) {
    }
}
