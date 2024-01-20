import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { GCLConfig } from './config.interface';
import { ConfigFactory } from './config.factory';

class Configuration {
  private static configFolderPath = path.join(os.homedir(), '.gcl');
  private static configFilePath = path.join(
    Configuration.configFolderPath,
    'config.yaml'
  );
  // Add this method to the GCLConfigUtil class

  public static setConfigValue<K extends keyof GCLConfig>(
    key: K,
    value: GCLConfig[K]
  ): void {
    const config = this.getConfig();
    config[key] = value;
    this.saveConfig(config);
  }

  public static getConfigPath(): string {
    return this.configFilePath;
  }

  public static getConfig(): GCLConfig {
    if (!fs.existsSync(this.configFilePath)) {
      return ConfigFactory.createDefaultConfig();
    }

    const configContent = fs.readFileSync(this.configFilePath, 'utf8');
    const configData = yaml.load(configContent) as GCLConfig;
    return configData;
  }

  private static saveConfig(config: GCLConfig): void {
    if (!fs.existsSync(this.configFolderPath)) {
      fs.mkdirSync(this.configFolderPath);
    }

    const configContent = yaml.dump(config);
    fs.writeFileSync(this.configFilePath, configContent);
  }
}

export { GCLConfig, Configuration };
