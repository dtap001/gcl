export interface GCLConfig {
  'core.lastUpdateCheck': Date;
  [key: string]: string | number | boolean | Date | string[];
}

export interface GCLPluginConfig {
  name: string;
  type: string | number | boolean | Date | string[];
}
