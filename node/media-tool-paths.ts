import * as path from 'path';

export const MEDIA_TOOL_DIRECTORY_ENV = 'VIDEO_HUB_APP_SIN_MEDIA_TOOLS';

type MediaToolName = 'ffmpeg' | 'ffprobe';
type ElectronProcess = NodeJS.Process & {
  defaultApp?: boolean;
  resourcesPath?: string;
};

const electronProcess = process as ElectronProcess;

function executableName(tool: MediaToolName): string {
  return process.platform === 'win32' ? `${tool}.exe` : tool;
}

function runningFromPackagedElectron(): boolean {
  return typeof electronProcess.resourcesPath === 'string' && !electronProcess.defaultApp;
}

/**
 * Resolve only fork-built media tools. A development/test override keeps tests
 * independent from Electron's installation directory; packaged applications
 * always use their own Resources/media-tools directory.
 */
export function getMediaToolPath(tool: MediaToolName): string {
  if (runningFromPackagedElectron()) {
    return path.join(electronProcess.resourcesPath as string, 'media-tools', executableName(tool));
  }

  const overrideDirectory = process.env[MEDIA_TOOL_DIRECTORY_ENV];
  if (overrideDirectory) {
    return path.join(path.resolve(overrideDirectory), executableName(tool));
  }

  return path.resolve(__dirname, '..', 'build', 'media-tools', executableName(tool));
}

export const ffmpegPath = getMediaToolPath('ffmpeg');
export const ffprobePath = getMediaToolPath('ffprobe');
