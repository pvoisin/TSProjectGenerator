import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TestJSONProcessor } from "../../Components/TestJSONProcessor";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "./TestCodeWorkspaceComponent";

/**
 * Registers tests for the `CodeWorkspaceComponent` class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "CodeWorkspaceComponent",
        () =>
        {
            let randomWorkspace: IWorkspaceMetadata;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                });

            setup(
                () =>
                {
                    randomWorkspace = {
                        folders: [],
                        extensions: context.RandomObject,
                        launch: context.RandomObject,
                        settings: context.RandomObject,
                        tasks: context.RandomObject
                    };

                    component.WorkspaceProcessor = new TestJSONProcessor(randomWorkspace);
                });

            test(
                "Checking whether a custom workspace-processor can be injected…",
                async () =>
                {
                    Assert.strictEqual(await component.WorkspaceMetadata, randomWorkspace);
                });

            test(
                "Checking whether the workspace-object is read correctly…",
                async () =>
                {
                    Assert.strictEqual(await component.ExtensionsMetadata, randomWorkspace.extensions);
                    Assert.strictEqual(await component.LaunchMetadata, randomWorkspace.launch);
                    Assert.strictEqual(await component.SettingsMetadata, randomWorkspace.settings);
                    Assert.strictEqual(await component.TasksMetadata, randomWorkspace.tasks);
                });
        });
}
