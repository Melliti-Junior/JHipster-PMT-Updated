import {Status} from '../../../entities/status';
import {CategoryCustom} from '../category-custom';

export class StatusCustom extends Status {
    constructor(
        public category?: CategoryCustom,
    ) {
        super();
        category = new CategoryCustom();
    }
}
