# Aham E2E Test Automation

Playwright end-to-end tests for the Aham quality engineering platform. The suite validates sign-in, project selection, dashboard reporting, and workflows across Aham modules such as Requirements, Testability, Test Plan, Test Scenarios, Test Cases, Coverage, Security Scan, Bug Detection, Threat Model, and Test Manager.

## Prerequisites

- Node.js and npm
- Access to the Aham test environment
- Valid Aham test account credentials
- Playwright's Chromium browser (installed using the setup steps below)

## Install

From the repository root, install the Node dependencies and the Chromium browser:

```powershell
npm install
npx playwright install chromium
```

## Environment configuration

Create a local `.env` file in the repository root. Do not commit this file or put credentials in test code.

```dotenv
BASE_URL=http://3.129.154.1:8000
EMAIL=your-test-account-email
PASSWORD=your-test-account-password
```

`EMAIL` and `PASSWORD` are required by the shared login helper. `BASE_URL` is used by the helper for login and module routes. The Playwright configuration also defines its own `baseURL`; keep that value aligned with `BASE_URL` if you change the test environment.

## Project selection and test setup

Authenticated module tests use `utils/ahamTestHelpers.ts`. Its `loginToProject()` helper signs in, selects **AhamTest** from the project selector in the upper-left/left pane, and verifies that the project is selected before module assertions continue. Use this helper for new authenticated tests rather than hardcoding a project dashboard ID or writing a separate login flow.

`openTestManager()` builds on the same setup and opens the Test Manager module. Login-form-only tests and unauthenticated negative tests intentionally do not select a project.

## Test organization

Tests are under `tests/aham/` and `tests/moduleTests/`:

- `tests/aham/testLogin.spec.ts` — login form, successful login, and invalid email format.
- `tests/aham/testDashboard.spec.ts` — dashboard content, reporting-period controls, attention items, and Test Manager KPI navigation.
- `tests/aham/testRequirements.spec.ts` — requirement health and Test Manager requirement coverage.
- `tests/aham/testTestability.spec.ts`, `testPlan.spec.ts`, `testScenarios.spec.ts`, `testTCases.spec.ts`, `testCoverage.spec.ts`, `testSecurityScan.spec.ts`, `testBugDetection.spec.ts`, and `testThreatModel.spec.ts` — module visibility checks.
- `tests/aham/testManager.spec.ts` and `testManagerFlows.spec.ts` — Test Manager data, grouping, traceability, assets, and runs.
- `tests/aham/testModuleJourneyFlows.spec.ts` — dashboard KPI journeys into Testability, Bug Detection, and Security Scan.
- `tests/moduleTests/testAhamFullCoverage.spec.ts` and `testAhamModuleScenarios.e2e.spec.ts` — broader cross-module coverage and end-to-end scenarios.
- `tests/moduleTests/testAhamNegative.spec.ts` — invalid credentials and protected-route behavior.

Playwright discovers tests from the configured `testDir` (`tests`), including nested folders.

## Run tests

Run the complete suite:

```powershell
npx playwright test
```

Run all Aham module tests:

```powershell
npx playwright test tests/aham
```

Run a specific spec:

```powershell
npx playwright test tests/aham/testDashboard.spec.ts
```

Run a single test by title:

```powershell
npx playwright test tests/aham/testDashboard.spec.ts -g "period selector"
```

List discovered tests without running them:

```powershell
npx playwright test --list
```

Run tests headed or with a chosen worker count:

```powershell
npx playwright test tests/aham --headed --workers=1
```

The current Playwright configuration uses Chromium, headed mode, and records screenshots, video, and traces. Tests interact with the configured live environment, so use an authorized test account and avoid running tests that modify shared data unless the environment is safe for it.

## Reports and artifacts

- HTML report output: `playwright-report/`
- Test results, screenshots, videos, and traces: `test-results/`
- Open the latest HTML report:

```powershell
npx playwright show-report
```

These generated artifacts and `.env` are excluded from Git by `.gitignore`.

## Troubleshooting

- **Missing credential error:** confirm `.env` exists at the repository root and defines `EMAIL` and `PASSWORD`.
- **Project selection timeout:** verify the account can access a project named `AhamTest` and that the configured environment is reachable.
- **Login or route mismatch:** confirm `.env` `BASE_URL` matches the target configured in `playwright.config.ts`.
- **Browser executable missing:** run `npx playwright install chromium`.
- **Inspect a failed test:** check the failure details and artifacts in `test-results/`; the trace can be opened with `npx playwright show-trace <trace-file>`.

## Key files

- `playwright.config.ts` — test discovery, browser, timeouts, reporter, and artifact settings.
- `utils/ahamTestHelpers.ts` — common sign-in, AhamTest project selection, and Test Manager setup.
- `testData/` — test account or other test data modules; keep secrets in `.env`, not in source files.

