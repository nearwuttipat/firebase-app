// VersionInfo.ts
import * as Application from "expo-application";

export const appVersion =
  Application.nativeApplicationVersion ?? "unknown";   // e.g. "1.3.0"

export const buildNumber =
  Application.nativeBuildVersion ?? "0";               // iOS CFBundleVersion / Android versionCode

export const versionLabel = `v${appVersion} (${buildNumber})`;
