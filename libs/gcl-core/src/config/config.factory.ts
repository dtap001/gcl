export class ConfigFactory {
  static createDefaultConfig() {
    return {
      'core.lastUpdateCheck': new Date(),
      'ansible.defaultHost': '',
      'ansible.checkedAnsibleIntall': false,
      'ansible.workingFolders': [],
      plugins: [],
    };
  }
}
