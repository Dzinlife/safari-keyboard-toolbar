import React from "react";
import InputX from "./InputX";

const App: React.FC = () => {
  return (
    <div className="App" id="app">
      <header className="App-header">
        <h1>
          Using Safari to open this page, click this text field, the toolbar
        </h1>
        <InputX />
        <div style={{ height: 1000 }} />
      </header>
    </div>
  );
};

export default App;
