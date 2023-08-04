#!/usr/bin/env node

const tl = require('azure-pipelines-task-lib/task');

async function run() {
  try {
    const organisationName = tl.getInput('organisationName', true);
    const projectName = tl.getInput('projectName', true);
    const targetEnvironment = tl.getInput('targetEnvironment', true);

    await tl.exec(
      'ranger',
      [
        'promote',
        'manifest',
        '--organisation-name',
        organisationName,
        '--project-name',
        projectName,
        '--target-environment',
        targetEnvironment,
      ],
    );

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
