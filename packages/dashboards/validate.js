const Ajv = require('ajv');
const {argv: args} = require('yargs');
const fs = require('fs');
const got = require('got');
const logger = console;

const xmurl = args.xmurl || process.env.npm_config_xmurl || process.env.xmurl || '';

const filePath =
  args.target || process.env.npm_config_target || process.env.target ||
  args.dist || process.env.npm_config_dist || process.env.dist
  || 'dist/dashboards.json';

const dynamic_components_spec_output = xmurl + '/assets/specification/dynamic_components_spec_output.json';

class JsonFile {
    saveJson(path, data) {
        let dir = path.split('/');
        dir.pop();
        dir = dir.join('/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(path, JSON.stringify(data, null, 2), {encoding: 'utf8'});
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

async function main() {
    logger.info('XM.main start');
    const fileRepo = new JsonFile();

    const ajv = new Ajv({strict: true});
    ajv.addKeyword('isSelectorConfig');

    const dashboards = fileRepo.loadFile(filePath).dashboards;
    const schemas = await got.get(dynamic_components_spec_output).json();

    for (let dashboard of dashboards) {
        for (let widget of dashboard.widgets) {
            const widgetConfig = schemas.find(i => i.selector === widget.selector);

            if (!widgetConfig) {
                logger.error(`Schema is not exists selector="${widget.selector}"!`);
                continue;
            }

            const schema = widgetConfig.configurationSchema;

            let validate;
            try {
                validate = ajv.compile(schema);
            } catch (e) {
                logger.error(e);
                continue;
            }

            const isValid = validate(widget.config);
            if (!isValid) {
                logger.warn(`Object is invalid dashboard.name="${dashboard.name}" widget.name="${widget.name}"!`);
                logger.warn(validate.errors);
            }
        }
    }
    logger.info('XM.main end');
}

main().then();
