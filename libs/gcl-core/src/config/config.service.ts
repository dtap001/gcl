import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { GCLConfig, GCLPluginConfig } from './config.interface';
import { ConfigFactory } from './config.factory';
import { injectable } from 'inversify';
import { Logger } from '../utils';

@injectable()
export class ConfigService {
  private knownConfigs: GCLPluginConfig[] = [];
  private configFolderPath = path.join(os.homedir(), '.gcl');
  private configFilePath = path.join(this.configFolderPath, 'config.yaml');

  constructor() {
    Logger.debug(`ConfigService constructor`);
  }

  public registerKnownConfig(config: GCLPluginConfig) {
    Logger.debug(`Registering config ${config.name}`);
    if (!this.knownConfigs.find((c) => c.name === config.name)) {
      this.knownConfigs.push(config);
    } else {
      Logger.debug(`Config ${config.name} already registered`);
    }
  }

  public setConfigValue<K extends keyof GCLConfig>(
    key: K,
    value: GCLConfig[K]
  ): void {
    const config = this.getConfig();
    config[key] = value;
    this.saveConfig(config);
  }

  public getConfigPath(): string {
    return this.configFilePath;
  }

  public getKeys() {
    Logger.debug(`Getting keys` + JSON.stringify(this.knownConfigs));
    return this.knownConfigs.map((config) => config.name);
  }

  public getConfig(): GCLConfig {
    if (!fs.existsSync(this.configFilePath)) {
      return ConfigFactory.createDefaultConfig();
    }

    const configContent = fs.readFileSync(this.configFilePath, 'utf8');
    const configData = yaml.load(configContent) as GCLConfig;
    return configData;
  }

  private saveConfig(config: GCLConfig): void {
    if (!fs.existsSync(this.configFolderPath)) {
      fs.mkdirSync(this.configFolderPath);
    }

    const configContent = yaml.dump(config);
    fs.writeFileSync(this.configFilePath, configContent);
  }
}
