import { BaseEntity } from './../../shared';

export class Board implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public type?: string,
    ) {
    }
}
