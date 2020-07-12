import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { CodeWorkspaceComponent } from "../../Components/CodeWorkspaceComponent";
import { ITSProjectSettings } from "../../ITSProjectSettings";
import { VSCodeWorkspaceFileMapping } from "./VSCodeWorkspaceFileMapping";

/**
 * Provides a file-mapping for copying the `launch.json` file.
 */
export class VSCodeLaunchFileMapping<T extends ITSProjectSettings> extends VSCodeWorkspaceFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeLaunchFileMapping` class.
     *
     * @param codeWorkspaceComponent
     * The workspace-component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return generator.modulePath(this.SettingsFolderName, "settings.json");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return join(this.SettingsFolderName, "settings.json");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     */
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        let settings: Record<string, any> = JSON.parse((await readFile(await fileMapping.Source)).toString());

        for (let key in settings)
        {
            if (await this.FilterSettingKey(key))
            {
                settings[key] = await this.ProcessSetting(key, settings[key]);
            }
            else
            {
                delete settings[key];
            }
        }

        generator.fs.write(await fileMapping.Destination, JSON.stringify(settings, null, 4));
    }

    /**
     * Filters a setting by its key.
     *
     * @param key
     * The key of the setting
     *
     * @returns
     * A value indicating whether the setting with the specified key should be included.
     */
    protected async FilterSettingKey(key: string): Promise<boolean>
    {
        return key !== "files.associations";
    }

    /**
     * Processes a setting.
     *
     * @param key
     * The key of the setting to process
     *
     * @param value
     * The value of the setting to process.
     *
     * @returns
     * The processed setting.
     */
    protected async ProcessSetting(key: string, value: any): Promise<any>
    {
        return value;
    }
}