import {Routes} from '@angular/router';

import {ProjectManagementRoute} from './';

const FEATURES_ROUTES = [
    ProjectManagementRoute
];

export const featuresState: Routes = [{
    path: '',
    children: FEATURES_ROUTES
}];
