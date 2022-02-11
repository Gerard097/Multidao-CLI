import { flags } from "@oclif/command"

export const getAuthFlag = (required = false) => {
    return flags.string({
        char: 'a',
        description: 'File containing account and private-key used to sign the transactions',
        required
    });
}

export const getConfigFileFlag = () => {
    return flags.string({
        description: "Path to the configuration file, defaults to config.yaml",
        default: "config.yaml",
        char: "F"
    });
}