import axios from 'axios';
import { Logger } from '../utils/logger'
import { AircraftData, DataSource } from './datasources';

export class Tar1090 implements DataSource {
  private logger: Logger;
  type: string;
  base: string;

  constructor(base: string, logger: Logger) {
    this.base = base;
    this.type = "tar1090"
    this.logger = logger;
  }

  async fetchAircraftData(): Promise<AircraftData> {
    try {
      const response = await axios.get(this.base);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching aircraft data: ${error}`, "tar1090");
      throw error;
    }
  }
}
