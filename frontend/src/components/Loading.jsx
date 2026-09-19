import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="loading-container">
      <Loader2 className="animate-spin" size={32} color="var(--primary)" />
    </div>
  );
};

export default Loading;
