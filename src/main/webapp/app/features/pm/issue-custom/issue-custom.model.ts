import { Issue } from '../../../entities/issue/issue.model';
import { IssuePriority } from '../../../entities/issue-priority/issue-priority.model';
import { IssueType } from '../../../entities/issue-type/issue-type.model';
import { Epic } from '../../../entities/epic/epic.model';
import { Status } from '../../../entities/status';
import { Resolution } from '../../../entities/resolution';

export class IssueCustom extends Issue {
    constructor(
        public priority?: IssuePriority,
        public type?: IssueType,
        public epic?: Epic,
        public status?: Status,
        public resolution?: Resolution,
    ) {
        super();
        priority = new IssuePriority();
        type = new IssueType();
        epic = new Epic();
        status = new Status();
        resolution = new Resolution();
    }
}
