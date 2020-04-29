import { Service } from 'typedi';
import * as path from 'path';
import * as fs from 'fs';
import { IConfig } from '../interfaces/config.interface';

@Service()
export class ConfigHelperService {
    private static readonly CONFIG_FILE_PATH = path.resolve('config/config.json');
    private config;

    constructor() {
        this.config = JSON.parse(fs.readFileSync(ConfigHelperService.CONFIG_FILE_PATH).toString());
    }

    public getConfig(): IConfig {
        return this.config;
    }
}
