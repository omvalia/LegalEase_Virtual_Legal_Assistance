import React from 'react';
import WorkspaceNavigation from './workspace_naviagtion';
import '../css/workspace_navigation.css';

function Cases() {
  return (
    <div className="main-content">
      <WorkspaceNavigation /> {/* Render the sidebar navigation here */}
    </div>
  );
}

export default Cases;
