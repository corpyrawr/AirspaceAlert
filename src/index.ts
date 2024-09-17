//import { createLogger, transports, format } from "winston";
import { loadConfig } from './utils/config';
import { EventMonitor } from './event-monitor';
import { Logger } from './utils/logger';


var pjson = require('../package.json');

async function main() {
    const config = loadConfig();
    const logger = new Logger(config);

    logger.info(`==================== ${pjson.displayName} ====================`, "index");
    logger.info(`version: ${pjson.version}`, "index");
    logger.info(`author: ${pjson.author}`, "index");
    const eventMonitor = new EventMonitor(config, logger);
    logger.info(`- tar1090 Base URL: ${config.data_source.base}`, "index")
    logger.info(`- Refresh Interval: ${config.refresh_interval} seconds`, "index")
    logger.info("=======================================================", "index");
    logger.info("Monitoring...", "index");

    eventMonitor.monitorEvents();
    setInterval(() => {
        eventMonitor.monitorEvents();
    }, eventMonitor.getRefreshInterval())
}

main().catch(console.error);