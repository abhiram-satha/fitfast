import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [calories, setCalories] = useState();

  useEffect(() => {
    Promise.all([axios.get("http://localhost:8080/")])
      .then((all) => {
        const calories = all[0].data["hits"][0]["recipe"]["calories"];
        const quantityYield = all[0].data["hits"][0]["recipe"]["yield"];
        setCalories([calories / quantityYield]);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return <div className="App">Calories: {calories}</div>;
}

export default App;
