// pages/NewsletterPage.jsx
import React from 'react';
import NewsletterForm from '../components/NewsletterForm';

const NewsletterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <NewsletterForm />
      </div>
    </div>
  );
};

export default NewsletterPage;