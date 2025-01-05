export type JarDLVersionInfoResult = {
  version: string;
  buildCount: number | null;
};

export class JarDLBuildInfoResult {
  build: string;

  downloadUrl: string | null;

  javaMajorVersion: number | null;

  requireJdk: boolean | null;

  updatedDatetime: Date | null;

  recommended: false;

  isRequiredBuild: true;

  isLoadedInfo: true;

  constructor(data: JarDLBuildInfoAPIResult) {
    this.build = data.build;
    this.downloadUrl = data.downloadUrl;
    this.javaMajorVersion = data.javaMajorVersion;
    this.requireJdk = data.requireJdk;
    this.updatedDatetime = data.updatedDatetime ? new Date(data.updatedDatetime) : null;
    this.recommended = data.recommended;
    this.isRequiredBuild = data.isRequiredBuild;
    this.isLoadedInfo = data.isLoadedInfo;
  }
}
export type JarDLBuildInfoAPIResult = {
  build: string;
  downloadUrl: string | null;
  javaMajorVersion: number | null;
  requireJdk: boolean | null;
  updatedDatetime: string | null;
  recommended: false;
  isRequiredBuild: true;
  isLoadedInfo: true;
};
