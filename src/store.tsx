import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Project, Lesson, MCQ, Settings, Proposition } from './types';
import { v4 as uuidv4 } from 'uuid';
import defaultData from './data.json';

interface AppState {
  project: Project;
  settings: Settings;
  activeLessonId: string | null;
  activeMcqId: string | null;
  past: Project[];
}

type Action =
  | { type: 'LOAD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT_FROM_AI'; payload: Project }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'ADD_LESSON'; payload: Lesson }
  | { type: 'UPDATE_LESSON'; payload: { id: string; updates: Partial<Lesson> } }
  | { type: 'DELETE_LESSON'; payload: string }
  | { type: 'REORDER_LESSONS'; payload: Lesson[] }
  | { type: 'SET_ACTIVE_LESSON'; payload: string | null }
  | { type: 'ADD_MCQ'; payload: { lessonId: string; mcq: MCQ } }
  | { type: 'UPDATE_MCQ'; payload: { lessonId: string; mcqId: string; updates: Partial<MCQ> } }
  | { type: 'DELETE_MCQ'; payload: { lessonId: string; mcqId: string } }
  | { type: 'DUPLICATE_MCQ'; payload: { lessonId: string; mcqId: string } }
  | { type: 'REORDER_MCQS'; payload: { lessonId: string; mcqs: MCQ[] } }
  | { type: 'SET_ACTIVE_MCQ'; payload: string | null }
  | { type: 'UNDO' };

const defaultSettings: Settings = {
  mcqTextSize: 10,
  propTextSize: 9,
  density: 1.4,
  marginTop: 24,
  marginBottom: 24,
  marginLeft: 20,
  marginRight: 20,
  columnGap: 12,
  enableExplanations: true,
  highlightDuplicates: true,
};

const defaultProject: Project = defaultData as Project;

const initialState: AppState = {
  project: defaultProject,
  settings: defaultSettings,
  activeLessonId: null,
  activeMcqId: null,
  past: [],
};

function baseReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_PROJECT':
      return { ...state, project: action.payload, activeLessonId: null, activeMcqId: null, past: [] };
    case 'UPDATE_PROJECT_FROM_AI':
      return { ...state, project: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_LESSON':
      return {
        ...state,
        project: { ...state.project, lessons: [...state.project.lessons, action.payload] },
        activeLessonId: action.payload.id,
      };
    case 'UPDATE_LESSON':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.id ? { ...l, ...action.payload.updates } : l
          ),
        },
      };
    case 'DELETE_LESSON':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.filter((l) => l.id !== action.payload),
        },
        activeLessonId: state.activeLessonId === action.payload ? null : state.activeLessonId,
      };
    case 'REORDER_LESSONS':
      return { ...state, project: { ...state.project, lessons: action.payload } };
    case 'SET_ACTIVE_LESSON':
      return { ...state, activeLessonId: action.payload, activeMcqId: null };
    case 'ADD_MCQ':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.lessonId ? { ...l, mcqs: [...l.mcqs, action.payload.mcq] } : l
          ),
        },
        activeMcqId: action.payload.mcq.id,
      };
    case 'UPDATE_MCQ':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.lessonId
              ? {
                  ...l,
                  mcqs: l.mcqs.map((m) =>
                    m.id === action.payload.mcqId ? { ...m, ...action.payload.updates } : m
                  ),
                }
              : l
          ),
        },
      };
    case 'DELETE_MCQ':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.lessonId
              ? { ...l, mcqs: l.mcqs.filter((m) => m.id !== action.payload.mcqId) }
              : l
          ),
        },
        activeMcqId: state.activeMcqId === action.payload.mcqId ? null : state.activeMcqId,
      };
    case 'DUPLICATE_MCQ': {
      const lesson = state.project.lessons.find((l) => l.id === action.payload.lessonId);
      if (!lesson) return state;
      const mcq = lesson.mcqs.find((m) => m.id === action.payload.mcqId);
      if (!mcq) return state;
      const newMcq: MCQ = {
        ...mcq,
        id: uuidv4(),
        propositions: mcq.propositions.map((p) => ({ ...p, id: uuidv4() })),
      };
      const mcqIndex = lesson.mcqs.findIndex((m) => m.id === action.payload.mcqId);
      const newMcqs = [...lesson.mcqs];
      newMcqs.splice(mcqIndex + 1, 0, newMcq);
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.lessonId ? { ...l, mcqs: newMcqs } : l
          ),
        },
        activeMcqId: newMcq.id,
      };
    }
    case 'REORDER_MCQS':
      return {
        ...state,
        project: {
          ...state.project,
          lessons: state.project.lessons.map((l) =>
            l.id === action.payload.lessonId ? { ...l, mcqs: action.payload.mcqs } : l
          ),
        },
      };
    case 'SET_ACTIVE_MCQ':
      return { ...state, activeMcqId: action.payload };
    default:
      return state;
  }
}

function appReducer(state: AppState, action: Action): AppState {
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state;
    const previous = state.past[0];
    const newPast = state.past.slice(1);
    return { ...state, project: previous, past: newPast };
  }

  const newState = baseReducer(state, action);
  
  if (newState.project !== state.project && action.type !== 'LOAD_PROJECT') {
    const newPast = [state.project, ...state.past].slice(0, 50);
    return { ...newState, past: newPast };
  }
  
  return newState;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    const saved = localStorage.getItem('mcq-project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initial, project: parsed.project || parsed, settings: parsed.settings || initial.settings, past: [] };
      } catch (e) {
        console.error('Failed to parse saved project', e);
      }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('mcq-project', JSON.stringify({ project: state.project, settings: state.settings }));
  }, [state.project, state.settings]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function createEmptyMCQ(): MCQ {
  return {
    id: uuidv4(),
    stem: '',
    propositions: [
      { id: uuidv4(), letter: 'A', text: '' },
      { id: uuidv4(), letter: 'B', text: '' },
      { id: uuidv4(), letter: 'C', text: '' },
      { id: uuidv4(), letter: 'D', text: '' },
      { id: uuidv4(), letter: 'E', text: '' },
    ],
    correctAnswers: [],
    explanation: '',
  };
}
