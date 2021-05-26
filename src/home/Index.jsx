import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Stow Database</h1>
            <p>Landing page text. Could have instructions on how to pair software to device</p>
            <p><Link to="slides">&gt;&gt; Manage Slides</Link></p>
        </div>
    );
}

export { Home };