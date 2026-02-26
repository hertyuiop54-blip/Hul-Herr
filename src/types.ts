export interface Project {
  version: number;
  projectName: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  mcqs: MCQ[];
}

export interface MCQ {
  id: string;
  stem: string;
  propositions: Proposition[];
  correctAnswers: string[]; // array of letters (A, B, C, D, E)
  explanation: string;
  showExplanationOverride?: boolean;
  disableE?: boolean;
}

export interface Proposition {
  id: string;
  letter: string;
  text: string;
}

export interface Settings {
  mcqTextSize: number;
  propTextSize: number;
  density: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  columnGap: number;
  enableExplanations: boolean;
  highlightDuplicates: boolean;
  geminiApiKey?: string;
}
