import { loadManifest } from '@angular-architects/module-federation';

loadManifest('/assets/federation.manifest.json')
    .catch(err => console.error(err))
    .then(_ => import('./bootstrap'))
    .catch(err => console.error(err));
