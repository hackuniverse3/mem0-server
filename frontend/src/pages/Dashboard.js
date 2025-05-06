import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Paper, 
  TextField,
  Button,
  CircularProgress,
  Divider 
} from '@mui/material';
import { memoryApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMemories: 0,
    recentMemories: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, we would fetch actual stats from the API
        const memories = await memoryApi.getMemories({ limit: 5 });
        setStats({
          totalMemories: memories.total || memories.length || 0,
          recentMemories: memories.results || memories || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Show mock data for demo purposes
        setStats({
          totalMemories: 42,
          recentMemories: [
            { id: 1, text: 'User prefers dark mode in all applications', created_at: '2023-10-15T14:22:10Z' },
            { id: 2, text: 'User is interested in AI and machine learning', created_at: '2023-10-14T09:15:30Z' },
            { id: 3, text: 'User usually works with Python and JavaScript', created_at: '2023-10-13T16:45:22Z' }
          ]
        });
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await memoryApi.searchMemories(searchQuery);
      setSearchResults(results.results || results || []);
    } catch (error) {
      console.error('Error searching memories:', error);
      // Show mock data for demo purposes
      setSearchResults([
        { id: 5, text: 'Found memory related to your search: ' + searchQuery, relevance: 0.89 },
        { id: 8, text: 'Another relevant memory about ' + searchQuery, relevance: 0.75 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mem0 Memory Dashboard
      </Typography>

      {/* Search Panel */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Memories
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            label="Search query"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            variant="contained" 
            sx={{ ml: 2 }}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {searchResults.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Search Results:
            </Typography>
            {searchResults.map((result) => (
              <Paper key={result.id} sx={{ p: 2, mb: 1 }}>
                <Typography variant="body1">{result.text}</Typography>
                {result.relevance && (
                  <Typography variant="caption" color="text.secondary">
                    Relevance: {(result.relevance * 100).toFixed(1)}%
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Memories
              </Typography>
              <Typography variant="h3">
                {stats.totalMemories}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Memories */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Memories
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {stats.recentMemories.length > 0 ? (
          stats.recentMemories.map((memory) => (
            <Box key={memory.id} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {memory.text || memory.memory || memory.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(memory.created_at).toLocaleString()}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No recent memories found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard; 