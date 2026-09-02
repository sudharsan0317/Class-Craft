const MOCK_LESSON_PLAN = {
  title: 'Introduction to Photosynthesis',
  subject: 'Science',
  gradeLevel: 'Grade 7',
  duration: 45,
  objectives: [
    'Describe how plants convert light energy into chemical energy.',
    'Identify the inputs and outputs of photosynthesis.',
  ],
  phases: [
    {
      id: 'warm-up',
      title: 'Warm-up',
      duration: 5,
      instructions: 'Ask students what plants need in order to grow.',
      questions: [],
    },
    {
      id: 'explore',
      title: 'Explore',
      duration: 25,
      instructions: 'Use a leaf diagram to trace the process of photosynthesis.',
      questions: [
        {
          id: 'photosynthesis-inputs',
          question: 'Which two inputs are required for photosynthesis?',
          type: 'multiple-choice',
          options: ['Light and carbon dioxide', 'Oxygen and soil', 'Water and oxygen', 'Sugar and nitrogen'],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 'exit-ticket',
      title: 'Exit ticket',
      duration: 5,
      instructions: 'Have students explain one way leaves support photosynthesis.',
      questions: [],
    },
  ],
};

export async function generateLessonPlan(payload) {
  try {
    const response = await fetch('http://localhost:8000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Lesson generation failed with status ${response.status}`);
    }

    return await response.json();
  } catch {
    return structuredClone(MOCK_LESSON_PLAN);
  }
}

export { MOCK_LESSON_PLAN };