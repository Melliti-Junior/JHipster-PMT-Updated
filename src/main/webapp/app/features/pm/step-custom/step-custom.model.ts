import { Step } from '../../../entities/step/step.model';
import {StatusCustom} from '../status-custom';

export class StepCustom extends Step {
    constructor(
        public status?: StatusCustom,
    ) {
        super();
        status = new StatusCustom();
    }
}
