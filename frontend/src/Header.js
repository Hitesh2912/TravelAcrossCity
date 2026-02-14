// Header.js
import logo from './car.svg';
import './App.css';

function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <img src={logo} className="App-logo" alt="PlanMyJourney logo" />
        <h1 className="header-title">PlanMyJourney</h1>
      </div>

      <p className="header-slogan">
        Embark on your next adventure with ease! 🌍✈️🚗
      </p>
    </div>
  );
}

export default Header;
