#!/usr/bin/env node

const tl = require('azure-pipelines-task-lib/task');

async function run() {
  try {
    const targetEnvironment = tl.getInput('targetEnvironment', true);

    // eslint-disable-next-line no-console
    console.log(`Promote to ${targetEnvironment}`);

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
