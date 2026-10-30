'use client';
export default function ErrorPage({reset}){return <main id="main-content" className="content-page"><h1>We couldn’t open this page.</h1><p>The store may be temporarily unavailable. Please try again shortly.</p><button className="primary" onClick={reset}>Try again</button><p><a href="/">Return to the homepage</a></p></main>;}
