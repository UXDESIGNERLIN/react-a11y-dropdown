import React from "react";
import AllyDropDown from "./A11yDropDown";
function App() {
  const options = [
    "english",
    "catalan",
    "spanish",
    "meow",
    "hoho",
    "mdwod",
    "wer"
  ];
  function onSelect(item) {
    console.log("selected", item);
  }
  return (
    <div className="App" style={{ display: "flex" }}>
      <AllyDropDown
        id="dropdown1"
        defaultSelectedValue={options[1]}
        options={options}
        onSelect={onSelect}
      />
      <AllyDropDown
        id="dropdown2"
        defaultSelectedValue={options[1]}
        options={options}
        onSelect={onSelect}
      />
    </div>
  );
}

export default App;
