import {Project} from '../../../entities/project/project.model';
import { BaseEntity } from './../../../shared';
import { Program } from '../../../entities/program/program.model';
import {WorkflowCustom} from '../workflow-custom';

export class ProjectCustom extends Project {
    constructor(
        public program?: Program,
        public process?: WorkflowCustom
    ) {
        super();
    }
}
