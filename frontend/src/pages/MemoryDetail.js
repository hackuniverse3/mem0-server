import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  DeleteForever as DeleteIcon,
} from '@mui/icons-material';
import { memoryApi } from '../services/api';

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState({
    text: '',
  });

  useEffect(() => {
    fetchMemory();
  }, [id]);

  const fetchMemory = async () => {
    setLoading(true);
    try {
      const response = await memoryApi.getMemory(id);
      setMemory(response);
      setEditedMemory({
        text: response.text || response.memory || response.content || '',
      });
    } catch (error) {
      console.error(`Error fetching memory with ID ${id}:`, error);
      setError('Failed to load memory details. Please try again.');
      // For demo purposes, create a mock memory
      const mockMemory = {
        id: parseInt(id),
        text: 'This is a sample memory for demonstration purposes.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          source: 'demo',
          confidence: 0.95,
          relationships: [
            { id: 101, type: 'related_to', target_id: 202, label: 'Similar Topic' },
            { id: 102, type: 'derived_from', target_id: 303, label: 'Source Document' },
          ],
          tags: ['important', 'user_preference', 'demo'],
        },
      };
      setMemory(mockMemory);
      setEditedMemory({
        text: mockMemory.text,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedMemory({
      text: memory.text || memory.memory || memory.content || '',
    });
  };

  const handleSave = async () => {
    try {
      const updatedMemory = await memoryApi.updateMemory(id, {
        ...memory,
        text: editedMemory.text,
      });
      setMemory(updatedMemory);
      setEditing(false);
    } catch (error) {
      console.error(`Error updating memory with ID ${id}:`, error);
      alert('Failed to update memory. Please try again.');
      // For demo purposes, update the local memory
      setMemory({
        ...memory,
        text: editedMemory.text,
        updated_at: new Date().toISOString(),
      });
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      try {
        await memoryApi.deleteMemory(id);
        navigate('/memories');
      } catch (error) {
        console.error(`Error deleting memory with ID ${id}:`, error);
        alert('Failed to delete memory. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMemory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/memories')}>
          Back to Memories
        </Button>
      </Box>
    );
  }

  if (!memory) {
    return (
      <Box>
        <Typography variant="h6">Memory not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/memories')}>
          Back to Memories
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/memories')}>
          Back to Memories
        </Button>
        <Box>
          {editing ? (
            <>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Memory Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              ID: {memory.id}
            </Typography>

            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                name="text"
                label="Memory Content"
                value={editedMemory.text}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
            ) : (
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    {memory.text || memory.memory || memory.content}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Created: {formatDate(memory.created_at)}
            </Typography>
            {memory.updated_at && (
              <Typography variant="subtitle2">
                Last Updated: {formatDate(memory.updated_at)}
              </Typography>
            )}
          </Grid>

          {memory.metadata && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Metadata
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {memory.metadata.source && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Source:</Typography>
                    <Chip label={memory.metadata.source} color="primary" />
                  </Grid>
                )}

                {memory.metadata.confidence && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Confidence:</Typography>
                    <Typography>
                      {(memory.metadata.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                )}

                {memory.metadata.tags && memory.metadata.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Tags:</Typography>
                    <Box sx={{ mt: 1 }}>
                      {memory.metadata.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          {memory.metadata && memory.metadata.relationships && memory.metadata.relationships.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Relationships
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {memory.metadata.relationships.map((relation) => (
                <Box
                  key={relation.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    Type: {relation.type}
                  </Typography>
                  <Typography variant="body2">
                    Target ID: {relation.target_id}
                  </Typography>
                  {relation.label && (
                    <Typography variant="body2">
                      Label: {relation.label}
                    </Typography>
                  )}
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default MemoryDetail; 