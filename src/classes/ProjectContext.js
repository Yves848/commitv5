import React from 'react';
const ProjectContext = React.createContext(null);

export const withProject = Component => props => (
   <ProjectContext.Provider>{project => <Component {...props} project={project} />}</ProjectContext.Provider>
);

export default ProjectContext;


