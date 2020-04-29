import 'reflect-metadata';
import { Action, createKoaServer, useContainer } from 'routing-controllers';
import { FederationController } from './controllers/federation.controller';
import { Container } from 'typedi';
import { ConfigHelperService } from './services/config-helper.service';
import * as cors from '@koa/cors'
import { Md5Helper } from './utils/md5.helper';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

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

const httpsConfig = {
    key: fs.readFileSync(path.resolve('/etc/ssl/private.key'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/ssl/certs.crt'), 'utf8').toString()
};

https.createServer(httpsConfig, app.callback()).listen('4433');

app.listen(config.port, config.host);
console.log(`Server is running @ https://${config.host}:${config.port}`);
