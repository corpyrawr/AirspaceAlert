import { loadConfig } from './utils/config';
import { EventMonitor } from './event-monitor';
import { Logger } from './utils/logger';

async function main() {
    const pjson = require('../package.json');
    const config = loadConfig();
    const logger = new Logger(config);

    logger.info(`==================== ${pjson.displayName} ====================`, "index");
    logger.info(`version: ${pjson.version}`, "index");
    logger.info(`author: ${pjson.author}`, "index");
    logger.info(`- tar1090 Base URL: ${config.data_source.base}`, "index")
    logger.info(`- Refresh Interval: ${config.refresh_interval} seconds`, "index")
    logger.info("=======================================================", "index");
    logger.info("Monitoring...", "index");

    const eventMonitor = new EventMonitor(config, logger);
    eventMonitor.monitorEvents();
    setInterval(() => {
        eventMonitor.monitorEvents();

    }, config.refresh_interval * 1000)
}

main().catch(console.error);