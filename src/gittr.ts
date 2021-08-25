import * as Inquirer from 'inquirer';
import * as PromptConstructor from 'inquirer-autocomplete-prompt';
import chalk from 'chalk';

import { Config } from './utils/config';
import { CommitPrompter, ConfigPrompter, SearchPrompter } from './commands';
import { Logger, LogSeverity } from './utils/logger';
import Constants from './utils/constants';
import { EmojiService, PrefixService } from './services';
import { ListPrompter } from './commands/list';
import { PrompterArgs } from './commands/prompts';

Inquirer.registerPrompt('autocomplete', PromptConstructor);

// TODO: Refactor so code is in isolated command dirs later
/**
 * Main class handling CLI functionality.
 *
 * @export
 * @class Gittr
 */
export default class Gittr {
    private config: Config;
    private emojiService: EmojiService;
    private prefixService: PrefixService;
    private prompterArgs: PrompterArgs;

    constructor() {
        this.config = new Config();
        this.setDefaultPreferences(this.config);
        this.emojiService = new EmojiService(this.config);
        this.prefixService = new PrefixService(this.config);

        this.prompterArgs = {
            config: this.config,
            emojiService: this.emojiService,
            prefixService: this.prefixService
        };
    }

    public commit(): void {
        Logger.log(`commit called`, LogSeverity.DEBUG);

        const commitPrompter = new CommitPrompter(this.prompterArgs);
        commitPrompter.prompt();
    }

    public reconfig(): void {
        Logger.log(`reconfig called`, LogSeverity.DEBUG);
        const configPrompter: ConfigPrompter = new ConfigPrompter(this.prompterArgs);
        configPrompter.prompt();
    }

    /**
     * Lists all default/custom emojis defined in Gittr.
     */
    public async list(): Promise<void> {
        Logger.log(`list called`, LogSeverity.DEBUG);
        const listPrompter: ListPrompter = new ListPrompter(this.prompterArgs);

        return listPrompter.prompt();
    }

    public async search(): Promise<void> {
        const searchPrompter: SearchPrompter = new SearchPrompter(this.prompterArgs);
        searchPrompter.prompt();
    }

    public async update() {
        await this.emojiService.get(true);
    }

    public version(): void {
        Logger.log(`version called`, LogSeverity.DEBUG);
        console.log(`${Constants.APP_NAME} - ${Constants.APP_VERSION}`);
    }

    // PRIVATE METHODS

    /**
     * Handles setting default preferences for Gittr on initialization.
     *
     * @private
     * @param {Config} config - the config object used in the application.
     * @memberof Gittr
     */
    private setDefaultPreferences(config: Config): void {
        console.log(config.getConfigValues());
        if (config.getAddAll() === undefined) {
            config.setAddAll(true);
        }
        if (config.getEmojiFormat() === undefined) {
            config.setEmojiFormat(Constants.SETTINGS_EMOJI_FORMAT_MARKDOWN);
        }
        if (config.getSignCommit() === undefined) {
            config.setSignCommit(false);
        }
        if (config.getIsUdacityStyleCommit() === undefined) {
            config.setUdacityStyleCommit(true);
        }
    }
}
