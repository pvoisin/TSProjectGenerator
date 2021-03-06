import { createRequire } from "module";
import { EOL } from "os";
import { relative } from "path";
import { Generator, GeneratorOptions, Question, IComponentCollection, IFileMapping, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TempDirectory } from "@manuth/temp-files";
import chalk = require("chalk");
import JSON = require("comment-json");
import dedent = require("dedent");
import { split } from "eol";
import { ESLint } from "eslint";
import { readFile, writeJSON, readJSON, writeFile } from "fs-extra";
import npmWhich = require("npm-which");
import { Linter } from "tslint";
import { Program } from "typescript";
import { join, resolve } from "upath";
import { BuildDependencies } from "../NPMPackaging/Dependencies/BuildDependencies";
import { LintEssentials } from "../NPMPackaging/Dependencies/LintEssentials";
import { TSProjectComponentCollection } from "./Components/TSProjectComponentCollection";
import { NPMIgnoreFileMapping } from "./FileMappings/NPMIgnoreFileMapping";
import { TSProjectPackageFileMapping } from "./FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSProjectQuestionCollection } from "./Inquiry/TSProjectQuestionCollection";
import { ITSProjectSettings } from "./Settings/ITSProjectSettings";
import { TSProjectComponent } from "./Settings/TSProjectComponent";
import { TSProjectSettingKey } from "./Settings/TSProjectSettingKey";

/**
 * Provides the functionality to generate a project writtein in TypeScript.
 */
export class TSProjectGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends Generator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectGenerator<T>` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: TOptions)
    {
        super(
            args,
            {
                ...options,
                customPriorities: [
                    ...(options.customPriorities as any[] ?? []),
                    {
                        before: "end",
                        priorityName: "cleanup"
                    }
                ]
            });
    }

    /**
     * Gets the path to the directory for the source-files.
     */
    public get SourceRoot(): string
    {
        return "src";
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return new TSProjectQuestionCollection(this).Questions;
    }

    /**
     * @inheritdoc
     */
    public get Components(): IComponentCollection<TSettings, TOptions>
    {
        return new TSProjectComponentCollection(this);
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [
            new TSProjectPackageFileMapping(this),
            {
                Source: this.commonTemplatePath(".gitignore.ejs"),
                Destination: ".gitignore"
            },
            new NPMIgnoreFileMapping(this),
            {
                Source: this.modulePath(".mocharc.jsonc"),
                Destination: ".mocharc.jsonc"
            },
            {
                Source: this.modulePath("tsconfig.base.json"),
                Destination: "tsconfig.base.json",
                Processor: async (fileMapping, generator) =>
                {
                    let tsConfig = JSON.parse((await readFile(fileMapping.Source)).toString());
                    delete tsConfig.compilerOptions.declarationMap;
                    delete tsConfig.compilerOptions.typeRoots;

                    generator.fs.write(fileMapping.Destination, split(JSON.stringify(tsConfig, null, 4)).join(EOL));
                }
            },
            {
                Source: this.modulePath("tsconfig.json"),
                Destination: "tsconfig.json",
                Processor: async (target, generator) =>
                {
                    let tsConfig = JSON.parse((await readFile(target.Source)).toString());

                    if (!this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
                    {
                        delete tsConfig.references;
                    }

                    generator.fs.write(target.Destination, split(JSON.stringify(tsConfig, null, 4)).join(EOL));
                }
            },
            {
                Source: this.modulePath("tsconfig.build.json"),
                Destination: "tsconfig.build.json"
            },
            {
                Source: this.modulePath("src", "tests", "tsconfig.json"),
                Destination: this.destinationPath(this.SourceRoot, "tests", "tsconfig.json")
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        this.log(chalk.whiteBright("Generating the Workspace"));
        this.destinationRoot(this.Settings[TSProjectSettingKey.Destination]);
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        this.log(
            dedent(
                `Your workspace has been generated!

                ${chalk.whiteBright("Installing Dependencies…")}`));

        this.npmInstall();
    }

    /**
     * Cleans the workspace.
     */
    public async cleanup(): Promise<void>
    {
        let tempDir = new TempDirectory();
        let lintPackage = new Package(tempDir.MakePath("package.json"), {});
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = tempDir.MakePath("tsconfig.json");
        let tsConfig = await readJSON(this.destinationPath("tsconfig.json"));
        this.log("");
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));
        this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
        delete tsConfig.extends;
        tsConfig.compilerOptions.rootDir = resolve(this.destinationPath(this.SourceRoot));
        tsConfig.include = [resolve(this.destinationPath(this.SourceRoot, "**", "*"))];
        await writeJSON(tsConfigFile, tsConfig);
        await writeFile(tempDir.MakePath(".eslintrc.js"), await readFile(this.modulePath(".eslintrc.js")));
        lintPackage.Register(new BuildDependencies());
        lintPackage.Register(new LintEssentials());
        await writeJSON(lintPackage.FileName, lintPackage.ToJSON());

        this.spawnCommandSync(
            npmWhich(__dirname).sync("npm"),
            [
                "install",
                "--silent"
            ],
            {
                cwd: tempDir.FullName
            });

        workspaceRequire = createRequire(join(tempDir.FullName, ".js"));
        linterConstructor = workspaceRequire("tslint").Linter;
        eslintConstructor = workspaceRequire("eslint").ESLint;
        program = linterConstructor.createProgram(tsConfigFile);

        linter = new eslintConstructor(
            {
                cwd: tempDir.FullName,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: tempDir.MakePath(".eslintrc.js"),
                overrideConfig: {
                    parserOptions: {
                        project: tsConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${relative(this.destinationPath(), fileName)}"…`));
            await eslintConstructor.outputFixes(await linter.lintFiles(fileName));
        }

        tempDir.Dispose();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        this.log("");

        this.log(
            dedent(
                `
                    ${chalk.whiteBright("Finished!")}
                    Your package "${this.Settings[TSProjectSettingKey.DisplayName]}" has been created!
                    To start editing with Visual Studio Code use the following command:

                        code "${this.Settings[TSProjectSettingKey.Destination]}"`));
    }
}
