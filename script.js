let currentStep = 1;
const totalSteps = 5;

const stepPill = document.getElementById("stepPill");
const progressBar = document.getElementById("progressBar");
const steps = [...document.querySelectorAll(".step")];
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const promptOutput = document.getElementById("promptOutput");
const copyBtn = document.getElementById("copyBtn");

function setupChips(containerId) {
  document.querySelectorAll(`#${containerId} .chip`).forEach(chip => {
    chip.addEventListener("click", () => chip.classList.toggle("selected"));
  });
}

setupChips("subjects");
setupChips("interests");
setupChips("styles");

for (const [group, input] of [["subjects","subjectOther"],["interests","interestOther"],["styles","styleOther"]]) {
  const chip = document.querySelector(`#${group} .chip[data-value="Other"]`);
  const wrap = document.getElementById(`${input}Wrap`);
  if (chip && wrap) {
    const update = () => wrap.classList.toggle("show",chip.classList.contains("selected"));
    chip.addEventListener("click",update); update();
  }
}
const futureSelect = document.getElementById("future");
futureSelect.addEventListener("change", () => document.getElementById("futureOtherWrap").classList.toggle("show",futureSelect.value === "Other"));


function selectedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} .chip.selected`)]
    .map(chip => chip.dataset.value);
}

function updateStep() {
  steps.forEach(step => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });

  stepPill.textContent = `Step ${currentStep} of ${totalSteps}`;
  progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;

  backBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";
  nextBtn.style.display = currentStep < totalSteps ? "block" : "none";
  generateBtn.style.display = currentStep === totalSteps ? "block" : "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStep();
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
});

function clean(value) {
  return value.trim() || "Not provided";
}

function makeList(items) {
  return items.length ? items.join(", ") : "Not selected";
}

function buildPrompt() {
  const name = clean(document.getElementById("name").value);
  const classLevel = clean(document.getElementById("classLevel").value);
  const city = clean(document.getElementById("city").value);
  const future = clean(futureSelect.value === "Other" ? document.getElementById("futureOther").value : futureSelect.value);
  const learning = clean(document.getElementById("learning").value);
  const achievements = clean(document.getElementById("achievements").value);

  const subjects = selectedValues("subjects").map(value => value === "Other" ? (document.getElementById("subjectOther").value.trim() || "Other (not specified)") : value);
  const interests = selectedValues("interests").map(value => value === "Other" ? (document.getElementById("interestOther").value.trim() || "Other (not specified)") : value);
  const styles = selectedValues("styles").map(value => value === "Other" ? (document.getElementById("styleOther").value.trim() || "Other (not specified)") : value);
  const sections = [...document.querySelectorAll("#sections input:checked")].map(i => i.value);

  return `You are an expert web designer and beginner-friendly coding teacher.

Build a polished personal portfolio website for a school student using the information below.

STUDENT INFORMATION
- Name: ${name}
- Class: ${classLevel}
- City: ${city}
- Favourite subjects: ${makeList(subjects)}
- Interests: ${makeList(interests)}
- Future interest: ${future}
- Currently learning: ${learning}
- Real projects / activities / achievements to show: ${achievements}

WEBSITE PREFERENCES
- Visual style: ${makeList(styles)}
- Include these sections: ${makeList(sections)}

IMPORTANT CONTENT RULES
1. Do NOT invent awards, certificates, completed projects, skills, experience, achievements, competitions, or facts.
2. If the student has no real project or achievement, create a clearly labelled "Project Idea" or "Future Project" card instead.
3. Keep the language positive, age-appropriate, and student-friendly.
4. Do not include sensitive personal information such as a home address, private phone number, passwords, or other private details.
5. Do not pretend the student has achieved something they only plan to do.
6. Future goals should be presented as goals, not current achievements.

TECHNICAL REQUIREMENTS
- Create a responsive website that works on mobile, tablet, and desktop.
- Use only HTML, CSS, and vanilla JavaScript.
- Do not require a backend or database.
- Keep the design modern and polished.
- Add smooth but lightweight interactions and hover effects.
- Use accessible text contrast and readable typography.
- Do not use copyrighted logos, copied website designs, or unlicensed assets.
- If icons are needed, use simple emoji or CSS rather than copyrighted logos.
- Write beginner-friendly comments in the code.
- Create exactly these files:
  1. index.html
  2. style.css
  3. script.js

DESIGN DIRECTION
Make the website feel like a student's own digital identity—not a corporate resume.
Use ${makeList(styles)} as the main visual direction.
Make the hero section visually strong, but keep the website clean and easy to navigate.

Include a small footer message:
"Keep Learning • Keep Building • Keep Exploring 🚀"

FINAL OUTPUT
Provide the complete code for index.html, style.css, and script.js in separate code blocks.
Make sure all three files work together without missing references.
Do not use placeholders for information that was provided above.`;
}

generateBtn.addEventListener("click", () => {
  promptOutput.value = buildPrompt();
  result.classList.add("show");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(promptOutput.value);
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => copyBtn.textContent = "Copy Prompt", 1600);
  } catch {
    promptOutput.select();
    document.execCommand("copy");
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => copyBtn.textContent = "Copy Prompt", 1600);
  }
});

updateStep();
