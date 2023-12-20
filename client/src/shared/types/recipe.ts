/*
 * Copyright (c) 2023 Josef Müller.
 */

import {useIonRouter} from '@ionic/vue';
import {getLocaleStr, LocaleStr, newLocaleStr} from '@/shared/locales/i18n';
import {APP_NAME, Item, RecipeItem, recipeItemFromJSON, share, Step, tmpId} from '@/shared';
import {logError, logWarn} from '@/shared/utils/logging';

/**
 * Recipe
 * It is a recipe with a list of steps
 * It contains all the information about a recipe
 */
export class Recipe {
    id: string;
    name: LocaleStr;
    desc: LocaleStr;
    steps: Step[];
    items: Set<RecipeItem>;
    props: {
        imgUrl?: string;
        duration?: number;
        date: Date;
        tags?: string[];
    };
    src: {
        url?: string;
        authors: {
            name: string;
            url?: string;
        }[];
        cr?: string;
        cookBook?: {
            name: string;
            url?: string;
            pub?: string;
        }
    };
    notes?: LocaleStr;
    servings: number;
    computed: {
        itemsById: { [id: string]: RecipeItem }
    }

    /**
     * Copy constructor for a recipe
     * @param recipe the recipe to copy
     */
    constructor(recipe?: Recipe) {
        // create a temporary id to identify the recipe in the store before it is saved
        this.id = recipe?.id ?? tmpId()
        this.name = recipe?.name ?? newLocaleStr()
        this.desc = recipe?.desc ?? newLocaleStr()
        this.props = recipe?.props ?? {
            imgUrl: '',
            duration: 0,
            date: new Date(),
            tags: [],
        }
        this.steps = recipe?.steps ?? []
        this.items = new Set(recipe?.items ?? [])
        this.src = recipe?.src ?? {
            url: '',
            authors: [],
        }
        this.computed = {
            itemsById: {}
        }
        this.servings = 1
        this.notes = newLocaleStr()
    }

    /**
     * Get the id of the recipe
     * @returns the id of the recipe
     * @throws an error if the id is undefined
     */
    public getId(): string {
        return this.id
    }

    /**
     * Get the localized name of the recipe
     */
    public getName(): string {
        return getLocaleStr(this.name)
    }

    /**
     * Get the localized description of the recipe
     */
    public getDescription(): string {
        return getLocaleStr(this.desc)
    }

    public getShortDescription(): string {
        return getLocaleStr(this.desc).split('.').slice(0, 2).join('.') + '.';
    }

    public getAuthors(): string {
        return this.src.authors.map(author => author.name).join(', ')
    }

    /**
     * Get the duration of the recipe. It is the sum of the duration of all steps.
     * @returns the duration of the recipe
     */
    public getDuration(): number {
        return this.steps.reduce((acc, step) => acc + (step.duration ?? 0), 0)
    }

    public getTags(): string[] {
        return this.props.tags ?? []
    }

    /**
     * Get all unique items in the recipe
     * @returns a list of all items in the recipe
     */
    public getRecipeItems(): RecipeItem[] {
        return Array.from(this.items)
    }

    public getItems(): Item[] {
        return this.getRecipeItems().map(recipeItem => recipeItem.narrow(recipeItem))
    }

    public hasItem(id?: string): boolean {
        return typeof id !== 'undefined' && typeof this.computed.itemsById[id] !== 'undefined'
    }

    /**
     * Share the recipe with buddies
     * This will open the share dialog of the device
     * @returns a promise that resolves when the share dialog is closed
     */
    public async share() {
        return share({
            title: 'Share your recipe with your friends',
            text: `Check out this recipe for ${this.getName()} on ${APP_NAME}!`,
            url: '#' + this.getRoute(),
            dialogTitle: 'Share with your friends',
        })
    }

    /**
     * Get the route to the recipe
     */
    public getRoute(): string {
        return '/recipe/show/' + this.getId()
    }

    /**
     * Navigate to the recipe
     */
    public route(): void {
        const router = useIonRouter()
        router.push(this.getRoute())
    }

    /**
     * Update the servings of the recipe
     * @param servings
     */
    public setServings(servings: number) {
        this.servings = servings
        this.items.forEach((item) => {
            item.setServings(servings)
        })
    }

    /**
     * Prototype function to get the price of the recipe
     */
    public getPrice(): number {
        let price = 0
        for (const item of this.getRecipeItems()) {
            price += item.getPrice() * item.servings
        }
        return Math.floor(price)
    }
}

/**
 * Initialize a recipe from a json object
 * This is done because the json object does not have the methods of the class
 *
 * @param json
 * @returns a new recipe
 */
export function recipeFromJSON(json: any): Promise<Recipe> {
    return new Promise<Recipe>((resolve, reject) => {
        const recipe = new Recipe()

        // Id
        recipe.id = json.id
        if (recipe.id === undefined) {
            logWarn('recipeFromJSON', 'id is undefined.')
        }

        recipe.name = json.name
        recipe.desc = json.desc
        recipe.steps = json.steps?.map(Step.fromJSON) ?? [new Step()]
        recipe.items = json.items?.map(recipeItemFromJSON) ?? []

        // Props
        recipe.props.imgUrl = json?.props?.imgUrl
        recipe.props.tags = json?.props?.tags
        recipe.props.duration = json?.props?.duration
        recipe.props.date = new Date(json?.props?.date)

        // Source
        recipe.src = json.src
        resolve(recipe)
    }).catch((error: Error) => {
        logError('recipe.fromJSON', error)
        throw error
    })
}