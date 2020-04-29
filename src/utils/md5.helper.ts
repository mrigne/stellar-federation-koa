import * as crypto from 'crypto';

export class Md5Helper {
    public static getMd5Hash(value: string): string {
        return crypto.createHash('md5').update(value).digest("hex")
    }
}
