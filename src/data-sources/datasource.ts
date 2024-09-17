
export interface AircraftData {
  aircraft: {
    hex: string;
    type: string;
    flight: string;
    squawk: string;
    r: string;
    t: string;
    altitude: number;
    speed: number;
    seen: number;
  }[];
}

export interface IDataSource {
  type: string,
  base: string,
}
  

export interface DataSource {
    // All Aircraft
    fetchAircraftData(): Promise<AircraftData>;
}