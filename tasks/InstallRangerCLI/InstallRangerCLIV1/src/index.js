#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const tl = require('azure-pipelines-task-lib/task');
const { promisify } = require('util');

const finished = promisify(stream.finished);

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

    const writer = fs.createWriteStream(downloadPath);

    const client = axios.create();
    client.interceptors.request.use((request) => {
      tl.debug(`Axios request: ${request.method} ${request.url} `);
      return request;
    });
    client.interceptors.response.use((response) => {
      tl.debug(`Axios response: ${response.status} ${response.statusText}`);
      return response;
    });

    await client({
      url: downloadUrl,
      method: 'get',
      responseType: 'stream',
    }).then((response) => {
      response.data.pipe(writer);
      return finished(writer);
    });

    tl.debug(await tl.exec('ls', ['-al', agentTempDirectory]));

    tl.mkdirP(toolDirPath);
    await tl.exec('tar', ['-xf', downloadPath, '-C', toolDirPath]);

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
