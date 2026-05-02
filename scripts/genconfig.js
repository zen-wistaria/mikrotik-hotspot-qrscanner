import path from 'node:path';
import { createInterface } from 'node:readline';
import fs from 'fs-extra';

const DEFAULT_CONFIG = {
  qrcode: {
    meta: {
      title: 'Wi.Fi | QR Code Scanner',
      description: 'Scan QR codes to log in to hotspot',
    },
    title: 'QR Code Scanner',
    description:
      'Point the QR code to the camera area • Auto redirect for links',
    button: {
      switchCam: 'Switch Camera',
      startCam: 'Start Camera',
      stopCam: 'Stop Camera',
    },
    text: {
      scanFromFile: 'Drag/Upload QR Code voucher from file/image',
    },
    notifications: {
      qrInvalid: 'QR code is empty or invalid',
      qrSuccess: 'Valid QR Code! Authenticating...',
      qrNotFound: 'QR code not found',
      camStart: 'Camera is active...',
      camAlreadyActive: 'Camera is already active',
      camInitFailed: 'Click Start to activate the camera',
      camStop: 'Camera stopped',
      camFailed: 'Failed to access camera',
      camInvalid: 'Camera is not active, please start it first',
      camNotAvailable: 'No other camera available',
      camSwitching: 'Switching camera',
      camSwitchingFailed: 'Failed to switch camera',
    },
    footer: '✦ Powered by Zen — v2.0.0 ✦',
  },
};

const SRC_DIR = path.join(process.cwd());
const CONFIG_PATH = path.join(SRC_DIR, 'config.json');

async function generateConfig() {
  // Check if config.json already exists
  if (await fs.pathExists(CONFIG_PATH)) {
    console.log('⚠️  config.json already exists.');
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await new Promise((resolve) => {
      readline.question('Overwrite? (y/N): ', resolve);
    });
    readline.close();
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Generation cancelled.');
      process.exit(0);
    }
  }

  await fs.writeJson(CONFIG_PATH, DEFAULT_CONFIG, { spaces: 2 });
  console.log('✅ Generated config.json with default settings.');
  console.log('📝 Edit config.json to customize your hotspot.');
}

generateConfig().catch((err) => {
  console.error('❌ Failed to generate config:', err);
  process.exit(1);
});
