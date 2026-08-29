import { createContext, useContext, useState } from "react";

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [activeResume, setActiveResume] = useState(null);

  return (
    <ResumeContext.Provider value={{ activeResume, setActiveResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}