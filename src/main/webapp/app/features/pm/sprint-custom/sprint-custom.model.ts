import { Sprint } from '../../../entities/sprint/sprint.model';
import {BoardCustom} from '../board-custom';

export class SprintCustom extends Sprint {
    constructor(
        public board?: BoardCustom,
    ) {
        super();
        board = new BoardCustom();
    }
}
