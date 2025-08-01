import React from 'react';

const GOOGLE_FORM_URL = 'https://forms.gle/pXJ7znjFug1qZaBQ6';

const FeedbackButton: React.FC = () => {
  return (
    <a
      href={GOOGLE_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-white/20 text-white p-3 rounded-full shadow-lg hover:bg-cyan-500 hover:text-white transform hover:scale-110 transition-all duration-300 z-50"
      title="Deixe o seu feedback!"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </a>
  );
};

export default FeedbackButton;
