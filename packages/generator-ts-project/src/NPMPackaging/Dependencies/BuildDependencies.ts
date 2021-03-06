import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides all dependencies which are required for building.
 */
export class BuildDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `CommonDependencies` class.
     */
    public constructor()
    {
        super(
            {
                devDependencies: [
                    "@manuth/tsconfig",
                    "typescript"
                ]
            });
    }
}
