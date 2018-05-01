import { Transition } from '../../../entities/transition/transition.model';
import {WorkflowCustom} from '../workflow-custom';
import {StepCustom} from '../step-custom';

export class TransitionCustom extends Transition {
    constructor(
        public workflow?: WorkflowCustom,
        public sourceStep?: StepCustom,
        public targetStep?: StepCustom,
    ) {
        super();
    }
}
