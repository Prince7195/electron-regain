const electron = require("electron");
const devtron = require("devtron");
const reload = require("electron-reload");
const winStateKeeper = require("electron-window-state");

const { app, BrowserWindow } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// let childWindow;

reload(__dirname);

let modeOfOperation = "Prod";

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";

// bcrypt.genSalt(saltRounds, function(err, salt) {
//   bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//     console.log("Hash Password" + hash);
//   });
// });

function createWindow() {
  // setting the default width and height
  let winState = winStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  });

  // Create a Browser Window
  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    backgroundColor: "#ff0000",
    minWidth: 400,
    minHeight: 200
  });

  // used to manage the window size and position when window is reopenend
  winState.manage(mainWindow);

  // childWindow = new BrowserWindow({
  //   width: 800,
  //   height: 400,
  //   backgroundColor: "#0000ff",
  //   parent: mainWindow,
  //   modal: true,
  //   show: false
  // });

  // Load index.html of the app
  mainWindow.loadFile("index.html");

  let mainContent = mainWindow.webContents;
  mainContent.on("new-window", function(e, url) {
    e.preventDefault();
    let modalWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: mainWindow,
      modal: true
    });
    modalWindow.loadURL(url);
    modalWindow.on("closed", function() {
      modalWindow = null;
    });
  });

  // childWindow.loadURL("https://www.github.com/Prince7195");

  // childWindow.once("ready-to-show", function() {
  //   childWindow.show();
  // });

  // Open Dev tools
  if (modeOfOperation === "Dev") {
    mainWindow.webContents.openDevTools();
    devtron.install();
  }

  // Emitted when the window is closed
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  // childWindow.on("closed", function() {
  //   childWindow = null;
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quite when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On Os X it's common to re-create a window in a app when the dock icon is clicked and there is no other window open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Listen for the intention to quit app.
app.on("before-quit", function(e) {
  // console.log("About to Quit the App. Stopping the App.");
  // e.preventDefault();
});

// Listen for app blur
app.on("browser-window-blur", function(e) {
  // console.log("window out of focus");
  // Quit after 3 sec
  // setTimeout(() => {
  //   app.quit();
  // }, 3000);
});

// Listen for app focus
app.on("browser-window-focus", function(e) {
  // console.log("window in focus");
});
