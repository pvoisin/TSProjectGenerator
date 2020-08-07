import { IGeneratorSettings, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { FileMappingTester } from "./FileMappingTester";
/**
 * Provides the functionality to test json files-mappings.
 */
export class JSONFileMappingTester<TGenerator extends IGenerator<TSettings>, TSettings extends IGeneratorSettings, TFileMapping extends IFileMapping<TSettings>> extends FileMappingTester<TGenerator, TSettings, TFileMapping>
{
    /**
     * Initializes a new instance of the `JSONFileMappingTester` class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets the metadata of inside the file-mapping output.
     */
    public get Metadata(): Promise<any>
    {
        return (
            async () =>
            {
                return JSON.parse(await this.Content);
            })();
    }
}