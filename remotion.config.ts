import { Config } from '@remotion/cli/config';

// Set the codec for video rendering (e.g., 'h264', 'h265', 'vp8', 'vp9', 'prores', etc.)
Config.setCodec('h264');

// Set the pixel format (e.g., 'yuv420p', 'yuv422p', etc.)
Config.setPixelFormat('yuv420p');

// Specify whether to render an image sequence (true) or a video file (false)
Config.setImageSequence(false);
