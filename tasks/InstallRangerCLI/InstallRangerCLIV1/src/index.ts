import fs = require('fs');
import got = require('got');
import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
import { pipeline as streamPipeline } from 'stream/promises';

async function run() {
  try {
    const version: string | undefined = tl.getInput('version', true);

    const agentOS: string | undefined = tl.getVariable("Agent.OS")
    const agentOSArchitecture: string | undefined = tl.getVariable("Agent.OSArchitecture");
    const agentTempDirectory: string | undefined = tl.getVariable("Agent.TempDirectory");

    let platform;
    if (agentOSArchitecture == "X64" || agentOSArchitecture == "X86") {
      platform = "x86_64";
    } else {
      platform = agentOSArchitecture;
    }

    const downloadUrl = `https://github.com/frontierdigital/ranger/releases/download/${version}/ranger_${agentOS}_${platform}.tar.gz`;

    const gotStream = got.stream.get(downloadUrl);

    const outStream = fs.createWriteStream(path.join(agentTempDirectory as string, `ranger_${agentOS}_${platform}.tar.gz`));

    await streamPipeline(gotStream, outStream);

    tl.setResult(tl.TaskResult.Succeeded, 'Success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
