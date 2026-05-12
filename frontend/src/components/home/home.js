import './home.css';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';


function Home() {
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        let storedUserId = localStorage.getItem('userId');

        if(!storedUserId){
            storedUserId = nanoid(20);
            localStorage.setItem('userId', storedUserId);
            console.log('Generated new user ID:', storedUserId);
        } else{
            console.log('Existing user ID found:', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    function shortenUrl(){
        let urlToShorten = url;

        if(!userId) {
            alert('User ID not found. Please refresh the page and try again.');
            return;
        }

        if(!urlToShorten || urlToShorten.trim() === '') {
            alert('Please enter a valid URL');
            return;
        }
        
        if (!/^https?:\/\//i.test(urlToShorten)) {
            urlToShorten = 'http://' + urlToShorten;
        }

        fetch('http://localhost:3001/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: urlToShorten, userId }),
        })
        .then(response => response.json())
        .then(data => {
            setShortenedUrl(`http://localhost:3001/${data.shortCode}`);
        })
        .catch(error => {
            console.error('Error shortening URL:', error);
        });
    }

    return (
        <div className='home-app'>
        <div className="home-container">
            <h1 className='home-header'>Welcome to Smallr</h1>
            <p className='home-subheader'>The Easy Way to Shorten Your Links</p>
            <input type="text" placeholder="Enter your URL here" className="url-input" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="shorten-button" onClick={shortenUrl}>Shorten URL</button>
            {shortenedUrl && (
                <div className="shortened-url">
                    <p>Your New URL</p>
                    <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className='actual-url'>{shortenedUrl}</a>
                </div>
            )}
            </div>
        </div>
    );
}


export default Home;