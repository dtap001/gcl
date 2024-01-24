console.log('Assigning core types');
export class DITypes {
  public static CORE_TYPES = {
    PluginService: Symbol('PluginService'),
    ConfigService: Symbol('ConfigService'),
  };
  public static EXTRA_TYPES = {};
}
console.log('DITypes export', DITypes.CORE_TYPES)
/*    AddFolderCommand: Symbol('AddFolderCommand'),
    AnsibleRunCommand: Symbol('AnsibleRunCommand'),
    AddHostCommand: Symbol('AddHostCommand'),
    ConfigCommand: Symbol('ConfigCommand'),*/
