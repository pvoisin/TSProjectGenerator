import Assert = require("assert");
import { isNullOrUndefined } from "util";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { TestJSONProcessor } from "../Components/TestJSONProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";
import { TestWorkspaceProcessor } from "./Components/TestWorkspaceProcessor";
import { TestCodeWorkspaceProvider } from "./FileMappings/TestCodeWorkspaceProvider";

/**
 * Registers tests for the `WorkspaceProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "WorkspaceProcessor",
        () =>
        {
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;
            let workspaceProcessor: TestWorkspaceProcessor<ITestGeneratorSettings, GeneratorOptions>;
            let randomExtensions: IExtensionSettings;
            let randomDebugSettings: ILaunchSettings;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskSettings;
            let workspaceLoader: TestCodeWorkspaceProvider<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    workspaceLoader = new TestCodeWorkspaceProvider(component);
                    component.Source = workspaceLoader;
                    workspaceProcessor = new TestWorkspaceProcessor(component);
                    component.WorkspaceProcessor = workspaceProcessor;
                });

            setup(
                async () =>
                {
                    randomExtensions = context.RandomObject;
                    randomDebugSettings = context.RandomObject;
                    randomSettings = context.RandomObject;
                    randomTasks = context.RandomObject;

                    let extensionsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomExtensions);
                    let debugSettingsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomDebugSettings);
                    let settingsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomSettings);
                    let tasksProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomTasks);

                    let workspace = await workspaceLoader.WorkspaceMetadata;
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;
                    workspace.tasks = context.RandomObject;
                    workspaceProcessor.ExtensionsProcessor = extensionsProcessor;
                    workspaceProcessor.LaunchSettingsProcessor = debugSettingsProcessor;
                    workspaceProcessor.SettingsProcessor = settingsProcessor;
                    workspaceProcessor.TasksProcessor = tasksProcessor;
                });

            test(
                "Checking whether custom processors can be injected…",
                async () =>
                {
                    Assert.strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    Assert.strictEqual(await component.LaunchMetadata, randomDebugSettings);
                    Assert.strictEqual(await component.SettingsMetadata, randomSettings);
                    Assert.strictEqual(await component.TasksMetadata, randomTasks);
                });

            test(
                "Checking whether processors are executed only if the corresponding property exists…",
                async () =>
                {
                    Assert.strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    delete (await workspaceLoader.WorkspaceMetadata).extensions;
                    Assert.notStrictEqual(await component.ExtensionsMetadata, randomExtensions);
                    Assert.ok(isNullOrUndefined(await component.ExtensionsMetadata));
                });
        });
}
