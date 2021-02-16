import { singleton } from "tsyringe";
import { Observable, from, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { Connection } from "projects/extension/connection/utils/connection";
import { Application } from "projects/extension/connection/utils/application";

@singleton()
export class QixApplicationProvider {

    /**
     * read all qlik documents (apps) from enigma session, we currently cache the current connection
     */
    public list<T>(connection: Connection): Observable<EngineAPI.IDocListEntry[]> {
        return from(connection.openSession()).pipe(
            switchMap((session) => session ? from(session.getDocList() as any as Promise<EngineAPI.IDocListEntry[]>) : of([])),
            take(1)
        );
    }

    /**
     * open a document
     */
    public async openDocument(connection: Connection, id: string): Promise<EngineAPI.IApp | undefined> {
        const app      = await connection.getApplication(id);
        const document = await app?.document;
        return document;
    }

    /**
     * read script from app
     */
    public async readScript(connection: Connection, id: string): Promise<string | undefined> {
        const app = await connection.getApplication(id);
        return app?.getScript();
    }

    /**
     * write script to app
     */
    public async writeScript(connection: Connection, id: string, content: string): Promise<void> {
        const application = await connection.getApplication(id);

        if (application) {
            application.script = content;
            await application.updateProperty(content, "script");
            await application.writeScript();
            await application.save();
        }
    }

    /**
     * check app script syntax
     */
    public async checkScriptSyntax(connection: Connection, id: string): Promise<EngineAPI.IScriptSyntaxError[]> {
        const app = await this.openDocument(connection, id);
        if (app) {
            return await app.checkScriptSyntax();
        }
        throw new Error("could not open app");
    }

    /**
     * create a new app
     */
    public createApp(connection: Connection, name: string): Observable<unknown> {
        return from(connection.openSession()).pipe(
            switchMap((global: EngineAPI.IGlobal) => global.createApp(name))
        );
    }

    /**
     * delete app
     */
    public async deleteApp(connection: Connection, appId: string): Promise<void>
    {
        /** first close session on app */
        const app = await connection.getApplication(appId) as Application;
        await app.close();

        /** get global and delete app */
        const session = await connection.openSession();
        if (session) {
            await session.deleteApp(appId);
        }
    }

    /**
     * rename existing app
     *
     * @param connection enigma sesssion
     * @param id id of the app which should renamed
     * @param name the new name of the app
     */
    public async renameApp(connection: Connection, id: string, name: string): Promise<void> {

        /** get global and delete app */
        const app = await this.openDocument(connection, id);
        const properties = await app?.getAppProperties();
        const newProperties = {...properties, qTitle: name} as EngineAPI.INxAppProperties;

        await app?.setAppProperties(newProperties);
    }

    /**
     * get app data
     */
    public getAppData(connection: Connection, id: string): Observable<EngineAPI.IAppEntry> {
        return from(connection.openSession()).pipe(
            switchMap((global: EngineAPI.IGlobal) => global.getAppEntry(id))
        );
    }
}
