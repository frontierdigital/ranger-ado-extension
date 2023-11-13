#!/usr/bin/env node

const tl = require('azure-pipelines-task-lib/task');

async function run() {
  try {
    const gitUserEmail = tl.getInput('gitUserEmail', true);
    const gitUserName = tl.getInput('gitUserName', true);
    const organisationName = tl.getInput('organisationName', true);
    const pat = tl.getInput('pat', true);
    const projectName = tl.getInput('projectName', true);

    await tl.exec(
      'ranger',
      [
        'deploy',
        'set',
        '--organisation-name',
        organisationName,
        '--project-name',
        projectName,
      ],
      {
        env: {
          ...process.env,
          RANGER_ADO_PAT: pat,
          RANGER_GIT_USEREMAIL: gitUserName,
          RANGER_GIT_USERNAME: gitUserEmail,
        },
        silent: false,
      },
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
