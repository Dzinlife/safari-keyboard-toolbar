import React from "react";
import InputX from "./InputX";
import EdgeBar from "./EdgeBar";

const App: React.FC = () => {
  return (
    <div className="App" id="app">
      <header className="App-header"></header>
      <h1>
        Using Safari to open this page, click this text field, the toolbar will
        be shown above the keyboard edge.
      </h1>
      <EdgeBar
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        toolbar={
          <div>
            <button>button</button>
          </div>
        }
      >
        <input />
      </EdgeBar>
      <div style={{ height: 1000 }} />
    </div>
  );
};

export default App;
