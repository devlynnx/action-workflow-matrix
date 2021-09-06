# action-workflow-matrix

[![License](https://img.shields.io/github/license/bonddim/action-workflow-matrix)](https://github.com/bonddim/action-workflow-matrix/blob/main/LICENSE)
[![](https://img.shields.io/github/workflow/status/bonddim/action-workflow-matrix/default/main?logo=github)](https://github.com/bonddim/action-workflow-matrix/actions/workflows/test_default.yml?query=branch%3Amain)

GitHub action to generate build matrix from yaml file

## Requirements

- checkout repository to read the yaml file

```yaml
- uses: actions/checkout@v2
```

## Usage

```yaml
- uses: bonddim/action-workflow-matrix@stable
  with:
    matrix-file: "${{ github.workspace }}/.github/workflow-matrix.yml"
    # [optional]
    # The YAML file with matrix. Default is .github/workflow-matrix.yml
    # Action will fail if file not found
    workflow: "${{ github.workflow }}"
    # [optional]
    # Key in the matrix file to get the matrix. Default is '${{ github.workflow }}'
    # Action will generate matrix from default key (matrix) if workflow key is not defined in matrix file
    # Action will generate empty matrix if workflow and matrix keys are not defined in matrix file
```

Example of [.github/workflow-matrix.yml](https://github.com/bonddim/action-workflow-matrix/blob/main/.github/workflow-matrix.yml):

```yaml
---
matrix: &default
  node: [12, 14]
  os: [ubuntu-latest, windows-latest, macos-latest]
  include: &default_icnlude
    - node: 16
      os: ubuntu-latest

# Overwrite parameter
ubuntu:
  matrix:
    <<: *default
    os: [ubuntu-latest]

# Overwrite include
include:
  matrix:
    <<: *default
    include:
      - os: ubuntu-18.04
        node: 10

# Note: All include combinations are processed after exclude. This allows you to use include to add back combinations that were previously excluded.
# https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
# Exclude from default matrix
exclude:
  matrix:
    <<: *default
    exclude:
      - os: macos-latest
        node: 12
      - os: windows-latest
        node: 14

# Additional parameters
parameter:
  matrix:
    <<: *default
    experimental: [true]
    foo: [bar]
```

```yaml
# This workflow will generate default matrix
name: default

jobs:
  matrix:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - uses: actions/checkout@v2
      - name: Set build matrix
        id: set-matrix
        uses: bonddim/action-workflow-matrix@stable

  build:
    runs-on: ${{ matrix.os }}
    needs: matrix
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.matrix.outputs.matrix) }}
    steps:
      - name: Dump matrix context
        run: echo "$MATRIX_CONTEXT"
        env:
          MATRIX_CONTEXT: ${{ toJSON(matrix) }}
```

Check other build examples:

- [exclude](https://github.com/bonddim/action-workflow-matrix/actions/workflows/test_exclude.yml?query=branch%3Amain)
- [include](https://github.com/bonddim/action-workflow-matrix/actions/workflows/test_include.yml?query=branch%3Amain)
- [parameter](https://github.com/bonddim/action-workflow-matrix/actions/workflows/test_parameter.yml?query=branch%3Amain)
- [ubuntu](https://github.com/bonddim/action-workflow-matrix/actions/workflows/test_ubuntu.yml?query=branch%3Amain)

## License

MIT
