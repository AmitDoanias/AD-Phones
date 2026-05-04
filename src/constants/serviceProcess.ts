export const SERVICE_STEPS = [
  {
    title: "אבחון חינם תוך רבע שעה",
    description: "בדיקה מלאה ברמת הרכיב - לא ניחושים, אלא אבחון מבוסס נתונים.",
  },
  {
    title: "הצעת מחיר שקופה",
    description: "המחיר סופי לפני שמתחילים. לא תיקנת - לא שילמת.",
  },
  {
    title: "תיקון תוך 30 דקות",
    description: "לרוב התיקונים, מתבצע מול הלקוח.",
  },
  {
    title: "חלקים מקוריים",
    description: "אחריות 3 חודשים על כל תיקון.",
  },
];

export const SERVICE_PROCESS_DATA = {
  name: "תהליך השירות באיי די פון",
  description:
    "ארבעה שלבים לתיקון מקצועי, שקוף ומהיר - מהאבחון ועד למסירת המכשיר עם אחריות.",
  steps: SERVICE_STEPS.map((s) => ({ name: s.title, text: s.description })),
};
