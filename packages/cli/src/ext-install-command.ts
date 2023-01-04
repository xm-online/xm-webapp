import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';
import { Command } from './command';
import { Config } from './config';

export class ExtInstallCommand implements Command {

    constructor(private config: Config) {
    }

    public execute(): void {
        fs.readdirSync(this.config.extDir).forEach((mod) => {
            const modPath = join(this.config.extDir, mod);
            if (fs.existsSync(join(modPath, 'package.json'))) {
                console.info('Packages installing:', modPath);
                const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
                cp.spawn(npmCmd, ['i', '--legacy-peer-deps'], { env: process.env, cwd: modPath, stdio: 'inherit' });
            }
        });
    }

}
