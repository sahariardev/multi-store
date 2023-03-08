export default class ValidationError {
    fieldName:string;
    message:string;

    constructor(fieldName:string, message:string) {
        this.fieldName = fieldName;
        this.message = message;
    }

    getFormattedMessage():string {
        return `${this.fieldName}:${this.message}`;
    }
}

export const errorMessageFormatter = (messages:ValidationError[]) => {

}