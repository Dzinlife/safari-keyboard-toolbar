import React from "react";
import { useKeyboardEdge } from "./useKeyboardEdge";

const App: React.FC = () => {
  const { keyboardEdgeBottom } = useKeyboardEdge();
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Using Safari to open this page, click this text field, the toolbar
          will be show above the keyboard edge
        </h1>
        <input type="text" style={{ width: "100%" }} placeholder="TEXT FIELD" />
        <div style={{ height: 1000 }} />
        <div className="toolbar" style={{ bottom: keyboardEdgeBottom }}>
          Toolbar
        </div>
      </header>
    </div>
  );
};

export default App;
