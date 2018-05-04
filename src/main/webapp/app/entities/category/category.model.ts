import { BaseEntity } from './../../shared';

export class Category implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public color?: string,
    ) {
    }
}
