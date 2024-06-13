import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';

@Injectable()
export class LogisticService {
  constructor(private config: ConfigService) {}

//   async getGeolocation() {
//     const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${this.config.get<string>(EnvConfigEnum.GOOGLE_API_KEY)}`;
//     const response = await axios.post(url);
//     return response.data.location;
//   }

//   async getDistanceMatrix(origin: string, destination: string) {
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
//     const response = await axios.get(url, {
//       params: {
//         origins: origin,
//         destinations: destination,
//         key: this.config.get<string>(EnvConfigEnum.GOOGLE_API_KEY),
//       },
//     });
//     return response.data;
//   }

  async getGeolocation(): Promise<any> {
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${this.config.get<string>(EnvConfigEnum.GOOGLE_API_KEY)}`;
    try {
        const response = await axios.post(url);
        return response.data.location;
    } catch (error) {
        console.error('Error fetching geolocation:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch geolocation');
    }
}

async getDistanceMatrix(origin: string, destination: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    try {
        const response = await axios.get(url, {
            params: {
                origins: origin,
                destinations: destination,
                key: this.config.get<string>(EnvConfigEnum.GOOGLE_API_KEY),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching distance matrix:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch distance matrix');
    }
}
}
