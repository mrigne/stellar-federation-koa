import { Post } from 'routing-controllers/decorator/Post';
import { BodyParam, JsonController } from 'routing-controllers';
import { ConfigHelperService } from '../services/config-helper.service';
import { Md5Helper } from '../utils/md5.helper';
import { WrongCredentialsError } from '../errors/wrong-credentials.error';

@JsonController()
export class AuthController {
    constructor(private configHelper: ConfigHelperService) {}

    @Post('/signin')
    public signIn(@BodyParam('username') username, @BodyParam('password') password): any {
        if (this.isUserCorrect(username, password)) {
            return {
                auth: Buffer.from(`${username}:${Md5Helper.getMd5Hash(password)}`).toString('base64')
            }
        } else {
            throw new WrongCredentialsError({
                error: {
                    type: 'WrongCredentialsError'
                }
            });
        }
    }

    private isUserCorrect(username: string, password: string): any {
        return this.configHelper.getConfig().users.some(userEntry =>
            userEntry.username === username && userEntry.password === password);
    }
}
