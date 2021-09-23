import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import Home from "./components/home/Home";
import Login from "./components/login/Login";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
