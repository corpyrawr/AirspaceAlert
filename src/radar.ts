//import { loggers, Logger, transports, format } from "winston";
import { Logger } from './utils/logger';

export type Aircraft = {
    hex: string;
    type: string;
    flight: string;
    squawk: string;
    r: string;
    t: string;
    altitude: number;
    speed: number;
    seen: number;
}

export type ActiveAircraft = {
  data: Aircraft;
  notSeenCount: number;
  isNew: boolean;
};

export class Radar {
    private activeAircraftMap: Map<string, ActiveAircraft> = new Map();
    private iterationThreshold: number;
    private logger: Logger;

    constructor(iterationThreshold: number, logger: Logger) {
      this.iterationThreshold = iterationThreshold;
      this.logger = logger;
    }

    // Method to update the radar with new data
    updateRadar(newAircraftList: Aircraft[]) {
        const currentHexSet = new Set(newAircraftList.map((a) => a.hex));

        // Increment 'notSeenCount' for aircraft in the list
        this.activeAircraftMap.forEach((aircraft, hex) => {
            if (!currentHexSet.has(hex)) {
                aircraft.notSeenCount++;
                this.logger.debug(`${aircraft.data.r} ${aircraft.data.t} was not seen. (${aircraft.notSeenCount}/${this.iterationThreshold})`,"radar")
            } else {
                aircraft.notSeenCount = 0; // Reset count if it's seen
            }
            aircraft.isNew = false; // Reset isNew for subsequent iterations
        });

        // Add new aircraft or update existing ones
        newAircraftList.forEach((newAircraft) => {
            if (!this.activeAircraftMap.has(newAircraft.hex)) {
                this.logger.info(`New aircraft detected: ${newAircraft.r} ( ${newAircraft.hex} ) ${newAircraft.t}`, "radar");
                this.activeAircraftMap.set(newAircraft.hex, { data: newAircraft, notSeenCount: 0, isNew: true });
            } else {
                this.activeAircraftMap.get(newAircraft.hex)!.data = newAircraft;
            }
        });

        // Remove aircraft that have exceeded the threshold
        this.activeAircraftMap.forEach((aircraft, hex) => {
            if (aircraft.notSeenCount >= this.iterationThreshold) {
                this.logger.info(`Removing aircraft: ${aircraft.data.r} ${aircraft.data.t}`, "radar");
                this.activeAircraftMap.delete(hex);
            }
        });
    }

    // Optional: Get a list of active aircraft
    getActiveAircraft(): (Aircraft & { isNew: boolean })[] {
        return Array.from(this.activeAircraftMap.values()).map(({ data, isNew }) => ({
            ...data, // Spread the properties of `data`
            isNew,   // Add the `isNew` field
        }));
    }

}