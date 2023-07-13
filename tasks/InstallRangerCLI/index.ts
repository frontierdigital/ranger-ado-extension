import tl = require('azure-pipelines-task-lib/task');

async function run() {
  tl.setResult(tl.TaskResult.Succeeded, 'Success');
}

run();
