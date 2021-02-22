import "electron";
import { app, BrowserWindow, Menu, session } from "electron";

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    const params = process.argv.slice(2);

    mainWindow.once("close", async ($event) => {
        $event.preventDefault();
        const cookies = await session.defaultSession.cookies.get({});
        if (process.send) {
            process.send({
                method: 'authorized',
                cookies
            });
        }
        mainWindow.close();
    });

    if (typeof params[0] === "string") {
        mainWindow.loadURL(params[0]);
    }
}

const template: any[] = [{
    label: 'Edit',
    submenu: [{
        role: 'toggleDevTools'
    }]
}];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    createWindow();

    app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});