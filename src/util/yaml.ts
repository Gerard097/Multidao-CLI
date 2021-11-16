import { readFileSync } from 'fs'

const yaml = require("js-yaml");

export interface Params {
    [key: string]: {
        desc: string
        value: any
    } 
}

const getKeyValue = (key: string, value: any, comment?:string) => {
    return `${comment ? `#${comment}\n` : ''}${key}: ${value}`
}

export const paramsToYAML = (params: Params) => {
    let str = "";
    for (let key in params) {
        str += getKeyValue(key, params[key].value, params[key].desc) + "\n";
    }
    return str;
}

export const readYAML = (file: string): Params => {
    let params: Params = {};
    let yamlObj = yaml.load(readFileSync(file, 'utf8'));

    for (let key in yamlObj) {
        params[key] = { desc: '', value: yamlObj[key] }
    }

    return params;
}