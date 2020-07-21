import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";

/**
 * Registers tests for the `Generator`-generator.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "Generator",
        () =>
        {
            ComponentTests(context);
            FileMappingTests(context);
        });
}