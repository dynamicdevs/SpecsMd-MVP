# Requirements Document

## Introduction

LocalNote AI is a local Python console application for processing notes or long text with Ollama. The project provides a small, understandable lab for applying the Specs.md SIMPLE workflow: define requirements, create a design, plan tasks, and then implement the application.

The application helps a user summarize text, extract pending tasks, organize messy notes, write professional replies, and ask questions about local text without using external AI APIs, cloud services, remote databases, scraping, or third-party integrations beyond the official Ollama Python library.

## Users

- **Local_User**: A person running the application from a local terminal on Windows, Linux, or macOS.
- **Developer_User**: A person reading, testing, or modifying the code to learn the Specs.md SIMPLE workflow.

## Glossary

- **LocalNote_AI**: The complete local console application.
- **CLI_Command**: One of the supported argparse subcommands: `summarize`, `tasks`, `clean`, `professional`, or `ask`.
- **Input_Text**: Text provided through `--text` or loaded from a local UTF-8 file through `--file`.
- **Question_Text**: A required question passed with `--question` when the `ask` command is used.
- **Ollama_Client**: The module that encapsulates calls to the official `ollama` Python package.
- **Model_Name**: The Ollama model configured through `.env` or defaulted to `minimax-m3:cloud`.
- **Prompt_Builder**: A function that transforms user input into the prompt sent to Ollama.
- **Local_File**: A UTF-8 text file stored on the local filesystem.

## Functional Requirements

### Requirement 1

**User Story:** As a Local_User, I want to provide text directly from the terminal, so that I can process short or long notes without creating a file first.

#### Acceptance Criteria

1. WHEN a Local_User runs a CLI_Command with `--text`, THE LocalNote_AI SHALL use the provided value as Input_Text.
2. IF a Local_User runs a CLI_Command without `--text` and without `--file`, THEN THE LocalNote_AI SHALL display a clear argparse error.
3. IF a Local_User provides empty Input_Text, THEN THE LocalNote_AI SHALL display a clear error and avoid calling Ollama.

### Requirement 2

**User Story:** As a Local_User, I want to load text from a local file, so that I can process longer notes saved on disk.

#### Acceptance Criteria

1. WHEN a Local_User runs a CLI_Command with `--file`, THE LocalNote_AI SHALL read the Local_File as UTF-8 text.
2. IF the Local_File does not exist, THEN THE LocalNote_AI SHALL display a clear file error and avoid calling Ollama.
3. IF the Local_File cannot be decoded as UTF-8, THEN THE LocalNote_AI SHALL display a clear file error and avoid calling Ollama.

### Requirement 3

**User Story:** As a Local_User, I want to choose an AI action, so that I can get useful output for different note-processing needs.

#### Acceptance Criteria

1. WHEN a Local_User runs `summarize`, THE LocalNote_AI SHALL send a summarization prompt to Ollama.
2. WHEN a Local_User runs `tasks`, THE LocalNote_AI SHALL send a pending-task extraction prompt to Ollama.
3. WHEN a Local_User runs `clean`, THE LocalNote_AI SHALL send a note-organization prompt to Ollama.
4. WHEN a Local_User runs `professional`, THE LocalNote_AI SHALL send a professional-response prompt to Ollama.
5. WHEN a Local_User runs `ask` with `--question`, THE LocalNote_AI SHALL send a question-answering prompt that includes Input_Text and Question_Text.

### Requirement 4

**User Story:** As a Local_User, I want the `ask` command to require a question, so that free-form analysis always has a clear intent.

#### Acceptance Criteria

1. WHEN a Local_User runs `ask` with `--question`, THE LocalNote_AI SHALL include the Question_Text in the prompt.
2. IF a Local_User runs `ask` without `--question`, THEN THE LocalNote_AI SHALL display a clear argparse error.
3. IF a Local_User provides an empty `--question`, THEN THE LocalNote_AI SHALL display a clear error and avoid calling Ollama.

### Requirement 5

**User Story:** As a Developer_User, I want the Ollama model to be configurable, so that I can change models without editing the AI client logic.

#### Acceptance Criteria

1. WHEN `OLLAMA_MODEL` exists in the local environment, THE LocalNote_AI SHALL use that value as Model_Name.
2. WHEN `OLLAMA_MODEL` is not configured, THE LocalNote_AI SHALL use `minimax-m3:cloud` as Model_Name.
3. THE LocalNote_AI SHALL keep the default model value in a single configuration module.

### Requirement 6

**User Story:** As a Local_User, I want understandable failures, so that I can fix local setup problems without reading Python stack traces.

#### Acceptance Criteria

1. IF Ollama fails during a request, THEN THE LocalNote_AI SHALL display an understandable error message.
2. IF command-line validation fails, THEN THE LocalNote_AI SHALL display argparse help-style feedback.
3. WHILE LocalNote_AI handles expected user errors, THE LocalNote_AI SHALL avoid printing unnecessary stack traces.

## Non-Functional Requirements

### Requirement 7

**User Story:** As a Developer_User, I want the project to stay simple and local, so that it remains easy to understand, run, and modify.

#### Acceptance Criteria

1. THE LocalNote_AI SHALL run with Python 3.11 or higher.
2. THE LocalNote_AI SHALL use `argparse`, `ollama`, `python-dotenv`, and `pytest` only as declared dependencies or standard-library modules.
3. THE LocalNote_AI SHALL avoid web frameworks, Streamlit, FastAPI, Flask, Docker, databases, remote storage, scraping, and cloud services.
4. THE LocalNote_AI SHALL organize code into small modules for configuration, file loading, prompt building, and Ollama access.

## Constraints

- Everything must run locally from files and the terminal.
- The only allowed AI access is the official Ollama Python library.
- The default model must be exactly `minimax-m3:cloud`.
- The code must support easy model changes through configuration.
- The application must target Windows while remaining compatible with Linux and macOS.
- The implementation must not use OpenAI, Anthropic, Gemini, Gmail, Google Drive, external APIs, remote databases, scraping, web frameworks, Streamlit, FastAPI, Flask, Docker, or cloud services.
- The project must remain intentionally small and understandable.

## Acceptance Criteria Summary

- A user can run all five commands with `--text`.
- A user can run applicable commands with `--file`.
- The `ask` command requires `--question`.
- The app reads configuration from `.env` and defaults to `minimax-m3:cloud`.
- The Ollama call is encapsulated in `src/ai_client.py`.
- The prompt functions live in `src/prompts.py`.
- UTF-8 file reading lives in `src/file_loader.py`.
- Expected user errors are clear and do not expose unnecessary stack traces.
- Unit tests cover file loading and prompt generation.
