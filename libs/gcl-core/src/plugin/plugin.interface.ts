import { Container } from "inversify";
import { GCLPluginConfig } from "../config/config.interface";

export interface GCLPlugin {
  pluginName: string;
  commands(): GCLCommand[];
  config?: GCLPluginConfig;
  dependencies: {
    types: {
      [key: string]: symbol;
    };
    register(container: Container): void;
  };
}

export interface GCLCommand {
  command: string;
  description: string;
  action(options: OptionsForGCLCommandAction): Promise<void>;
  options?: GCLCommandOption[];
}

type OptionsForGCLCommandAction = {
  [K in GCLCommandOption['name']]: string | number | boolean;
};

export interface GCLCommandOption {
  name: string;
  description: string;
  default: string | number | boolean;
}

