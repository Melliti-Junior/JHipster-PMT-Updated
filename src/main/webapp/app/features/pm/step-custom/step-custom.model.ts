import { Step } from '../../../entities/step/step.model';
import {Status} from '../../../entities/status';

export class StepCustom extends Step {
    constructor(
        public status?: Status,
    ) {
        super();
        status = new Status();
    }
}
