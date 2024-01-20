export interface GCLConfig {
  'core.lastUpdateCheck': Date;
  'ansible.defaultHost': string;
  'ansible.checkedAnsibleIntall': boolean;
  'ansible.workingFolders': string[];
  plugins: GCLPluginConfig[];
}

export interface GCLPluginConfig {
  name: string;
}
