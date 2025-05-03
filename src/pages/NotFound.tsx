
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-2xl font-medium mb-4">Page Not Found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Return to Journal</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
