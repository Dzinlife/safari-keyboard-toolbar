import React, { useMemo, useState } from "react";
import EdgeBar from "./EdgeBar";
import { throttle } from "lodash";

const App: React.FC = () => {
  const [toast, setToast] = useState("");

  const showToast = useMemo(() => {
    return throttle(() => {
      setToast("Button clicked, and prevent input blur from closing keyboard");
      setTimeout(() => {
        setToast("");
      }, 2000);
    }, 2000);
  }, []);

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
            <button
              onTouchEndCapture={(e) => {
                e.preventDefault();
                showToast();
              }}
              onClick={(e) => {
                showToast();
              }}
            >
              button
            </button>
          </div>
        }
      >
        <input style={{ height: 32 }} />
      </EdgeBar>
      <div
        style={{
          opacity: toast ? 1 : 0,
          transition: "ease 0.3s",
          padding: 10,
          position: "fixed",
          margin: "auto",
          inset: 0,
          width: 300,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "rgba(0,0,0, 0.7)",
          backdropFilter: "blur(20px)",
          borderRadius: 10,
        }}
      >
        {toast}
      </div>
      <div style={{ height: 1000 }}></div>
    </div>
  );
};

export default App;
