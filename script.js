const STORAGE_KEY = "leetcodeProblems";
const SESSION_STORAGE_KEY = "leetcodeCompletedProblemKeys";

let problems = [];
let completedProblemKeys = new Set();
let previousProblemKey = null;
let currentProblemKey = null;

const elements = {
  form: document.querySelector("#problemForm"),
  problemName: document.querySelector("#problemName"),
  problemLink: document.querySelector("#problemLink"),
  formMessage: document.querySelector("#formMessage"),
  tableBody: document.querySelector("#problemTableBody"),
  problemCount: document.querySelector("#problemCount"),
  bankMessage: document.querySelector("#bankMessage"),
  generateButton: document.querySelector("#generateButton"),
  randomEmptyMessage: document.querySelector("#randomEmptyMessage"),
  randomResult: document.querySelector("#randomResult"),
  randomProblemName: document.querySelector("#randomProblemName"),
  randomProblemLink: document.querySelector("#randomProblemLink"),
  completeProblemButton: document.querySelector("#completeProblemButton"),
  restartSessionButton: document.querySelector("#restartSessionButton"),
  importButton: document.querySelector("#importButton"),
  exportButton: document.querySelector("#exportButton"),
  clearButton: document.querySelector("#clearButton"),
  csvFileInput: document.querySelector("#csvFileInput"),
};

function problemKey(problem) {
  return `${problem.problem.trim().toLowerCase()}::${problem.link.trim().toLowerCase()}`;
}

function isValidWebLink(link) {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function loadProblems() {
  const savedProblems = localStorage.getItem(STORAGE_KEY);

  if (!savedProblems) {
    problems = [];
    return;
  }

  try {
    const parsedProblems = JSON.parse(savedProblems);
    problems = Array.isArray(parsedProblems)
      ? parsedProblems.filter(
          (item) =>
            item &&
            typeof item.problem === "string" &&
            typeof item.link === "string" &&
            item.problem.trim() &&
            isValidWebLink(item.link.trim()),
        )
      : [];
  } catch {
    problems = [];
    elements.bankMessage.textContent = "Saved data could not be read, so a new bank was started.";
  }
}

function saveProblems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

function loadCompletedProblems() {
  const savedKeys = sessionStorage.getItem(SESSION_STORAGE_KEY);
  const currentKeys = new Set(problems.map(problemKey));

  if (!savedKeys) {
    completedProblemKeys = new Set();
    return;
  }

  try {
    const parsedKeys = JSON.parse(savedKeys);
    completedProblemKeys = new Set(
      Array.isArray(parsedKeys)
        ? parsedKeys.filter((key) => typeof key === "string" && currentKeys.has(key))
        : [],
    );
  } catch {
    completedProblemKeys = new Set();
  }
}

function saveCompletedProblems() {
  if (completedProblemKeys.size === 0) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([...completedProblemKeys]));
}

function isProblemCompleted(problem) {
  return completedProblemKeys.has(problemKey(problem));
}

