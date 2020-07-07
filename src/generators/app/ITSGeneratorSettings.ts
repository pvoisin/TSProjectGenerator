import { IGeneratorSettings } from "extended-yo-generator";
import { LintRuleset } from "../../Linting/LintRuleset";
import { ISubGenerator } from "./ISubGenerator";
import { TSGeneratorSetting } from "./TSGeneratorSetting";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface ITSGeneratorSettings extends IGeneratorSettings
{
    /**
     * Gets or sets the name.
     */
    [TSGeneratorSetting.DisplayName]: string;

    /**
     * Gets or sets the module-name.
     */
    [TSGeneratorSetting.Name]: string;

    /**
     * Gets or sets the description.
     */
    [TSGeneratorSetting.Description]: string;

    /**
     * Gets or sets the destination.
     */
    [TSGeneratorSetting.Destination]: string;

    /**
     * Gets or sets the lint-ruleset.
     */
    [TSGeneratorSetting.LintRuleset]: LintRuleset;

    /**
     * Gets or sets the sub-generator.
     */
    [TSGeneratorSetting.SubGenerator]: ISubGenerator;
}
