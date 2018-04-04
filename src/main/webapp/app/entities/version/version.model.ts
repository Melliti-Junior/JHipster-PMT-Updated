import { BaseEntity } from './../../shared';

export class Version implements BaseEntity {
    constructor(
        public id?: string,
        public code?: string,
        public name?: string,
        public startDate?: any,
        public releaseDate?: any,
        public description?: string,
        public isReleased?: boolean,
    ) {
        this.isReleased = false;
    }
}
