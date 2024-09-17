export interface ITemplate {
    name: string,
    format: string
}

export class Templater implements ITemplate {
    name: string
    format: string

    constructor(name: string, format:string) {
        this.name = name;
        this.format = format;
    }

    process(data: {} = {}): string {
        let msg: string = this.format;
        
        msg = msg.replace(/\$\{([^}]+)\}/g, (match, expression) => {
            try {
                const func = new Function(...Object.keys(data), `return ${expression};`);
                return func(...Object.values(data));
            } catch (error) {
                console.error(`Error processing expression: ${expression}`, error);
                return match; // Return the original expression if it fails to evaluate
            }
        });
        return msg;
    }
}