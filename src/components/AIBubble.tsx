import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { Project } from '../types';

const projectSchema = {
  type: Type.OBJECT,
  description: "The complete project state",
  properties: {
    version: { type: Type.NUMBER },
    projectName: { type: Type.STRING },
    lessons: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          mcqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                stem: { type: Type.STRING },
                propositions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      letter: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                    required: ['id', 'letter', 'text'],
                  },
                },
                correctAnswers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                explanation: { type: Type.STRING },
                showExplanationOverride: { type: Type.BOOLEAN },
                disableE: { type: Type.BOOLEAN },
              },
              required: ['id', 'stem', 'propositions', 'correctAnswers', 'explanation'],
            },
          },
        },
        required: ['id', 'title', 'mcqs'],
      },
    },
  },
  required: ['version', 'projectName', 'lessons'],
};

const updateProjectFunctionDeclaration: FunctionDeclaration = {
  name: "updateProject",
  description: "Updates the entire project state. Call this when you need to modify the project (add/edit/delete lessons or MCQs). Pass the complete, updated project object.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      updatedProject: projectSchema
    },
    required: ["updatedProject"]
  }
};

export function AIBubble() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsProcessing(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are an AI assistant for an MCQ creation app. 
      You can help the user by answering questions or by directly modifying their project.
      When the user asks you to create, edit, or delete lessons or MCQs, you MUST use the 'updateProject' tool.
      Always preserve existing IDs when modifying existing items, and generate new UUIDs (v4) for new items.
      Current project state: ${JSON.stringify(state.project)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [updateProjectFunctionDeclaration] }],
        }
      });

      let aiText = response.text || '';
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'updateProject') {
            const updatedProject = call.args.updatedProject as Project;
            if (updatedProject && updatedProject.lessons) {
              dispatch({ type: 'UPDATE_PROJECT_FROM_AI', payload: updatedProject });
              aiText += '\n\n*(I have updated the project for you!)*';
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-white/60">
          <div className="bg-brand-600 p-4 text-white flex items-center gap-3 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-8">
                Hi! I can help you create lessons, generate MCQs, or organize your project. What would you like to do?
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-sm px-4 py-2 text-sm shadow-sm flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to edit the project..."
                className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="w-9 h-9 bg-brand-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-brand-700 transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
