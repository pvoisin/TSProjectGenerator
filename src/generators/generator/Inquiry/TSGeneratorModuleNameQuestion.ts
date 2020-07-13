import parsePackageName = require("parse-pkg-name");
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";

/**
 * Provides a question for asking for the module-name of a project.
 */
export class TSGeneratorModuleNameQuestion<T extends ITSProjectSettings> extends TSProjectModuleNameQuestion<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorModuleNameQuestion<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value for this question.
     */
    public async default(answers: T): Promise<string>
    {
        return `generator-${(await super.default(answers)).replace(/(generator-)?(.*?)(generator)?$/i, "$2")}`;
    }

    /**
     * @inheritdoc
     *
     * @param input
     * The input provided by the user.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * Either a value indicating whether the input is valid or a string which contains an error-message.
     */
    public async validate(input: string, answers?: T): Promise<boolean | string>
    {
        let result = await super.validate(input, answers);

        if ((typeof result === "boolean") && result)
        {
            let packageName = parsePackageName(input).name;
            return /^generator-.+/.test(packageName) ? true : `The package-name \`${packageName}\` must start with \`generator-\`.`;
        }
        else
        {
            return result;
        }
    }
}
