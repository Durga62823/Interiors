import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export function AdminBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
      <ol className="flex items-center space-x-1 md:space-x-2">
        <li className="flex items-center">
          <Link to="/admin" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          if (value === 'admin' && index === 0) return null;
          
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const title = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <React.Fragment key={to}>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
              <li className="flex items-center">
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {title}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-foreground transition-colors">
                    {title}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
