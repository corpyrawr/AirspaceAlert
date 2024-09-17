import axios from 'axios';
import {Logger} from '../utils/logger'
import { AircraftData, DataSource } from './datasource';

export class Tar1090 implements DataSource {
  private baseUrl: string;
  private logger: Logger;

  constructor(baseUrl: string, logger: Logger) {
    this.baseUrl = baseUrl;
    this.logger = logger;
  }

  async fetchAircraftData(): Promise<AircraftData> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching aircraft data: ${error}`, "tar1090");
      throw error;
    }
  }
}
