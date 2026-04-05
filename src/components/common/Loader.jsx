import React from 'react';

const Loader = ({ size = 'md', fullPage = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const containerClasses = fullPage 
    ? "h-[60vh] flex items-center justify-center pt-20"
    : `flex items-center justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary-100 border-t-primary-600`}
      />
    </div>
  );
};

export default Loader;
