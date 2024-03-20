import Home from "./pages/home";
import { Toaster } from 'react-hot-toast'

function App () {
  return (
    <>
      <Toaster />
      <div className="app w-screen h-screen">
        <Home />
      </div>
    </>
  );
}

export default App;
