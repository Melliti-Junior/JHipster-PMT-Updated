import { issuesRoute } from './pm/issues/issues.route';
import { Routes } from '@angular/router';

import {
    PmRoute
} from './';

const FEATURES_ROUTES = [
    PmRoute,
    issuesRoute
];

export const featuresState: Routes = [{
    path: '',
    children: FEATURES_ROUTES
}];
