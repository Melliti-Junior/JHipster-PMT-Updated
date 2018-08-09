import {Issue} from '../../../entities/issue/issue.model';
import {IssuePriority} from '../../../entities/issue-priority/issue-priority.model';
import {IssueType} from '../../../entities/issue-type/issue-type.model';
import {Epic} from '../../../entities/epic/epic.model';
import {Resolution} from '../../../entities/resolution';
import {ProjectCustom} from '../project-custom';
import {VersionCustom} from '../version-custom';
import {SprintCustom} from '../sprint-custom';
import {StatusCustom} from '../status-custom';
import {User} from '../../../shared';

export class IssueCustom extends Issue {
    constructor(
        public priority?: IssuePriority,
        public type?: IssueType,
        public epic?: Epic,
        public status?: StatusCustom,
        public resolution?: Resolution,
        public project?: ProjectCustom,
        public version?: VersionCustom,
        public sprint?: SprintCustom,
        public progress?: number,
        public reporter?: User,
        public assignee?: User,
    ) {
        super();
        priority = new IssuePriority();
        type = new IssueType();
        epic = new Epic();
        status = new StatusCustom();
        resolution = new Resolution();
        project = new ProjectCustom();
        version = new VersionCustom();
        sprint = new SprintCustom();
        progress = 0;
    }
}
