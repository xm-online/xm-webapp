const got = require('got');
const logger = console;
const args = require('yargs').argv;
const fs = require('fs');
const _ = require('lodash');

const xmurl = args.xmurl || process.env.npm_config_xmurl || process.env.xmurl || '';
const xmgrant = args.xmgrant || process.env.npm_config_xmgrant || process.env.xmgrant || '';
const xmauth = args.xmauth || process.env.npm_config_xmauth || process.env.xmauth || '';
const dist = args.dist || process.env.npm_config_dist || process.env.dist || 'dist/dashboards.json';


class JsonFile {
    saveJson(path, data) {
        let dir = path.split('/');
        dir.pop();
        dir = dir.join('/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(path, JSON.stringify(data, null, 4), {encoding: 'utf8'});
    }

    deleteFile(target) {
        fs.unlinkSync(target);
    }

    loadFile(target) {
        const contents = fs.readFileSync(target, {encoding: 'utf-8'});
        const jsonContent = JSON.parse(contents);
        return jsonContent;
    }
}

class ExportDashboardRepo {

    async connect(url, grant, auth) {
        const res = await got.post(url + '/uaa/oauth/token', {
            body: grant,
            headers: {
                'Authorization': auth, 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = JSON.parse(res.body);

        this.url = url;
        this.accessToken = data.access_token;
        this.headers = {
            'Authorization': 'Bearer ' + this.accessToken,
        };
    }

    async getDashboards() {
        const res = await got.get(this.url + '/dashboard/api/dashboards', {'headers': this.headers});
        const data = JSON.parse(res.body);
        return data;
    }

    async getWidgets() {
        const res = await got.get(this.url + '/dashboard/api/widgets', {'headers': this.headers});
        const data = JSON.parse(res.body);
        return data;
    }

    async getDashboardsWithWidgets() {
        const dashboards = await this.getDashboards();
        const widgets = await this.getWidgets();
        return _.map(dashboards, d => Object.assign({}, d, {
            widgets: _.filter(widgets, w => w.dashboard == d.id),
        }));
    }

    async dropDashboardsWithWidgets() {
        const dashboards = await this.getDashboardsWithWidgets();

        await got.delete(this.url + '/dashboard/api/dashboards/bulk', {
            headers: this.headers,
            json: dashboards,
        });
    }

    async saveDashboardsWithWidgets(dashboards) {
        await got.post(this.url + '/dashboard/api/dashboards/bulk', {
            headers: this.headers,
            json: dashboards,
        });
    }

    isAllEqual(dashboardsA, dashboardsB) {
        const errors = [];

        for (let d of dashboardsA) {
            const nDashboard = _.first(dashboardsB, nw => nw.name === d.name);
            if (!nDashboard) {
                errors.push('The dashboard has not been exported! name:' + d.name);
                continue;
            }

            for (let w of d.widgets) {
                const nWidget = _.first(nDashboard.widgets, nw => nw.name === w.name);
                if (!nWidget) {
                    errors.push(`The dashboard widget has not been exported! name:${d.name} widget:${w.name}`);
                    continue;
                }

            }

        }

        if (errors.length !== 0) {
            throw errors;
        }

        return true;
    }
}

(async function main() {
    logger.info('XM.main start');
    const dashboardRepo = new ExportDashboardRepo();
    const fileRepo = new JsonFile();

    logger.info('XM.main.connect');
    await dashboardRepo.connect(xmurl, xmgrant, xmauth);

    logger.info('XM.main.load');
    const dashboards = await dashboardRepo.getDashboardsWithWidgets();

    logger.info('XM.main.save');
    fileRepo.saveJson(dist, {dashboards});

    logger.info('XM.main end');
})();
