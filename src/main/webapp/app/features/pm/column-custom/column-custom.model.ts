import { Column } from '../../../entities/column/column.model';
import {BoardCustom} from '../board-custom';

export class ColumnCustom extends Column {
    constructor(
        public board?: BoardCustom,
    ) {
        super();
        board = new BoardCustom();
    }
}
