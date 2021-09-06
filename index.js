const core = require('@actions/core');
const yaml = require('yaml');
const fs = require('fs');

try {
    // Get required defaults
    const matrixFile = core.getInput('matrix-file');
    const workflow = core.getInput('workflow');

    // Read and parse matrix-file
    const matrixFileContent = fs.readFileSync(matrixFile ? matrixFile : '.github/workflow-matrix.yml', 'utf8');
    const mergeResult = yaml.parse(matrixFileContent, { merge: true });

    // Get matrix for current workflow with fallback to default matrix
    var matrix = {};
    if (workflow in mergeResult) {
        console.log(`Use ${workflow} matrix`);
        matrix = JSON.stringify(mergeResult[workflow].matrix);
    } else {
        console.log(`Use default matrix`);
        matrix = JSON.stringify(mergeResult.matrix);
    };

    // Set matrix output
    core.setOutput("matrix", matrix ? matrix : {});

} catch (error) {
    core.setFailed(error.message);
}
