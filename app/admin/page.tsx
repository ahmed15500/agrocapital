"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [json, setJson] = useState("");
  const [message, setMessage] = useState("");

  async function loadContent() {
    const response = await fetch("/api/admin/content");
    if (response.ok) {
      setLoggedIn(true);
      setJson(JSON.stringify(await response.json(), null, 2));
    }
  }

  useEffect(() => { loadContent(); }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) await loadContent();
    else setMessage("Invalid credentials.");
  }

  async function save() {
    setMessage("");
    try {
      const parsed = JSON.parse(json);
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed)
      });
      setMessage(response.ok ? "Saved." : "Could not save. Check authentication and JSON shape.");
    } catch {
      setMessage("Invalid JSON.");
    }
  }

  return (
    <main className="admin">
      <div className="admin-panel">
        <h1>AgroCapital CMS</h1>
        {!loggedIn ? (
          <form className="form" onSubmit={login}>
            <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button className="btn primary" type="submit">Sign in</button>
          </form>
        ) : (
          <>
            <p className="lead">Edit homepage, contact data, products, posts, downloads, image paths, and technical sheet links. Product and contact details should be copied only from official AgroCapital files.</p>
            <textarea value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
            <div className="cta-row" style={{ marginTop: 18 }}>
              <button className="btn primary" onClick={save}>Save content</button>
              <a className="btn secondary" href="/en" target="_blank">View English site</a>
              <a className="btn secondary" href="/ar" target="_blank">View Arabic site</a>
            </div>
          </>
        )}
        {message && <p>{message}</p>}
      </div>
    </main>
  );
}
