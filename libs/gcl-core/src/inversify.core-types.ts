console.log('Assigning core types');
export class DITypes {
  public static CORE_TYPES = {
    PluginService: Symbol('PluginService'),
    ConfigService: Symbol('ConfigService'),
  };
}

console.log('DITypes export', DITypes.CORE_TYPES)
