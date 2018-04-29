import {Status} from '../../../entities/status';
import {ColumnCustom} from '../column-custom';

export class StatusCustom extends Status {
    constructor(
        public column?: ColumnCustom,
    ) {
        super();
        column = new ColumnCustom();
    }
}
