import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

export class Utilities {
  static readonly YAML_FILE_TYPE = "yaml";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static readYamlFile(path: string): any {
    const content = fs.readFileSync(path, "utf8");
    return yaml.load(content);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static writeYamlFile(path: string, data: any): void {
    const content = yaml.dump(data);
    fs.writeFileSync(path, content);
  }

  static findFilesWithKeyword(
    keyword: string,
    fileType: string,
    startPath: string
  ): string[] {
    const result: string[] = [];
    if (!fs.existsSync(startPath)) {
      console.error(`No such directory: ${startPath}`);
      return result;
    }

    const files = fs.readdirSync(startPath);
    for (const fileName of files) {
      const filePath = path.join(startPath, fileName);
      const stat = fs.lstatSync(filePath);
      if (
        stat.isDirectory() &&
        !(filePath === "node_modules") &&
        !(filePath === ".git")
      ) {
        result.push(
          ...Utilities.findFilesWithKeyword(keyword, fileType, filePath)
        );
      } else if (fileName.includes(keyword) && fileName.includes(fileType)) {
        result.push(filePath);
      }
    }

    return result;
  }


}
