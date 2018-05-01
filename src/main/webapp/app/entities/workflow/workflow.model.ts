import { BaseEntity } from './../../shared';

export class Workflow implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public description?: string,
    ) {
    }
}
