# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Create `app.py`, `src/`, `tests/`, `examples/`, `.env.example`, `requirements.txt`, and README files
  - Declare only `ollama`, `python-dotenv`, and `pytest`
  - _Requirements: 5.3, 7.1, 7.2, 7.3, 7.4_

- [x] 2. Implement configuration and local file loading
- [x] 2.1 Create `src/config.py`
  - Load `.env` with `python-dotenv`
  - Return `OLLAMA_MODEL` or default to `minimax-m3:cloud`
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2.2 Create `src/file_loader.py`
  - Read local text files with UTF-8
  - Let file and decoding errors remain catchable by the CLI layer
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2.3 Checkpoint - Verify configuration and file loading shape
  - Review module boundaries
  - Ensure no external services or databases are introduced
  - _Requirements: 7.2, 7.3, 7.4_

- [x] 3. Implement prompt builders
- [x] 3.1 Create prompt functions for all AI actions
  - Implement `summarize_prompt`, `tasks_prompt`, `clean_prompt`, `professional_prompt`, and `ask_prompt`
  - Ensure each prompt includes the user's Input_Text
  - Ensure `ask_prompt` includes Question_Text
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [x] 3.2 Checkpoint - Verify prompt coverage
  - Confirm every supported command has a prompt builder
  - Confirm prompt generation is deterministic and testable without Ollama
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Implement Ollama client
  - Create `src/ai_client.py`
  - Encapsulate `from ollama import chat`
  - Return `response.message.content`
  - Raise a clear local exception when no content is returned
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1_

- [x] 5. Implement CLI orchestration
- [x] 5.1 Create argparse commands
  - Add `summarize`, `tasks`, `clean`, `professional`, and `ask`
  - Add shared `--text` and `--file` arguments
  - Add `--question` for `ask`
  - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [x] 5.2 Implement CLI validation and input resolution
  - Require either `--text` or `--file`
  - Reject blank Input_Text
  - Require non-blank `--question` for `ask`
  - _Requirements: 1.2, 1.3, 4.2, 4.3_

- [x] 5.3 Implement user-facing error handling
  - Handle file errors with clear messages
  - Handle Ollama errors with clear messages
  - Avoid unnecessary stack traces for expected failures
  - _Requirements: 2.2, 2.3, 6.1, 6.2, 6.3_

- [x] 5.4 Checkpoint - Verify CLI wiring
  - Confirm every command routes to the intended prompt builder
  - Confirm the configured model is passed to the Ollama client
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2_

- [x] 6. Add deterministic tests
- [x] 6.1 Create `tests/test_file_loader.py`
  - Test reading a UTF-8 file
  - Test missing file behavior
  - Test invalid UTF-8 behavior
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6.2 Create `tests/test_prompts.py`
  - Test all prompt functions include required text
  - Test `ask_prompt` includes the question
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Run the complete pytest suite
  - Fix any failures before considering implementation complete
  - Review implementation against requirements and design
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4_
