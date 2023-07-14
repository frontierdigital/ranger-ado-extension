import axios from 'axios';
import fs = require('fs');
// import http = require('http');
// import got = require('got');
import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
// import { pipeline as streamPipeline } from 'stream/promises';

async function run() {
  try {
    const version: string | undefined = tl.getInput('version', true);

    const agentOS: string | undefined = tl.getVariable("Agent.OS")
    const agentOSArchitecture: string | undefined = tl.getVariable("Agent.OSArchitecture");
    const agentTempDirectory: string | undefined = tl.getVariable("Agent.TempDirectory");
    const agentToolsDirectory: string | undefined = tl.getVariable("Agent.ToolsDirectory");

    let platform;
    if (agentOSArchitecture == "X64" || agentOSArchitecture == "X86") {
      platform = "x86_64";
    } else {
      platform = agentOSArchitecture;
    }

    tl.debug(`Platform: ${platform}`);

    const downloadUrl = `https://github.com/frontierdigital/ranger/releases/download/${version}/ranger_${agentOS}_${platform}.tar.gz`;
    const downloadPath = path.join(agentTempDirectory as string, `ranger_${agentOS}_${platform}.tar.gz`);
    const toolDirPath = `${agentToolsDirectory}/ranger/${version}/${platform}`;

    tl.debug(`Download URL: ${downloadUrl}`);
    tl.debug(`Download path: ${downloadPath}`);
    tl.debug(`Tool directory path: ${toolDirPath}`);

    // const file = fs.createWriteStream(downloadPath);
    // const gotStream = got.stream.get(downloadUrl);
    // await streamPipeline(gotStream, outStream);

    // http.get()

    axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream'
    })
      .then(function (response: any) {
        response.data.pipe(fs.createWriteStream(downloadPath))
      });

    tl.mkdirP(toolDirPath);
    const exitCode = await tl.exec('tar', ['-xf', `"${downloadPath}"`, '-C', `"${toolDirPath}"`]);
    if (exitCode != 0) {
      throw new Error('Failed to extract Ranger CLI');
    }
    console.log(`##vso[task.prependpath]${toolDirPath}`);

    tl.setResult(tl.TaskResult.Succeeded, 'Success');
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
