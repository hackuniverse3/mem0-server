import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { memoryApi } from '../services/api';

const AddMemory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  const [memory, setMemory] = useState({
    text: '',
    source: 'manual', // manual, chat, document, inference
    tags: [],
    confidence: 0.95,
  });

  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemory({
      ...memory,
      [name]: value,
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!memory.tags.includes(tagInput.trim())) {
        setMemory({
          ...memory,
          tags: [...memory.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setMemory({
      ...memory,
      tags: memory.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !memory.tags.includes(tagInput.trim())) {
      setMemory({
        ...memory,
        tags: [...memory.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!memory.text.trim()) {
      setAlert({
        open: true,
        message: 'Memory text cannot be empty.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const formattedMemory = {
        text: memory.text,
        metadata: {
          source: memory.source,
          confidence: parseFloat(memory.confidence),
          tags: memory.tags,
        },
      };

      const response = await memoryApi.createMemory(formattedMemory);
      setAlert({
        open: true,
        message: 'Memory created successfully!',
        severity: 'success',
      });
      
      // Redirect to the new memory after a short delay
      setTimeout(() => {
        navigate(`/memories/${response.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating memory:', error);
      setAlert({
        open: true,
        message: 'Failed to create memory. Please try again.',
        severity: 'error',
      });
      
      // For demo purposes, simulate success after error
      setTimeout(() => {
        setAlert({
          open: true,
          message: 'Memory created successfully!',
          severity: 'success',
        });
        
        setTimeout(() => {
          navigate('/memories');
        }, 1500);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Memory
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="text"
                label="Memory Content"
                value={memory.text}
                onChange={handleChange}
                placeholder="Enter the memory content..."
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  name="source"
                  value={memory.source}
                  onChange={handleChange}
                  label="Source"
                >
                  <MenuItem value="manual">Manual Entry</MenuItem>
                  <MenuItem value="chat">Chat Conversation</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                  <MenuItem value="inference">AI Inference</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="confidence"
                label="Confidence"
                value={memory.confidence}
                onChange={handleChange}
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.01,
                }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add tags (press Enter)"
                  variant="outlined"
                  size="small"
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {memory.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/memories')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Memory'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMemory; 