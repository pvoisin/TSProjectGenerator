import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion";
import { TSProjectDestinationQuestion } from "../../../Project/Inquiry/TSProjectDestinationQuestion";
import { TSProjectDisplayNameQuestion } from "../../../Project/Inquiry/TSProjectDisplayNameQuestion";
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion";
import { TSProjectQuestionCollection } from "../../../Project/Inquiry/TSProjectQuestionCollection";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectQuestionCollection` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectQuestionCollectionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectQuestionCollection",
        () =>
        {
            let questionCollection: TSProjectQuestionCollection<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    questionCollection = new TSProjectQuestionCollection(await context.Generator);
                });

            test(
                "Checking whether all necessary questions are present…",
                () =>
                {
                    let questionTypes = [
                        TSProjectDestinationQuestion,
                        TSProjectDisplayNameQuestion,
                        TSProjectModuleNameQuestion,
                        TSProjectDescriptionQuestion
                    ];

                    for (let questionType of questionTypes)
                    {
                        Assert.ok(
                            questionCollection.Questions.some(
                                (question) => question instanceof questionType));
                    }
                });
        });
}
