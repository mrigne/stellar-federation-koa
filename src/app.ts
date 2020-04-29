import 'reflect-metadata';
import { Action, createKoaServer, useContainer } from 'routing-controllers';
import { FederationController } from './controllers/federation.controller';
import { Container } from 'typedi';
import { ConfigHelperService } from './services/config-helper.service';
import * as cors from '@koa/cors'
import { Md5Helper } from './utils/md5.helper';

const config = Container.get(ConfigHelperService).getConfig();
useContainer(Container);

const app = createKoaServer({
    controllers: [FederationController],
    cors: cors({
        allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Key'],
        origin: '*'
    }),
    authorizationChecker: (action: Action) => {
        const token = action.request.headers["authorization"];
        const [username, hash] = atob(token.replace('Bearer ', '')).split(':');

        return config.users.some(userEntry => userEntry.username === username && Md5Helper.getMd5Hash(userEntry.password) === hash);
    }
});

app.listen(config.port);
console.log('Ыerver is running @ localhost: ' + config.port);