function createProblemRow(problem, index) {
  const row = document.createElement("tr");
  const completed = isProblemCompleted(problem);
  row.classList.toggle("is-completed", completed);

  const nameCell = document.createElement("td");
  nameCell.className = "problem-name";
  nameCell.textContent = problem.problem;

  const linkCell = document.createElement("td");
  const link = document.createElement("a");
  link.className = "table-link";
  link.href = problem.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open";
  link.setAttribute("aria-label", `Open ${problem.problem} in a new tab`);
  linkCell.append(link);

  const sessionCell = document.createElement("td");
  const completionButton = document.createElement("button");
  completionButton.className = "completion-button completion-button--table";
  completionButton.type = "button";
  completionButton.dataset.index = index;
  completionButton.setAttribute("aria-pressed", String(completed));
  completionButton.setAttribute(
    "aria-label",
    completed
      ? `Mark ${problem.problem} available in this session`
      : `Mark ${problem.problem} completed for this session`,
  );
  completionButton.textContent = completed ? "Completed" : "Complete";
  sessionCell.append(completionButton);

  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.index = index;
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${problem.problem}`);
  actionCell.append(deleteButton);

  row.append(nameCell, linkCell, sessionCell, actionCell);
  return row;
}

function updateCurrentProblemControls() {
  if (!currentProblemKey) return;

  const completed = completedProblemKeys.has(currentProblemKey);
  elements.completeProblemButton.textContent = completed ? "Completed" : "Complete";
  elements.completeProblemButton.disabled = completed;
  elements.completeProblemButton.setAttribute("aria-pressed", String(completed));
}

function renderProblems() {
  elements.tableBody.replaceChildren();

  if (problems.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No problems saved yet.";
    row.append(cell);
    elements.tableBody.append(row);
  } else {
    problems.forEach((problem, index) => {
      elements.tableBody.append(createProblemRow(problem, index));
    });
  }

  const completedCount = problems.filter(isProblemCompleted).length;
  const availableCount = problems.length - completedCount;
  elements.problemCount.textContent = `${availableCount} available · ${completedCount} completed`;
  elements.restartSessionButton.disabled = completedCount === 0;
  updateCurrentProblemControls();
}

function addProblem(problemName, problemLink) {
  const newProblem = {
    problem: problemName.trim(),
    link: problemLink.trim(),
  };

  if (!newProblem.problem || !newProblem.link) {
    throw new Error("Enter both a problem name and a LeetCode link.");
  }

  if (!isValidWebLink(newProblem.link)) {
    throw new Error("Enter a valid link beginning with http:// or https://.");
  }

  if (problems.some((problem) => problemKey(problem) === problemKey(newProblem))) {
    throw new Error("That problem is already in your bank.");
  }

  problems.push(newProblem);
  saveProblems();
  renderProblems();
  return newProblem;
}

function handleAddProblem(event) {
  event.preventDefault();
  elements.formMessage.textContent = "";

  try {
    addProblem(elements.problemName.value, elements.problemLink.value);
    elements.form.reset();
    elements.problemName.focus();
    elements.bankMessage.textContent = "Problem added to your bank.";
  } catch (error) {
    elements.formMessage.textContent = error.message;
  }
}

function deleteProblem(index) {
  if (!Number.isInteger(index) || index < 0 || index >= problems.length) {
    throw new Error("That problem could not be found.");
  }

  const [deletedProblem] = problems.splice(index, 1);
  const deletedKey = problemKey(deletedProblem);
  completedProblemKeys.delete(deletedKey);
  saveCompletedProblems();

  if (currentProblemKey === deletedKey) {
    currentProblemKey = null;
    elements.randomResult.hidden = true;
    elements.randomEmptyMessage.hidden = false;
    elements.randomEmptyMessage.textContent = "Generate another problem to continue your session.";
  }

  saveProblems();
  renderProblems();
  elements.bankMessage.textContent = `${deletedProblem.problem} was deleted.`;
  return deletedProblem;
}

function showRandomProblem(problem) {
  currentProblemKey = problemKey(problem);
  elements.randomProblemName.textContent = problem.problem;
  elements.randomProblemLink.href = problem.link;
  elements.randomProblemLink.setAttribute("aria-label", `Open ${problem.problem} in a new tab`);
  elements.randomEmptyMessage.hidden = true;
  elements.randomResult.hidden = false;
  updateCurrentProblemControls();
}

function generateRandomProblem() {
  if (problems.length === 0) {
    elements.randomResult.hidden = true;
    elements.randomEmptyMessage.hidden = false;
    elements.randomEmptyMessage.textContent =
      "Add some LeetCode problems before generating a question.";
    return null;
  }

  const availableProblems = problems.filter((problem) => !isProblemCompleted(problem));

  if (availableProblems.length === 0) {
    currentProblemKey = null;
    elements.randomResult.hidden = true;
    elements.randomEmptyMessage.hidden = false;
    elements.randomEmptyMessage.textContent =
      "Every problem is completed for this session. Restart the session to roll them again.";
    return null;
  }

  let selectedProblem;

  // Re-roll only when an alternative exists and the last result is selected again.
  do {
    const randomIndex = Math.floor(Math.random() * availableProblems.length);
    selectedProblem = availableProblems[randomIndex];
  } while (availableProblems.length > 1 && problemKey(selectedProblem) === previousProblemKey);

  previousProblemKey = problemKey(selectedProblem);
  showRandomProblem(selectedProblem);
  return selectedProblem;
}

function setProblemCompleted(index, completed) {
  if (!Number.isInteger(index) || index < 0 || index >= problems.length) {
    throw new Error("That problem could not be found.");
  }

  const problem = problems[index];
  const key = problemKey(problem);

  if (completed) {
    completedProblemKeys.add(key);
  } else {
    completedProblemKeys.delete(key);
  }

  saveCompletedProblems();
  renderProblems();
  elements.bankMessage.textContent = completed
    ? `${problem.problem} is completed for this session and will not be rolled again.`
    : `${problem.problem} is available in this session again.`;
  return problem;
}

function completeCurrentProblem() {
  if (!currentProblemKey || completedProblemKeys.has(currentProblemKey)) return null;

  const index = problems.findIndex((problem) => problemKey(problem) === currentProblemKey);
  if (index < 0) return null;

  return setProblemCompleted(index, true);
}

function restartSession() {
  completedProblemKeys.clear();
  previousProblemKey = null;
  saveCompletedProblems();
  renderProblems();
  elements.bankMessage.textContent = "Session restarted. Every saved problem can be rolled again.";
}

function escapeCSVValue(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function createCSV() {
  const rows = ["Problem,Link"];
  problems.forEach((problem) => {
    rows.push(`${escapeCSVValue(problem.problem)},${escapeCSVValue(problem.link)}`);
  });
  return rows.join("\r\n");
}

function exportCSV() {
  if (problems.length === 0) {
    elements.bankMessage.textContent = "Add at least one problem before exporting.";
    return;
  }

  const blob = new Blob([createCSV()], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = "leetcode-problems.csv";
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
  elements.bankMessage.textContent = "CSV export downloaded.";
}

function parseCSV(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  row.push(field);
  rows.push(row);
  return rows;
}

function importCSVText(csvText) {
  const rows = parseCSV(csvText).filter((row) => row.some((value) => value.trim()));

  if (rows.length === 0) {
    throw new Error("The selected CSV file is empty.");
  }

  const header = rows[0].map((value) => value.replace(/^\uFEFF/, "").trim().toLowerCase());
  if (header[0] !== "problem" || header[1] !== "link") {
    throw new Error("The CSV must start with the columns Problem,Link.");
  }

  const existingKeys = new Set(problems.map(problemKey));
  let importedCount = 0;
  let skippedCount = 0;

  rows.slice(1).forEach((row) => {
    const newProblem = {
      problem: (row[0] || "").trim(),
      link: (row[1] || "").trim(),
    };

    if (!newProblem.problem && !newProblem.link) {
      return;
    }

    const key = problemKey(newProblem);
    if (!newProblem.problem || !isValidWebLink(newProblem.link) || existingKeys.has(key)) {
      skippedCount += 1;
      return;
    }

    problems.push(newProblem);
    existingKeys.add(key);
    importedCount += 1;
  });

  if (importedCount > 0) {
    saveProblems();
    renderProblems();
  }

  return { importedCount, skippedCount };
}

async function importCSV(file) {
  if (!file) return;

  try {
    const result = importCSVText(await file.text());
    const skippedText = result.skippedCount
      ? ` ${result.skippedCount} invalid or duplicate ${result.skippedCount === 1 ? "row was" : "rows were"} skipped.`
      : "";
    elements.bankMessage.textContent = `${result.importedCount} ${result.importedCount === 1 ? "problem" : "problems"} imported.${skippedText}`;
  } catch (error) {
    elements.bankMessage.textContent = error.message;
  } finally {
    elements.csvFileInput.value = "";
  }
}

function clearProblems() {
  if (problems.length === 0) {
    elements.bankMessage.textContent = "Your problem bank is already empty.";
    return false;
  }

  if (!confirm("Are you sure you want to delete all problems?")) {
    return false;
  }

  problems = [];
  completedProblemKeys.clear();
  previousProblemKey = null;
  currentProblemKey = null;
  saveProblems();
  saveCompletedProblems();
  renderProblems();
  elements.randomResult.hidden = true;
  elements.randomEmptyMessage.hidden = false;
  elements.randomEmptyMessage.textContent = "Add a problem below to start a random practice session.";
  elements.bankMessage.textContent = "All problems were deleted.";
  return true;
}

function registerWebMCPTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const register = (tool) => {
    try {
      Promise.resolve(context.registerTool(tool)).catch(() => {});
    } catch {
      // WebMCP is optional and should never stop the visible app from working.
    }
  };

  register({
    name: "list_problem_bank",
    title: "List problem bank",
    description: "Return every problem currently stored in the LeetCode practice bank.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute() {
      return {
        count: problems.length,
        availableCount: problems.filter((problem) => !isProblemCompleted(problem)).length,
        completedCount: problems.filter(isProblemCompleted).length,
        problems: problems.map((problem) => ({
          ...problem,
          completedThisSession: isProblemCompleted(problem),
        })),
      };
    },
  });

  register({
    name: "add_problem",
    title: "Add problem",
    description: "Add one problem name and web link to the saved practice bank.",
    inputSchema: {
      type: "object",
      properties: {
        problem: { type: "string", minLength: 1 },
        link: { type: "string", minLength: 1 },
      },
      required: ["problem", "link"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute(input) {
      const added = addProblem(input?.problem || "", input?.link || "");
      elements.bankMessage.textContent = "Problem added to your bank.";
      return { added, count: problems.length };
    },
  });

  register({
    name: "generate_random_problem",
    title: "Generate random problem",
    description: "Select and show one random problem without immediately repeating the last result.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute() {
      const selected = generateRandomProblem();
      if (!selected) {
        throw new Error(
          problems.length
            ? "Every problem is completed for this session. Restart the session to continue."
            : "Add at least one problem before generating.",
        );
      }
      return { problem: selected.problem, link: selected.link };
    },
  });

  register({
    name: "delete_problem",
    title: "Delete problem",
    description: "Delete a problem from the bank by its exact name and link.",
    inputSchema: {
      type: "object",
      properties: {
        problem: { type: "string", minLength: 1 },
        link: { type: "string", minLength: 1 },
      },
      required: ["problem", "link"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute(input) {
      const index = problems.findIndex(
        (problem) => problemKey(problem) === problemKey({ problem: input?.problem || "", link: input?.link || "" }),
      );
      const deleted = deleteProblem(index);
      return { deleted, count: problems.length };
    },
  });
}

function handleTableClick(event) {
  const completionButton = event.target.closest(".completion-button--table");
  if (completionButton) {
    try {
      const index = Number(completionButton.dataset.index);
      setProblemCompleted(index, completionButton.getAttribute("aria-pressed") !== "true");
    } catch (error) {
      elements.bankMessage.textContent = error.message;
    }
    return;
  }

  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton) return;

  try {
    deleteProblem(Number(deleteButton.dataset.index));
  } catch (error) {
    elements.bankMessage.textContent = error.message;
  }
}

function handleKeyboardShortcut(event) {
  const targetTag = event.target.tagName;
  const isTyping = targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT";
  if (!isTyping && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "g") {
    event.preventDefault();
    generateRandomProblem();
  }
}

function initializeApp() {
  loadProblems();
  loadCompletedProblems();
  renderProblems();
  registerWebMCPTools();

  elements.form.addEventListener("submit", handleAddProblem);
  elements.tableBody.addEventListener("click", handleTableClick);
  elements.generateButton.addEventListener("click", generateRandomProblem);
  elements.completeProblemButton.addEventListener("click", completeCurrentProblem);
  elements.restartSessionButton.addEventListener("click", restartSession);
  elements.importButton.addEventListener("click", () => elements.csvFileInput.click());
  elements.csvFileInput.addEventListener("change", () => importCSV(elements.csvFileInput.files[0]));
  elements.exportButton.addEventListener("click", exportCSV);
  elements.clearButton.addEventListener("click", clearProblems);
  document.addEventListener("keydown", handleKeyboardShortcut);
}

initializeApp();
