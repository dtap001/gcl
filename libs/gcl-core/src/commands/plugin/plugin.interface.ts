import { GCLPluginConfig } from '../../config/config.interface';

export interface GCLPlugin {
  command: string;
  description: string;
  action(options: OptionsForPluginAction): Promise<void>;
  options?: GCLPluginOption[];
  config?: GCLPluginConfig[];
}

type OptionsForPluginAction = {
  [K in GCLPluginOption['name']]: string | number | boolean;
};

export interface GCLPluginOption {
  name: string;
  description: string;
  default: string | number | boolean;
}
