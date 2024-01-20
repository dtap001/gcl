import { GCLPluginConfig } from '../config/config.interface';

export interface GCLCommand {
  command: string;
  description: string;
  action(options: OptionsForGCLCommandAction): Promise<void>;
  options?: GCLCommandOption[];
  config?: GCLPluginConfig[];
}

type OptionsForGCLCommandAction = {
  [K in GCLCommandOption['name']]: string | number | boolean;
};

export interface GCLCommandOption {
  name: string;
  description: string;
  default: string | number | boolean;
}
