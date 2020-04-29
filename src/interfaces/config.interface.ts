export interface IConfig {
    host: string;
    port: number;
    database_file: string;
    stellar_toml_file: string;
    users: IUser[];
}

export interface IUser {
    username: string;
    password: string;
}
