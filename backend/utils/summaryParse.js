export const parseSummaryResponse = (text) => {
  const summary = { paragraph: "", keyDecisions: [], actionItems: [] };

  const summaryMatch = text.match(/Summary[:\-–]?\s*([\s\S]*?)(?=\n\s*(Decisions|Key Decisions|Action Items|$))/i);
  const decisionsMatch = text.match(/Decisions?[:\-–]?\s*([\s\S]*?)(?=\n\s*(Action Items|$))/i);
  const actionsMatch = text.match(/Action\s*Items?[:\-–]?\s*([\s\S]*)/i);

  summary.paragraph = summaryMatch ? summaryMatch[1].trim() : "";

  const cleanLines = (block) =>
    block
      .split(/\n+/)
      .map((line) => line.replace(/^[-•\d.]*\s*/, "").trim())
      .filter((line) => line && !/^(\*|Relevant|Speaker|Group|Jay)/i.test(line));

  if (decisionsMatch) {
    const lines = cleanLines(decisionsMatch[1]);
    const merged = mergeBrokenLines(lines);
    summary.keyDecisions = merged.map((d) => ({ decision: d }));
  }

  if (actionsMatch) {
    const lines = cleanLines(actionsMatch[1]);
    const merged = mergeBrokenLines(lines);
    summary.actionItems = merged.map((line) => extractResponsible(line));
  }

  return summary;
};

// 🔧 Merge broken lines (e.g. "The Anti" + "Abuse section..." → "The Anti Abuse section...")
function mergeBrokenLines(lines) {
  const merged = [];
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i];
    const next = lines[i + 1];

    if (
      current &&
      current.split(" ").length < 4 &&
      next &&
      /^[a-z]/.test(next)
    ) {
      merged.push(current + " " + next);
      i++;
    } else {
      merged.push(current);
    }
  }
  return merged;
}

// 🔍 Extract responsible person from start of task
function extractResponsible(line) {
  const match = line.match(/^([\w\s,&]+?)\s+(to|should|must|will|are to|need to)\b/i);
  if (match) {
    return {
      task: line.replace(match[1], "").trim().replace(/^[-–•\d.]*\s*/, ""),
      responsiblePerson: match[1].trim(),
    };
  }
  return {
    task: line.trim(),
    responsiblePerson: "",
  };
}



// export const parseSummaryResponse = (text) => {
//   const summary = { paragraph: "", keyDecisions: [], actionItems: [] };

//   const summaryMatch = text.match(/Summary[:\-–]?\s*([\s\S]*?)(?=\n\s*(Decisions|Key Decisions|Action Items|$))/i);
//   const decisionsMatch = text.match(/Decisions?[:\-–]?\s*([\s\S]*?)(?=\n\s*(Action Items|$))/i);
//   const actionsMatch = text.match(/Action\s*Items?[:\-–]?\s*([\s\S]*)/i);

//   summary.paragraph = summaryMatch ? summaryMatch[1].trim() : "";

//   const cleanLines = (block) =>
//     block
//       .split(/\n+/)
//       .map((line) => line.replace(/^[-•\d.]*\s*/, "").trim())
//       .filter((line) => line && !/^(\*|Relevant|Speaker|Group|Jay)/i.test(line));

//   if (decisionsMatch) {
//     const lines = cleanLines(decisionsMatch[1]);
//     const merged = mergeBrokenLines(lines);
//     summary.keyDecisions = merged.map((d) => ({ decision: d }));
//   }

//   if (actionsMatch) {
//     const lines = cleanLines(actionsMatch[1]);
//     const merged = mergeBrokenLines(lines);
//     summary.actionItems = merged.map((line) => {
//       const [task, person] = line.split(" - ");
//       return {
//         task: task.trim(),
//         responsiblePerson: person?.trim() || "",
//       };
//     });
//   }

//   return summary;
// };

// // Helper to merge broken lines (e.g., "The Anti" + "Abuse team..." → "The Anti Abuse team...")
// function mergeBrokenLines(lines) {
//   const merged = [];
//   for (let i = 0; i < lines.length; i++) {
//     const current = lines[i];
//     const next = lines[i + 1];

//     if (
//       current &&
//       current.split(" ").length < 4 &&
//       next &&
//       /^[a-z]/.test(next) // next line starts lowercase → likely continuation
//     ) {
//       merged.push(current + " " + next);
//       i++; // skip next
//     } else {
//       merged.push(current);
//     }
//   }
//   return merged;
// }
