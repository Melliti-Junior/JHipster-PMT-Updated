import { Issue } from '../../../entities/issue/issue.model';
import { IssuePriority } from '../../../entities/issue-priority/issue-priority.model';
import { IssueType } from '../../../entities/issue-type/issue-type.model';
import { Epic } from '../../../entities/epic/epic.model';
import { Status } from '../../../entities/status';
import { Resolution } from '../../../entities/resolution';
import { ProjectCustom } from '../project-custom';
import {VersionCustom} from '../version-custom';

export class IssueCustom extends Issue {
    constructor(
        public priority?: IssuePriority,
        public type?: IssueType,
        public epic?: Epic,
        public status?: Status,
        public resolution?: Resolution,
        public project?: ProjectCustom,
        public version?: VersionCustom,
    ) {
        super();
        priority = new IssuePriority();
        type = new IssueType();
        epic = new Epic();
        status = new Status();
        resolution = new Resolution();
        project = new ProjectCustom();
        version = new VersionCustom();
    }
}
