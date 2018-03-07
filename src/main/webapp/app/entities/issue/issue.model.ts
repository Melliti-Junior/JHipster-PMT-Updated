import { BaseEntity } from './../../shared';

export class Issue implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public summary?: string,
        public createdDate?: any,
        public dueDate?: any,
        public estimation?: number,
    ) {
    }
}
