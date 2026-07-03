const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("taskController", {
  isDesktop: true,
  platform: process.platform,
});
