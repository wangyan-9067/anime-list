import React from 'react';
import Grid from '@mui/material/Grid';
import logo from './logo.svg';
import './App.css';
import { AnimeList } from './AnimeList';
import { Details } from './Details';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div className="App">
      <h1>Anime List</h1>
      <Grid container spacing={2}>
        <Grid item xs={3}><AnimeList /></Grid>
        <Grid item xs={9}><Details /></Grid>
      </Grid>
      <Toaster position="bottom-left" reverseOrder={false} />
    </div>
  );
}

export default App;
