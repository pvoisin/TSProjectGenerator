import { IFileMapping } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectComponent } from "../TSProjectComponent";
import { ProjectComponent } from "./ProjectComponent";

/**
 * Provides a component for creating a vscode-workspace.
 */
export class CodeWorkspaceComponent<T extends ITSProjectSettings> extends ProjectComponent<T>
{
    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return TSProjectComponent.VSCode;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "Visual Studio Code Workspace";
    }

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): string
    {
        return ".vscode";
    }

    /**
     * Gets a file-mapping for creating the `extensions.js` file.
     */
    protected get ExtensionsFileMapping(): IFileMapping<T>
    {
        return null;
    }
}
