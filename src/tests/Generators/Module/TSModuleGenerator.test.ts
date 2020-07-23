import Assert = require("assert");
import { spawnSync } from "child_process";
import { TestContext } from "@manuth/extended-yo-generator-test";
import npmWhich = require("npm-which");
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator";

/**
 * Registers tests for the `TSModuleGenerator`.
 *
 * @param context
 * The test-context.
 */
export function TSModuleGeneratorTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleGenerator",
        () =>
        {
            let generator: TSModuleGenerator;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    let runContext = context.ExecuteGenerator();
                    await runContext.toPromise();
                    generator = runContext.generator;
                });

            test(
                "Checking whether the generated project can be installed…",
                function()
                {
                    this.timeout(0);
                    this.slow(2 * 60 * 1000);

                    let result = spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    Assert.strictEqual(result.status, 0);
                });

            test(
                "Checking whether the generated module can be loaded…",
                () =>
                {
                    Assert.doesNotThrow(
                        () =>
                        {
                            require(generator.destinationPath());
                        });
                });

            test(
                "Checking whether the mocha-tests can be executed…",
                function()
                {
                    this.slow(4 * 1000);

                    let result = spawnSync(
                        npmWhich(generator.destinationPath()).sync("mocha"),
                        {
                            cwd: generator.destinationPath()
                        });

                    Assert.strictEqual(result.status, 0);
                });
        });
}