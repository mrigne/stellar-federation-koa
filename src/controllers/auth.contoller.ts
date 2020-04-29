import { Service } from 'typedi/decorators/Service';
import { Post } from 'routing-controllers/decorator/Post';
import { BodyParam } from 'routing-controllers';
import { ConfigHelperService } from '../services/config-helper.service';
import { Md5Helper } from '../utils/md5.helper';

@Service()
export class AuthController {
    constructor(private configHelper: ConfigHelperService) {}

    @Post('/signin')
    public signIn(@BodyParam('username') username, @BodyParam('password') password): any {
        if (this.isUserCorrect(username, password)) {
            return {
                auth: btoa(`${username}:${Md5Helper.getMd5Hash(password)}`)
            }
        }
    }

    private isUserCorrect(username: string, password: string): any {
        return this.configHelper.getConfig().users.some(userEntry =>
            userEntry.username === username && userEntry.password === password);
    }
}
