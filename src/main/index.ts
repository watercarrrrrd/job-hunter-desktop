import { app, BrowserWindow } from 'electron';
import { initDatabase } from './db';
import { registerIpcHandlers } from './ipc';
import { createMainWindow } from './window';

function bootstrap(): void {
  initDatabase();
  registerIpcHandlers();
  createMainWindow();
}

app.whenReady().then(() => {
  bootstrap();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
