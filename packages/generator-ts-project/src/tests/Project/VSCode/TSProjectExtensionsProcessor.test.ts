import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectExtensionsProcessor } from "../../../Project/VSCode/TSProjectExtensionsProcessor";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectExtensionsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectExtensionsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectExtensionsProcessor",
        () =>
        {
            let excludedExtension = "digitalbrainstem.javascript-ejs-support";
            let component: TSProjectWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectExtensionsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectExtensionsProcessor(component);
                });

            test(
                `Checking whether the \`${excludedExtension}\` is excluded…`,
                async () =>
                {
                    Assert.ok(
                        !(await processor.Process(
                            {
                                recommendations: [excludedExtension]
                            })).recommendations.includes(excludedExtension));
                });
        });
}
