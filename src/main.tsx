
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Добавляем стиль для фона
document.body.style.backgroundImage = "url('/lovable-uploads/f032ca5c-3682-4aee-98a6-37d3e169f2df.png')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.height = "100vh";

createRoot(document.getElementById("root")!).render(<App />);
