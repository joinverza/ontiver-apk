const fs = require('fs');
const path = require('path');
const { withDangerousMod, withXcodeProject, IOSConfig } = require('@expo/config-plugins');

function sourceConfigPath() {
  const configured = process.env.SMILE_CONFIG_FILE;
  if (!configured) {
    if (process.env.EAS_BUILD_PROFILE) {
      throw new Error('SMILE_CONFIG_FILE must be configured as an EAS file secret.');
    }
    return null;
  }
  const resolved = path.resolve(configured);
  if (!fs.existsSync(resolved)) {
    throw new Error(`SmileID config file does not exist: ${resolved}`);
  }
  return resolved;
}

function withAndroidSmileConfig(config) {
  return withDangerousMod(config, ['android', async (mod) => {
    const source = sourceConfigPath();
    if (!source) return mod;
    const assets = path.join(mod.modRequest.platformProjectRoot, 'app', 'src', 'main', 'assets');
    fs.mkdirSync(assets, { recursive: true });
    fs.copyFileSync(source, path.join(assets, 'smile_config.json'));
    return mod;
  }]);
}

function withIosSmileConfig(config) {
  config = withDangerousMod(config, ['ios', async (mod) => {
    const source = sourceConfigPath();
    if (!source) return mod;
    const projectName = IOSConfig.XcodeUtils.getProjectName(mod.modRequest.projectRoot);
    const destination = path.join(mod.modRequest.platformProjectRoot, projectName, 'smile_config.json');
    fs.copyFileSync(source, destination);
    return mod;
  }]);
  return withXcodeProject(config, (mod) => {
    if (!sourceConfigPath()) return mod;
    const projectName = IOSConfig.XcodeUtils.getProjectName(mod.modRequest.projectRoot);
    const relativePath = `${projectName}/smile_config.json`;
    if (!mod.modResults.hasFile(relativePath)) {
      mod.modResults.addResourceFile(relativePath, { target: mod.modResults.getFirstTarget().uuid }, true);
    }
    return mod;
  });
}

module.exports = function withSmileConfig(config) {
  return withIosSmileConfig(withAndroidSmileConfig(config));
};
