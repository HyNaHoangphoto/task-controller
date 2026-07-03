/**
 * Electron main process — Task Controller Desktop (wrapper build)
 *
 * Thin wrapper: cửa sổ load thẳng URL app đã deploy (Vercel), mọi logic
 * (NextAuth Google OAuth, API routes, DB) chạy trên server — .exe không
 * chứa secret nào cả.
 *
 *   Dev    :  set TC_APP_URL=http://localhost:3000 && electron .
 *   Prod   :  electron .            (load URL Vercel bên dưới)
 *   Build  :  npm run dist          (electron-builder → NSIS .exe)
 */

const { app, BrowserWindow, shell, Menu, session } = require("electron");
const path = require("path");

// ⚠️ Sau khi deploy web app lên Vercel, thay URL bên dưới bằng domain thật.
const APP_URL =
  process.env.TC_APP_URL || "https://task-controller-lilac.vercel.app";
const APP_ORIGIN = new URL(APP_URL).origin;

const START_URL = process.env.TC_START_URL || APP_ORIGIN + "/login";

const INTERNAL_HOST_SUFFIXES = [
  new URL(APP_URL).hostname,
  "google.com",
  "googleusercontent.com",
  "gstatic.com",
  "accounts.google.com",
];

function isInternal(targetUrl) {
  try {
    const host = new URL(targetUrl).hostname;
    return INTERNAL_HOST_SUFFIXES.some((s) => host === s || host.endsWith("." + s));
  } catch {
    return false;
  }
}

let mainWindow = null;
let splashWindow = null;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 360,
    height: 420,
    frame: false,
    resizable: false,
    backgroundColor: "#131314",
    alwaysOnTop: true,
    center: true,
    icon: path.join(__dirname, "..", "build", "icon.png"),
    webPreferences: { contextIsolation: true },
  });
  splashWindow.loadURL(
    "data:text/html;charset=utf-8," +
      encodeURIComponent(`<!doctype html><html><head><meta charset="utf-8">
      <style>
        html,body{height:100%;margin:0;background:#131314;overflow:hidden}
        body{display:flex;flex-direction:column;align-items:center;justify-content:center;
          font-family:'Segoe UI',system-ui,sans-serif;color:#e8eaed;gap:16px;-webkit-app-region:drag}
        .logo{width:64px;height:64px;border-radius:16px;
          background:linear-gradient(135deg,#5be58a,#34a853);
          display:flex;align-items:center;justify-content:center;
          font-size:30px;font-weight:700;color:#fff;
          box-shadow:0 8px 24px rgba(52,168,83,.35);
          animation:pulse 1.8s ease-in-out infinite}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        h1{font-size:17px;font-weight:600;margin:0}
        p{font-size:12px;color:#8b8d90;margin:0}
        .dots{display:flex;gap:6px;margin-top:6px}
        .dot{width:6px;height:6px;border-radius:50%;background:#34a853;opacity:.3;
          animation:blink 1.2s infinite ease-in-out}
        .dot:nth-child(2){animation-delay:.2s}
        .dot:nth-child(3){animation-delay:.4s}
        @keyframes blink{0%,80%,100%{opacity:.3}40%{opacity:1}}
      </style></head>
      <body>
        <div class="logo">#</div>
        <h1>Task Controller</h1>
        <p>Đang khởi động workspace của bạn...</p>
        <div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      </body></html>`)
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 832,
    minWidth: 940,
    minHeight: 620,
    show: false,
    backgroundColor: "#131314",
    title: "Task Controller",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const chromeUA = mainWindow.webContents.userAgent
    .replace(/\sElectron\/[\d.]+/, "")
    .replace(/\sTask Controller\/[\d.]+/, "");
  mainWindow.webContents.setUserAgent(chromeUA);

  Promise.all([
    session.defaultSession.clearCache(),
    session.defaultSession.clearStorageData({ storages: ["serviceworkers", "cachestorage"] }),
  ]).then(() => {
    mainWindow.loadURL(START_URL, { userAgent: chromeUA });
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isInternal(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.on("did-fail-load", (_e, errorCode, _desc, validatedURL, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(offlineHtml(validatedURL)));
  });
}

function offlineHtml(targetUrl) {
  const url = targetUrl || START_URL;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Task Controller</title>
  <style>
    html,body{height:100%;margin:0}
    body{display:flex;align-items:center;justify-content:center;
      background:#131314;color:#e8eaed;
      font-family:'Segoe UI',system-ui,sans-serif;text-align:center}
    .box{max-width:380px;padding:24px}
    h1{font-size:20px;margin:0 0 8px}
    p{color:#abadb0;font-size:14px;line-height:1.6;margin:0 0 20px}
    button{background:linear-gradient(90deg,#5be58a,#34a853);color:#fff;border:0;
      padding:11px 22px;border-radius:9999px;font-weight:600;font-size:14px;cursor:pointer}
    .dot{width:8px;height:8px;border-radius:50%;background:#f28b82;display:inline-block;margin-right:8px}
  </style></head>
  <body><div class="box">
    <h1><span class="dot"></span>Không có kết nối mạng</h1>
    <p>Task Controller cần Internet cho lần mở đầu. Kiểm tra kết nối rồi thử lại.</p>
    <button onclick="location.href='${url}'">Thử lại</button>
  </div></body></html>`;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(buildMenu());
    createSplash();
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function buildMenu() {
  const isMac = process.platform === "darwin";
  return Menu.buildFromTemplate([
    ...(isMac ? [{ role: "appMenu" }] : []),
    { label: "Tệp", submenu: [isMac ? { role: "close" } : { role: "quit" }] },
    {
      label: "Chỉnh sửa",
      submenu: [
        { role: "undo" }, { role: "redo" }, { type: "separator" },
        { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" },
      ],
    },
    {
      label: "Xem",
      submenu: [
        { role: "reload" }, { role: "forceReload" }, { type: "separator" },
        { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" },
        { type: "separator" }, { role: "togglefullscreen" },
      ],
    },
    {
      label: "Trợ giúp",
      submenu: [
        { label: "Mở trang web", click: () => shell.openExternal(APP_URL) },
        { label: "Liên hệ hỗ trợ", click: () => shell.openExternal("mailto:hoangkhoinhiepanh@gmail.com") },
      ],
    },
  ]);
}
