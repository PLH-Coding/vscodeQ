import { AuthorizationSetting } from "projects/extension/authorization/api";
import { Storage } from "@core/storage";
import { AuthorizationStrategyConstructor } from "../../authorization/strategies/authorization.strategy";

export interface DisplaySettings {
    dimensions: boolean;
    measures: boolean;
    script: boolean;
    sheets: boolean;
    variables: boolean;
}

/** connection settings */
export interface ConnectionSetting {

    /**
     *
     */
    label: string;

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port?: number;

    /**
     * additional path (proxy)
     */
    path: string;

    /**
     * secure connection
     */
    secure: boolean;

    /**
     * authorization settings
     */
    authorization: AuthorizationSetting;
}

export interface ConnectionConfiguration {

    id: string;

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port?: number;

    /**
     * additional path (proxy)
     */
    path: string;

    /**
     * secure connection
     */
    secure: boolean;

    /**
     * secure connection
     */
    strategy: AuthorizationStrategyConstructor;

    /**
     * storage to write connection specific data
     */
    storage?: Storage;
}