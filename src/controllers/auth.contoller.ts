import { Post } from 'routing-controllers/decorator/Post';
import { Authorized, BodyParam, CurrentUser, Get, JsonController } from 'routing-controllers';
import { ConfigHelperService } from '../services/config-helper.service';
import { Md5Helper } from '../utils/md5.helper';
import { WrongCredentialsError } from '../errors/wrong-credentials.error';

@JsonController()
export class AuthController {
    constructor(private configHelper: ConfigHelperService) {}

    @Post('/signin')
    public signIn(@BodyParam('login') login: string, @BodyParam('password') password: string): any {
        if (this.isUserCorrect(login, password)) {
            return {
                tokenType: 'Basic',
                token: Buffer.from(`${login}:${Md5Helper.getMd5Hash(password)}`).toString('base64')
            }
        } else {
            throw new WrongCredentialsError({
                error: {
                    type: 'WrongCredentialsError'
                }
            });
        }
    }

    @Authorized()
    @Get('/whoami')
    public getUserName(@CurrentUser() username?: string): any {
        return {
            username
        };
    }

    private isUserCorrect(username: string, password: string): any {
        return this.configHelper.getConfig().users.some(userEntry =>
            userEntry.username === username && userEntry.password === password);
    }
}
