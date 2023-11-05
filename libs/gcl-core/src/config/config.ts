import fs from "fs";
import os from "os";
import path from "path";
import yaml from "js-yaml";

class GCLConfig {
  [key: string]: any;
  defaultHost: string;
  lastUpdateCheck: Date;
  checkedAnsibleIntall: boolean;
  workingFolders: string[] = [];
  constructor(
    defaultHost: string,
    checkedAnsibleIntall: boolean,
    lastUpdateCheck: Date,
    workingFolders: string[]
  ) {
    this.defaultHost = defaultHost;
    this.lastUpdateCheck = lastUpdateCheck;
    this.checkedAnsibleIntall = checkedAnsibleIntall;
    this.workingFolders = workingFolders;
  }
}

class Configuration {
  private static configFolderPath = path.join(os.homedir(), ".gcl");
  private static configFilePath = path.join(
    Configuration.configFolderPath,
    "config.yaml"
  );
  // Add this method to the GCLConfigUtil class

  public static setConfigValue(key: string, value: any): void {
    const config = this.getConfig();

    if (config.hasOwnProperty(key)) {
      config[key] = value;
      this.saveConfig(config);
    } else {
      console.error(`Invalid config key: ${key}`);
    }
  }

  public static setDefaultHost(defaultHost: string): void {
    const config = this.getConfig();
    config.defaultHost = defaultHost;
    this.saveConfig(config);
  }

  public static addWorkingFolder(folder: string): void {
    const config = this.getConfig();
    config.workingFolders.push(folder);
    this.saveConfig(config);
  }

  public static setCheckedAnsibleInstall(checkedAnsibleIntall: boolean): void {
    const config = this.getConfig();
    config.checkedAnsibleIntall = checkedAnsibleIntall;
    this.saveConfig(config);
  }

  public static setLastUpdateCheck(lastUpdateCheck: Date): void {
    const config = this.getConfig();
    config.lastUpdateCheck = lastUpdateCheck;
    this.saveConfig(config);
  }

  public static getConfigPath(): string {
    return this.configFilePath;
  }

  public static getConfig(): GCLConfig {
    if (!fs.existsSync(this.configFilePath)) {
      return new GCLConfig("", false, new Date(), []);
    }

    const configContent = fs.readFileSync(this.configFilePath, "utf8");
    const configData = yaml.load(configContent) as GCLConfig;
    return new GCLConfig(
      configData.defaultHost,
      configData.checkedAnsibleIntall,
      configData.lastUpdateCheck,
      configData.workingFolders || []
    );
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
