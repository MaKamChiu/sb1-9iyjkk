import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { CreateSurvey } from './components/survey/CreateSurvey';
import { SurveyList } from './components/survey/SurveyList';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SurveyList />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;