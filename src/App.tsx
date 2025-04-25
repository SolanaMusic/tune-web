import "./App.css";
import LoginWithPhantom from "./components/Auth/LoginWithPhantom";
import PhantomTransaction from "./components/Wallet/PhantomTransaction";

function App() {
  return (
    <div>
      <h1>Phantom Wallet Tests</h1>
      <LoginWithPhantom />
      <PhantomTransaction />
    </div>
  );
}

export default App;
