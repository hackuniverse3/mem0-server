import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { memoryApi } from '../services/api';

const MemoryList = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMemories();
  }, [page, rowsPerPage]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await memoryApi.getMemories({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
      });
      
      // Handle API response structure
      if (response && response.results) {
        setMemories(response.results);
        setTotalCount(response.total || 0);
      } else {
        // Fallback if API response structure is different
        setMemories(response || []);
        setTotalCount(response?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      // Show mock data for demo purposes
      const mockData = [
        { id: 1, text: 'User prefers dark mode in all applications', created_at: '2023-10-15T14:22:10Z', metadata: { source: 'chat', confidence: 0.92 } },
        { id: 2, text: 'User is interested in AI and machine learning', created_at: '2023-10-14T09:15:30Z', metadata: { source: 'document', confidence: 0.87 } },
        { id: 3, text: 'User usually works with Python and JavaScript', created_at: '2023-10-13T16:45:22Z', metadata: { source: 'inference', confidence: 0.79 } },
        { id: 4, text: 'User likes to take breaks every 45 minutes', created_at: '2023-10-12T11:20:15Z', metadata: { source: 'chat', confidence: 0.95 } },
        { id: 5, text: 'User prefers technical documentation with examples', created_at: '2023-10-11T08:30:45Z', metadata: { source: 'document', confidence: 0.91 } },
      ];
      setMemories(mockData);
      setTotalCount(mockData.length);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    fetchMemories();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await memoryApi.deleteMemory(id);
        fetchMemories();
      } catch (error) {
        console.error('Error deleting memory:', error);
        alert('Failed to delete memory. Please try again.');
      }
    }
  };

  const getSourceColor = (source) => {
    switch (source?.toLowerCase()) {
      case 'chat':
        return 'primary';
      case 'document':
        return 'secondary';
      case 'inference':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Memory List</Typography>
        <TextField
          placeholder="Search memories"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Memory</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : memories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No memories found
                  </TableCell>
                </TableRow>
              ) : (
                memories.map((memory) => (
                  <TableRow key={memory.id}>
                    <TableCell>{memory.id}</TableCell>
                    <TableCell>
                      {(memory.text || memory.memory || memory.content || '').substring(0, 100)}
                      {(memory.text || memory.memory || memory.content || '').length > 100 ? '...' : ''}
                    </TableCell>
                    <TableCell>
                      {memory.metadata?.source && (
                        <Chip
                          label={memory.metadata.source}
                          color={getSourceColor(memory.metadata.source)}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(memory.created_at)}</TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/memories/${memory.id}`}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(memory.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default MemoryList; 