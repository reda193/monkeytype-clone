import logo from './assets/images/logo.svg'
import './App.css';
import TypingScreen from './screens/TypingScreen';
import Header from './screens/Header';
import Navigation from './screens/Navigation';

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Navigation />
      <TypingScreen />
    </div>
  );
};

export default App;
