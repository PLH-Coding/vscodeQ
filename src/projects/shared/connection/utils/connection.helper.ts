import { buildUrl } from "enigma.js/sense-utilities";
import { create } from "enigma.js";
import schema from "enigma.js/schemas/12.20.0.json";
import WebSocket from "ws";
import { ConnectionSetting, ConnectionData } from "../api";

export abstract class ConnectionHelper {

    /**
     * build url by a given connection
     */
    public static buildUrl(connection: ConnectionSetting): string {

        const isSecure = connection.secure;
        const protocol = isSecure ? 'https://' : 'http://';

        try {
            const url = new URL(protocol + connection.host);
            url.pathname = connection.path ?? "";
            return url.toString();
        } catch (error) {
            console.dir(error);
            throw error;
        }
    }

    /**
     * create a websocket url by a given connection
     */
    public static buildWebsocketUrl(connection: ConnectionSetting, id = "engineData"): string {

        const port = Number(connection.port);

        const options = {
            appId   : id,
            host    : connection.host,
            identity: Math.random().toString(32).substr(2),
            secure  : connection.secure,
            port    : port && !isNaN(port) ? port : connection.secure ? 443 : 80,
            subpath : connection.path ?? ""
        };

        return buildUrl(options);
    }

    /**
     * create a new websocket connection with a given connection
     * @todo refactor this
     */
    public static createWebsocket(url: string, data: ConnectionData): WebSocket
    {
        const headers = {
            Cookie: ""
        };

        data.cookies.forEach(cookie => {
            headers.Cookie = headers.Cookie.concat(`${cookie.name}=${cookie.value.toString()};`);
        });

        const ws = new WebSocket(url, {
            rejectUnauthorized: !data.allowUntrusted,
            headers
        });

        ws.on("error", (error) => {
            console.log(error.toString());
        });

        return ws;
    }

    /**
     * create a new enigma session
     */
    public static createSession(
        connection: ConnectionData,
        id?: string
    ): enigmaJS.ISession {
        const wsUrl = this.buildWebsocketUrl(connection, id);
        return create({
            schema,
            url: wsUrl,
            createSocket: (url) => this.createWebsocket(url, connection),
        });
    }
}
