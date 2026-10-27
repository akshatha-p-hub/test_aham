export class Credentials {
    static getEmail(): string {
    return process.env.EMAIL || '';
    }

static getPassword(): string {
    return process.env.PASSWORD || '';
    }

}