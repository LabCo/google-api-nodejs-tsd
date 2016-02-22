'use strict';

import * as nunjucks from "nunjucks";
import {Environment} from "nunjucks";

type Globals = { [key: string]: string; };

export abstract class Renderer {
    protected globals: Globals;

    constructor(globals: Globals) {
        this.globals = globals;
    }

    abstract render(template: string, data: any): Promise<string>;
}

export class NunjucksRenderer extends Renderer {
    private env: Environment;

    constructor(path: string, globals: Globals) {
        super(globals);

        this.env = nunjucks.configure(path, {
            autoescape: false
        });

        for (let name in globals) {
            this.env.addGlobal(name, globals[name]);
        }

        this.env.addFilter('mname', (input: string) => {
            return "'" + input + "'";
        });
    }

    render(template: string, data: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.env.renderString(template, data, (e, result) => {
                if (e) {
                    return reject(e);
                }

                return resolve(result);
            });
        });
    }
}