import { Board } from '../../../entities/board/board.model';
import { ProjectCustom } from '../project-custom';

export class BoardCustom extends Board {
    constructor(
        public project?: ProjectCustom,
    ) {
        super();
        project = new ProjectCustom();
    }
}
