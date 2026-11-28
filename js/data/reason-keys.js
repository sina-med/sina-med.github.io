/* Key ideas for the optional "Explain the reasoning" box (js/reason.js).
   Without an entry here, key words are picked automatically from the question's explanation.
   To set them by hand, add the question's code (shown by SinaReason in the browser console, or its "_k" in a report) and a list:
     - each item is one key idea;
     - a list inside the list gives alternatives that count the same: ["vasoconstriction", "constricts the arterioles"];
     - an alternative of several words counts when all of its words appear, in any order.
   Set a question to [] to hide the box on it.
   Example:
     "1x2y3z": ["aldosterone", ["sodium reabsorption", "reabsorbs Na", "Na+ retention"], ["collecting duct", "distal tubule"]],
*/
window.SINA = window.SINA || { subjects: [], lectures: {} };
SINA.reasonKeys = {
};
