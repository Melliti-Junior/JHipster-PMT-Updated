import { Step } from '../../../entities/step/step.model';
import {StatusCustom} from '../status-custom';
import {ColumnCustom} from '../column-custom';
import {WorkflowCustom} from '../workflow-custom';

export class StepCustom extends Step {
    constructor(
        public status?: StatusCustom,
        public column?: ColumnCustom,
        public workflow?: WorkflowCustom,

    ) {
        super();
        status = new StatusCustom();
        column = new ColumnCustom();
        workflow = new WorkflowCustom();
    }
}
