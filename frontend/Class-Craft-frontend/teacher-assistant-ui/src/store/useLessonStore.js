import { create } from 'zustand';

const clone = (value) => (value === undefined || value === null ? value : structuredClone(value));

const freezeDeep = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freezeDeep);
  }
  return value;
};

const getPhases = (lesson) => {
  if (!lesson) return [];
  if (Array.isArray(lesson.phases)) return lesson.phases;
  if (Array.isArray(lesson.lessonPhases)) return lesson.lessonPhases;
  return [];
};

const makeQuestion = (question = {}) => ({
  id: question.id ?? `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  question: '',
  type: 'multiple-choice',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 0,
  ...clone(question),
});

// INITIAL_CLASS_PROFILES removed for dynamic fetching

export const useLessonStore = create((set, get) => ({
  // Dark Mode State
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // User Profile
  userName: "",
  setUserName: (userName) => set({ userName }),

  // Authentication
  isAuthenticated: false,
  user: null,
  login: (userData) =>
    set({ 
      isAuthenticated: true, 
      user: userData,
      userName: userData?.name || ""
    }),
  logout: () => set({ isAuthenticated: false, user: null, userName: "" }),

  // Teacher Preferences
  teacherPreferences: {
    teaching_depth: "Standard",
    explanation_style: "Balanced",
    student_readiness: "At Grade Level",
    assessment_difficulty: "Moderate",
    include_misconceptions: false
  },
  setTeacherPreferences: (newPrefs) => set((state) => ({ 
    teacherPreferences: { ...state.teacherPreferences, ...newPrefs }
  })),

  // Active Tool / View State ('home' | 'tools' | 'resource' | 'class' | 'class_detail' | 'support' | 'settings' | 'manage_account')
  activeTool: 'home',
  setActiveTool: (activeTool) => set({ activeTool }),

  // Class Profiles & Context Tracking
  classProfiles: [],
  setClassProfiles: (profiles) => set({ classProfiles: profiles }),
  selectedClassId: 'bio-10',
  lastActiveClassId: null,
  setLastActiveClassId: (lastActiveClassId) => set({ lastActiveClassId }),
  classContext: null,

  // Form Synchronization
  generatorForm: {
    subject: '',
    gradeLevel: '',
    learningObjective: '',
    duration: 45,
    sourceMaterialText: '',
    file: null,
  },

  setGeneratorForm: (updates) => {
    set((state) => {
      const updatedForm = { ...state.generatorForm, ...clone(updates) };
      let updatedLesson = state.editedLesson;
      if (updatedLesson) {
        updatedLesson = {
          ...updatedLesson,
          duration: updatedForm.duration,
          subject: updatedForm.subject || updatedLesson.subject,
          gradeLevel: updatedForm.gradeLevel || updatedLesson.gradeLevel,
        };
      }
      return { generatorForm: updatedForm, editedLesson: updatedLesson };
    });
  },

  setSelectedClassId: (classId) => {
    const profile = get().classProfiles.find((c) => c.id === classId);
    if (!profile) return;
    set((state) => ({
      selectedClassId: classId,
      lastActiveClassId: classId,
      classContext: clone(profile),
      generatorForm: {
        ...state.generatorForm,
        subject: profile.subject || profile.name,
        gradeLevel: profile.gradeLevel || profile.grade || 'Grade 10',
      },
      editedLesson: state.editedLesson
        ? {
            ...state.editedLesson,
            subject: profile.subject || state.editedLesson.subject,
            gradeLevel: profile.gradeLevel || profile.grade || state.editedLesson.gradeLevel,
          }
        : null,
    }));
  },

  addClassProfile: (newProfile) => {
    const id = newProfile.id || `class-${Date.now()}`;
    const profile = {
      id,
      name: newProfile.name || `${newProfile.gradeLevel || 'Grade 10'} ${newProfile.subject || 'General'}`,
      subject: newProfile.subject || 'General Science',
      grade: newProfile.gradeLevel || newProfile.grade || 'Grade 10',
      gradeLevel: newProfile.gradeLevel || newProfile.grade || 'Grade 10',
      studentsCount: Number(newProfile.studentsCount) || 25,
      level: newProfile.level || 'Intermediate',
      notes: newProfile.notes || 'Focus on student engagement and structured understanding.'
    };
    set((state) => ({
      classProfiles: [...state.classProfiles, profile],
      selectedClassId: profile.id,
      lastActiveClassId: profile.id,
      classContext: clone(profile),
      generatorForm: {
        ...state.generatorForm,
        subject: profile.subject,
        gradeLevel: profile.gradeLevel,
      }
    }));
  },

  // Lesson Plan Data
  draftLesson: null,
  editedLesson: null,
  isLoading: false,
  error: null,

  setLessonData: (lessonData) => {
    const rawLesson = clone(lessonData);
    set({
      draftLesson: freezeDeep(rawLesson),
      editedLesson: clone(rawLesson),
    });
  },

  setEditedLesson: (editedLesson) => set({ editedLesson: clone(editedLesson) }),

  updateLessonMetadata: (updates) => {
    set((state) => {
      if (!state.editedLesson) return state;
      return { editedLesson: { ...state.editedLesson, ...clone(updates) } };
    });
  },

  setStudyMaterials: (studyMaterials) => {
    set((state) => {
      if (!state.editedLesson) return state;
      return { editedLesson: { ...state.editedLesson, studyMaterials: clone(studyMaterials) } };
    });
  },

  updatePhase: (id, updatedFields) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const phases = getPhases(state.editedLesson);
      const phaseIndex = phases.findIndex((phase) => phase.id === id);
      if (phaseIndex === -1) return state;
      const editedLesson = clone(state.editedLesson);
      const editedPhases = getPhases(editedLesson);
      editedPhases[phaseIndex] = { ...editedPhases[phaseIndex], ...clone(updatedFields) };
      return { editedLesson };
    });
  },

  addPhase: (phaseData = {}) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const editedLesson = clone(state.editedLesson);
      const phases = getPhases(editedLesson);
      const newPhase = {
        id: phaseData.id || `phase-${Date.now()}`,
        title: phaseData.title || `Phase ${phases.length + 1}: Interactive Review`,
        duration: Number(phaseData.duration) || 10,
        instructions: phaseData.instructions || 'Interactive group review and checkpoint discussion.',
        questions: [],
        ...clone(phaseData)
      };
      if (Array.isArray(editedLesson.phases)) {
        editedLesson.phases.push(newPhase);
      } else {
        editedLesson.lessonPhases = [...(editedLesson.lessonPhases || []), newPhase];
      }
      return { editedLesson };
    });
  },

  deletePhase: (phaseId) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const editedLesson = clone(state.editedLesson);
      if (Array.isArray(editedLesson.phases)) {
        editedLesson.phases = editedLesson.phases.filter((p) => p.id !== phaseId);
      }
      if (Array.isArray(editedLesson.lessonPhases)) {
        editedLesson.lessonPhases = editedLesson.lessonPhases.filter((p) => p.id !== phaseId);
      }
      return { editedLesson };
    });
  },

  movePhase: (phaseId, direction) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const editedLesson = clone(state.editedLesson);
      const key = Array.isArray(editedLesson.phases) ? 'phases' : 'lessonPhases';
      const phases = [...(editedLesson[key] || [])];
      const index = phases.findIndex((p) => p.id === phaseId);
      if (index === -1) return state;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= phases.length) return state;
      const temp = phases[index];
      phases[index] = phases[targetIndex];
      phases[targetIndex] = temp;
      editedLesson[key] = phases;
      return { editedLesson };
    });
  },

  rebalancePhaseDurations: (targetTotal) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const target = Number(targetTotal) || Number(state.generatorForm.duration) || Number(state.editedLesson.duration) || 45;
      const editedLesson = clone(state.editedLesson);
      const key = Array.isArray(editedLesson.phases) ? 'phases' : 'lessonPhases';
      const phases = editedLesson[key] || [];
      if (phases.length === 0) return state;
      const perPhase = Math.floor(target / phases.length);
      const remainder = target % phases.length;
      phases.forEach((p, idx) => {
        p.duration = perPhase + (idx === phases.length - 1 ? remainder : 0);
      });
      editedLesson.duration = target;
      editedLesson[key] = phases;
      return { editedLesson };
    });
  },

  updateQuestion: (id, updatedFields) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const phase = getPhases(state.editedLesson).find((c) =>
        Array.isArray(c.questions) && c.questions.some((q) => q.id === id)
      );
      if (!phase) return state;
      const editedLesson = clone(state.editedLesson);
      const editedPhase = getPhases(editedLesson).find((c) => c.id === phase.id);
      const questionIndex = editedPhase.questions.findIndex((q) => q.id === id);
      editedPhase.questions[questionIndex] = { ...editedPhase.questions[questionIndex], ...clone(updatedFields) };
      return { editedLesson };
    });
  },

  setCorrectAnswer: (questionId, optionIndex) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const phase = getPhases(state.editedLesson).find((c) =>
        Array.isArray(c.questions) && c.questions.some((q) => q.id === questionId)
      );
      if (!phase) return state;
      const editedLesson = clone(state.editedLesson);
      const question = getPhases(editedLesson)
        .find((c) => c.id === phase.id)
        .questions.find((c) => c.id === questionId);
      question.correctAnswer = optionIndex;
      return { editedLesson };
    });
  },

  addQuestion: (phaseId, question) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const phase = getPhases(state.editedLesson).find((c) => c.id === phaseId);
      if (!phase) return state;
      const editedLesson = clone(state.editedLesson);
      const editedPhase = getPhases(editedLesson).find((c) => c.id === phaseId);
      editedPhase.questions = [...(editedPhase.questions || []), makeQuestion(question)];
      return { editedLesson };
    });
  },

  deleteQuestion: (id) => {
    set((state) => {
      if (!state.editedLesson) return state;
      const editedLesson = clone(state.editedLesson);
      const phase = getPhases(editedLesson).find((c) =>
        Array.isArray(c.questions) && c.questions.some((q) => q.id === id)
      );
      if (!phase) return state;
      phase.questions = phase.questions.filter((q) => q.id !== id);
      return { editedLesson };
    });
  },

  setClassContext: (classContext) => set({ classContext: clone(classContext) }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useLessonStore;
