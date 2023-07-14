#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tl = require('azure-pipelines-task-lib/task');

async function run() {
  try {
    const version = tl.getInput('version', true);

    const agentOS = tl.getVariable('Agent.OS');
    const agentOSArchitecture = tl.getVariable('Agent.OSArchitecture');
    const agentTempDirectory = tl.getVariable('Agent.TempDirectory');
    const agentToolsDirectory = tl.getVariable('Agent.ToolsDirectory');

    let platform;
    if (agentOSArchitecture === 'X64' || agentOSArchitecture === 'X86') {
      platform = 'x86_64';
    } else {
      platform = agentOSArchitecture;
    }

    tl.debug(`Platform: ${platform}`);

    const downloadUrl = `https://github.com/frontierdigital/ranger/releases/download/${version}/ranger_${agentOS}_${platform}.tar.gz`;
    const downloadPath = path.join(agentTempDirectory, `ranger_${agentOS}_${platform}.tar.gz`);
    const toolDirPath = `${agentToolsDirectory}/ranger/${version}/${platform}`;

    tl.debug(`Download URL: ${downloadUrl}`);
    tl.debug(`Download path: ${downloadPath}`);
    tl.debug(`Tool directory path: ${toolDirPath}`);

    // const file = fs.createWriteStream(downloadPath);
    // const gotStream = got.stream.get(downloadUrl);
    // await streamPipeline(gotStream, outStream);

    // http.get()

    // axios.default.get

    await axios.default.get(downloadUrl)
      .then((response) => {
        response.data.pipe(fs.createWriteStream(downloadPath));
      });
    // const saxios = new axios.Axios()
    // (new Axios()).get(downloadUrl)
    //   .then(function (response: any) {
    //     response.data.pipe(fs.createWriteStream(downloadPath))
    //   });
    // axios({
    //   method: 'get',
    //   url: downloadUrl,
    //   responseType: 'stream'
    // })
    //   .then(function (response: any) {
    //     response.data.pipe(fs.createWriteStream(downloadPath))
    //   });

    tl.mkdirP(toolDirPath);
    const exitCode = await tl.exec('tar', ['-xf', `"${downloadPath}"`, '-C', `"${toolDirPath}"`]);
    if (exitCode !== 0) {
      throw new Error('Failed to extract Ranger CLI');
    }
    // eslint-disable-next-line no-console
    console.log(`##vso[task.prependpath]${toolDirPath}`);

    tl.setResult(tl.TaskResult.Succeeded, 'Success');
  } catch (err) {
    if (err instanceof Error) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    } else {
      tl.setResult(tl.TaskResult.Failed, 'Unknown error');
    }
  }
}

run();
