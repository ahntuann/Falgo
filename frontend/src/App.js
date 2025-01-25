import AuthProvider from './context/AuthProvider.js';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <header className="App-header">
                    <div>Falgo</div>
                </header>
            </div>
        </AuthProvider>
    );
}

export default App;
