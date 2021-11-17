import { readFileSync } from 'fs'
import { getItem } from '../eosio/api';
import { CLIError } from '@oclif/errors'

const path = require('path');

const yaml = require("js-yaml");

interface Param {
    desc: string
    value: any
    type: string
}

export interface Params {
    [key: string]: Param
}

const getContentItem = (key: string, data: Param) => {
    return getItem(key, data.value, data.type);
}

const getKeyValueStr = (key: string, value: any, comment?:string) => {
    return `${comment ? `#${comment}\n` : ''}${key}: ${value}`
}

export const paramsToYAML = (params: Params) => {
    let str = "";
    for (let key in params) {
        str += getKeyValueStr(key, params[key].value, params[key].desc) + "\n";
    }
    return str;
}

interface ReadParams {
    [key: string]: boolean
}

/**
 * 
 * @param file YAML file to read
 * @param requiredParams Map containing the required parameters to read
 * @returns A map with the readed parameters and an array of missing parameters
 * from the paramsMap
 */
export const readYAML = (file: string, requiredParams: Params): [Params, string[]] => {
    let params: Params = {};

    if (path.extname(file) != '.yaml') {
        throw new CLIError('Expected file extension to be .yaml');
    }
        
    let yamlObj = yaml.load(readFileSync(file, 'utf8'));

    for (let key in yamlObj) {

        if (!(requiredParams as Object).hasOwnProperty(key)) {
            console.log(`Key '${key}' is not an expected parameter, ignoring it!`);
            continue;
        }

        params[key] = { ...requiredParams[key], value: yamlObj[key] }
    }

    const readedKeys = Object.keys(params);
    //Check
    const missing = Object.keys(requiredParams).filter((key) => {
        return readedKeys.indexOf(key) === -1 || 
               params[key].value === null;
    });

    return [params, missing];
}

interface Account {
    name: string
    private_key: string
}

export const readAccountYAML = (file: string): Account => {

    if (path.extname(file) != '.yaml') {
        throw new CLIError('Expected file extension to be .yaml');
    }

    let yamlObj = yaml.load(readFileSync(file, 'utf8'));

    if (!(yamlObj as Object).hasOwnProperty('name')) {
        throw new CLIError("Missing variable 'name'");
    }

    if (!(yamlObj as Object).hasOwnProperty('private_key')) {
        throw new CLIError("Missing variable 'key'");
    }

    return { name: yamlObj.name, private_key: yamlObj.private_key };
}

