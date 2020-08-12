import Assert = require("assert");
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { ExtensionsProcessor } from "../../VSCode/ExtensionsProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `ExtensionsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function ExtensionsProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "ExtensionsProcessor",
        () =>
        {
            let includedExtension: string;
            let excludedExtension: string;
            let processor: ExtensionsProcessor<ITestGeneratorSettings>;

            /**
             * Provides an implementation of the `ExtensionsProcessor` class for testing.
             */
            class TestExtensionsProcessor extends ExtensionsProcessor<ITestGeneratorSettings>
            {
                /**
                 * @inheritdoc
                 *
                 * @param recommendations
                 * The recommendations to filter.
                 *
                 * @returns
                 * All necessary recommendations.
                 */
                protected async FilterRecommendations(recommendations: string[]): Promise<string[]>
                {
                    return recommendations.filter((extension) => extension !== excludedExtension);
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    processor = new TestExtensionsProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedExtension = context.RandomString;
                    excludedExtension = context.RandomString;
                });

            test(
                "Checking whether recommendations can be filtered…",
                async () =>
                {
                    Assert.ok(!(
                        await processor.Process(
                            {
                                recommendations: [
                                    includedExtension,
                                    excludedExtension
                                ]
                            })).recommendations.includes(excludedExtension));
                });

            test(
                "Checking whether recommendations are only processed if existent…",
                async () =>
                {
                    Assert.ok(!("recommendations" in await processor.Process({})));
                });
        });
}
