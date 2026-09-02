const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateLessonPlan(payload) {
  const isFormData = payload instanceof FormData;
  
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Lesson generation failed with status ${response.status}`);
  }

  return await response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  return await response.json();
}

export async function signupUser(data) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Signup failed');
  }
  return await response.json();
}

export async function googleLogin(credential) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Google Login failed');
  }
  return await response.json();
}

export async function microsoftLogin(access_token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/microsoft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Microsoft Login failed');
  }
  return await response.json();
}

export async function generateQuizQuestions(payload) {
  const response = await fetch(`${API_BASE_URL}/api/generate/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to generate quiz');
  return await response.json();
}

export async function fetchClasses() {
  const response = await fetch(`${API_BASE_URL}/api/classes`);
  if (!response.ok) throw new Error('Failed to fetch classes');
  return await response.json();
}

export async function fetchConfig() {
  const response = await fetch(`${API_BASE_URL}/api/config`);
  if (!response.ok) throw new Error('Failed to fetch config');
  return await response.json();
}

export async function fetchFAQs() {
  const response = await fetch(`${API_BASE_URL}/api/faqs`);
  if (!response.ok) throw new Error('Failed to fetch FAQs');
  return await response.json();
}

export async function generateStudyMaterials(payload) {
  const response = await fetch(`${API_BASE_URL}/api/generate/study-materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to generate study materials');
  return await response.json();
}