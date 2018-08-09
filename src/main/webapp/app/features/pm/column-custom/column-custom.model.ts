import {Column} from '../../../entities/column/column.model';
import {BoardCustom} from '../board-custom';

export class ColumnCustom extends Column {
    constructor(
        public board?: BoardCustom,
        public order?: number,
    ) {
        super();
        board = new BoardCustom();
    }
}
