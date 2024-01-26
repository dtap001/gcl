import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { injectable } from 'inversify';
import { Logger } from '../utils';
import { GCLPluginConfig } from './config.interface';

@injectable()
export class ConfigService {
  private knownConfigs: GCLPluginConfig[] = [];
  private configFolderPath = path.join(os.homedir(), '.gcl');
  private configFilePath = path.join(this.configFolderPath, 'config.yaml');

  public registerKnownConfig(config: GCLPluginConfig) {
    Logger.debug(`Registering config ${JSON.stringify(config)}`);
    this.knownConfigs.push(config);
  }

  public setConfigValue<ConfigType extends GCLPluginConfig>(
    key: keyof ConfigType,
    value: ConfigType[keyof ConfigType]
  ) {
    const config = this.getConfig();
    config[key as string] = value;
    this.saveConfig(config);
    Logger.debug(`Setting config ${String(key)} to ${value}`);
  }

  public getConfigPath(): string {
    return this.configFilePath;
  }

  public getKeys() {
    Logger.debug(`Getting keys` + JSON.stringify(this.knownConfigs));
    const result: string[] = [];
    this.knownConfigs.forEach((config) => {
      Object.keys(config).forEach((key) => {
        result.push(key);
      });
    });
    return result;
  }

  public getConfig<T extends GCLPluginConfig>(): T {
    if (!fs.existsSync(this.configFilePath)) {
      return {} as T;
    }

    const configContent = fs.readFileSync(this.configFilePath, 'utf8');
    const configData = yaml.load(configContent) as T;
    return configData;
  }

  private saveConfig(config: GCLPluginConfig): void {
    if (!fs.existsSync(this.configFolderPath)) {
      fs.mkdirSync(this.configFolderPath);
    }

    const configContent = yaml.dump(config);
    fs.writeFileSync(this.configFilePath, configContent);
  }
}
