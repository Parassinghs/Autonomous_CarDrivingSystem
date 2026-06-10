import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import AdminPage from "@/pages/AdminPage";
import ScrollCar from "@/components/ScrollCar";

function App() {
  return (
    <div className="App">
      <ScrollCar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(10, 11, 16, 0.95)",
            border: "1px solid rgba(0, 229, 255, 0.25)",
            color: "#fff",
            backdropFilter: "blur(18px)",
          },
        }}
      />
    </div>
  );
}

export default App;
