import { issuesRoute } from './pm/issues/issues.route';
import { Routes } from '@angular/router';

import {
    PmRoute
} from './';
import { issuetypesRoute, issueprioritiesRoute, epicsRoute } from './pm';

const FEATURES_ROUTES = [
    PmRoute,
    issuesRoute,
    issuetypesRoute,
    issueprioritiesRoute,
    epicsRoute
];

export const featuresState: Routes = [{
    path: '',
    children: FEATURES_ROUTES
}];
