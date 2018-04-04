import { Version } from '../../../entities/version/version.model';
import { ProjectCustom } from '../project-custom';

export class VersionCustom extends Version {
    constructor(
        public project?: ProjectCustom,
    ) {
        super();
        project = new ProjectCustom();
    }
}
