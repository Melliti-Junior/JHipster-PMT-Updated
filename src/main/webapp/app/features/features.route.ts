import { Routes } from '@angular/router';

import {
    PmRoute
} from './';

const FEATURES_ROUTES = [
    PmRoute,
];

export const featuresState: Routes = [{
    path: '',
    children: FEATURES_ROUTES
}];
