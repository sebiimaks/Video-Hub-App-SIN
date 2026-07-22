import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, test } from 'node:test';

import { buildFfprobeArguments } from './local-operation-safety.ts';
import {
  extractFirstFrameArgs,
  extractSingleFrameArgs,
  generatePreviewClipArgs,
  generateScreenshotStripArgs,
} from './main-extract.ts';
import { ffmpegPath, ffprobePath } from './media-tool-paths.ts';

const temporaryDirectories: string[] = [];

interface ToolResult {
  stderr: string;
  stdout: string;
  status: number | null;
}

function runTool(command: string, args: string[], timeout = 30_000): ToolResult {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    timeout,
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }

  return {
    stderr: result.stderr || '',
    stdout: result.stdout || '',
    status: result.status,
  };
}

function readVersion(command: string): { line: string; major: number; minor: number } {
  const result = runTool(command, ['-version']);
  assert.equal(result.status, 0, result.stderr);
  const line = result.stdout.split('\n')[0];
  const match = line.match(/version\s+(\d+)\.(\d+)/);
  assert.ok(match, `Could not parse media-tool version: ${line}`);
  return {
    line,
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}

function createTemporaryDirectory(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'video-hub-app-sin-media-'));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory: string) => {
    fs.rmSync(directory, { force: true, recursive: true });
  });
});

test('bundles matching FFmpeg and FFprobe 8.1.2 executables', () => {
  const ffmpegVersion = readVersion(ffmpegPath);
  const ffprobeVersion = readVersion(ffprobePath);

  assert.match(ffmpegVersion.line, /^ffmpeg version 8\.1\.2(?:\s|$)/);
  assert.match(ffprobeVersion.line, /^ffprobe version 8\.1\.2(?:\s|$)/);
  assert.deepEqual(
    [ffprobeVersion.major, ffprobeVersion.minor],
    [ffmpegVersion.major, ffmpegVersion.minor],
    'FFmpeg and FFprobe must come from the same release series.',
  );
  const configuration = runTool(ffmpegPath, ['-version']).stdout;
  assert.match(configuration, /--enable-gpl/);
  assert.match(configuration, /--enable-libx264/);
});

test('generates, probes, and extracts a thumbnail from media with a difficult filename', () => {
  const directory = createTemporaryDirectory();
  const mediaPath = path.join(directory, 'sample with spaces; $value.mp4');
  const thumbnailPath = path.join(directory, 'thumbnail with spaces; $value.jpg');

  const generation = runTool(ffmpegPath, [
    '-hide_banner',
    '-loglevel', 'error',
    '-f', 'lavfi',
    '-i', 'testsrc=size=160x90:rate=5:duration=6',
    '-f', 'lavfi',
    '-i', 'sine=frequency=1000:duration=6',
    '-shortest',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-y',
    mediaPath,
  ]);
  assert.equal(generation.status, 0, generation.stderr);
  assert.ok(fs.statSync(mediaPath).size > 0);

  const probe = runTool(ffprobePath, buildFfprobeArguments(mediaPath));
  assert.equal(probe.status, 0, probe.stderr);
  const metadata = JSON.parse(probe.stdout);
  assert.equal(metadata.streams[0].width, 160);
  assert.equal(metadata.streams[0].height, 90);
  const fullProbe = runTool(ffprobePath, [
    '-v', 'error',
    '-of', 'json',
    '-show_streams',
    mediaPath,
  ]);
  const fullMetadata = JSON.parse(fullProbe.stdout);
  assert.ok(fullMetadata.streams.some((stream: { codec_type?: string }) => stream.codec_type === 'audio'));

  const extraction = runTool(ffmpegPath, [
    '-hide_banner',
    '-loglevel', 'error',
    '-ss', '0',
    '-i', mediaPath,
    '-frames:v', '1',
    '-q:v', '2',
    '-y',
    thumbnailPath,
  ]);
  assert.equal(extraction.status, 0, extraction.stderr);
  assert.ok(fs.statSync(thumbnailPath).size > 0);
});

test('runs the app thumbnail, filmstrip, preview clip, and clip-thumbnail argument sets', () => {
  const directory = createTemporaryDirectory();
  const mediaPath = path.join(directory, 'workflow input with spaces; value.mp4');
  const thumbnailPath = path.join(directory, 'workflow thumbnail.jpg');
  const filmstripPath = path.join(directory, 'workflow filmstrip.jpg');
  const clipPath = path.join(directory, 'workflow clip.mp4');
  const clipThumbnailPath = path.join(directory, 'workflow clip thumbnail.jpg');

  const generation = runTool(ffmpegPath, [
    '-nostdin',
    '-hide_banner',
    '-loglevel', 'error',
    '-f', 'lavfi',
    '-i', 'testsrc=size=320x180:rate=10:duration=8',
    '-f', 'lavfi',
    '-i', 'sine=frequency=1000:duration=8',
    '-shortest',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-y',
    mediaPath,
  ], 60_000);
  assert.equal(generation.status, 0, generation.stderr);

  const workflows: { args: string[]; output: string }[] = [
    { args: extractSingleFrameArgs(mediaPath, 90, 8, thumbnailPath), output: thumbnailPath },
    { args: generateScreenshotStripArgs(mediaPath, 8, 90, 3, filmstripPath), output: filmstripPath },
    { args: generatePreviewClipArgs(mediaPath, 8, 90, 2, 1, clipPath), output: clipPath },
  ];

  for (const workflow of workflows) {
    const result = runTool(ffmpegPath, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', ...workflow.args], 60_000);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.statSync(workflow.output).size > 0);
  }

  const clipThumbnail = runTool(ffmpegPath, [
    '-nostdin',
    '-hide_banner',
    '-loglevel', 'error',
    '-y',
    ...extractFirstFrameArgs(clipPath, clipThumbnailPath),
  ], 60_000);
  assert.equal(clipThumbnail.status, 0, clipThumbnail.stderr);
  assert.ok(fs.statSync(clipThumbnailPath).size > 0);

  const clipProbe = runTool(ffprobePath, ['-v', 'error', '-of', 'json', '-show_streams', clipPath]);
  const clipMetadata = JSON.parse(clipProbe.stdout);
  assert.ok(clipMetadata.streams.some((stream: { codec_type?: string }) => stream.codec_type === 'video'));
  assert.ok(clipMetadata.streams.some((stream: { codec_type?: string }) => stream.codec_type === 'audio'));
});
