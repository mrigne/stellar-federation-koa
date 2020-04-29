export interface IConfig {
    host: string;
    ssl: ISslConfig;
    port: number;
    database_file: string;
    stellar_toml_file: string;
    users: IUser[];
}

export interface IUser {
    username: string;
    password: string;
}

export interface ISslConfig {
    enabled: boolean;
    cerificate_path: string;
    private_key_path: string;
}
