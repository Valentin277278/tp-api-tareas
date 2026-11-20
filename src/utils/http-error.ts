export class HttpError extends Error {
    status: number;

    constructor(status: number, menssage: string) {
        super(menssage);
        this.status = status;
    }
}