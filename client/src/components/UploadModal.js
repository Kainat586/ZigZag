// src/components/UploadModal.js
import React, { useState } from 'react';
import axios from 'axios';
import './UploadModal.css';

const UploadModal = ({ onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [audio, setAudio] = useState(null);
    const [poster, setPoster] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !artist || !audio || !poster) return alert("All fields required");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio', audio);
        formData.append('image', poster);

        try {
            await axios.post('http://localhost:5000/api/songs/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            alert("Song uploaded successfully!");
            setTitle('');
            setArtist('');
            setAudio(null);
            setPoster(null);
            if (onUploadSuccess) onUploadSuccess(); // refresh song list
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
            <input type="text" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist" required />
            <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} required />
            <input type="file" accept="image/*" onChange={e => setPoster(e.target.files[0])} required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default UploadModal;
