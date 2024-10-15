import moment from 'moment';
import 'moment/locale/fr';
import Main from './components/Main';
// import logo from './logo.svg';
// import './App.css';


moment.locale('fr');

function App() {
  return (
    <div className="App">
        <Main />
    </div>
  );
}

export default App;
