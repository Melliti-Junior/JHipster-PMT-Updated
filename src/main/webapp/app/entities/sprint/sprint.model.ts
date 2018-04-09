import { BaseEntity } from './../../shared';

export class Sprint implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public duration?: number,
        public startDate?: any,
        public endDate?: any,
        public goal?: string,
        public isActive?: boolean,
    ) {
        this.isActive = false;
    }
}
