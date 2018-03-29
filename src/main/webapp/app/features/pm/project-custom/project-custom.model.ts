import {Project} from '../../../entities/project/project.model';
import { BaseEntity } from './../../../shared';
import { Program } from '../../../entities/program/program.model';
import { IssueCustom } from '../issue-custom';

export class ProjectCustom extends Project {
    constructor(
        public program?: Program,
    ) {
        super();
        program = new Program();
    }
}
