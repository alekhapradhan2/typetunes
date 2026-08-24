'use client';

import React from 'react';
import NewspaperStudio from '@/components/newspaper/NewspaperStudio';

export default function NewspaperPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-hero py-4 sm:py-6">
      <NewspaperStudio />
    </div>
  );
}
