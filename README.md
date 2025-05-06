# Mem0 REST API Server with Docker Compose

This project sets up a local Mem0 REST API server using Docker Compose on Windows, along with a React frontend interface to interact with memories. It includes Neo4j for semantic memory/relationships and ChromaDB as a vector database.

## System Requirements

- Windows 10+
- Docker Desktop for Windows (latest version)
- 8GB RAM minimum (16GB recommended)
- 10GB free disk space

## Architecture

The Docker Compose setup includes the following services:

1. **Neo4j** - Graph database for semantic memory and relationships
2. **ChromaDB** - Vector database for efficient similarity search
3. **Mem0 Server** - REST API server for memory management
4. **React Frontend** - User interface to view, search, and manage memories

## Quick Start

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd mem0-server
   ```

2. Start the Docker Compose services:
   ```bash
   docker-compose up -d
   ```

3. Wait for all services to initialize (this may take a few minutes on first run)

4. Access the applications:
   - React Frontend: http://localhost:3000
   - Neo4j Browser: http://localhost:7474 (credentials: neo4j/password)
   - Mem0 API: http://localhost:8080
   - ChromaDB API: http://localhost:8000

### Testing the API

To test that the Mem0 API is working correctly, you can use curl:

```bash
# Test retrieving memories
curl http://localhost:8080/memories

# Create a new memory
curl -X POST http://localhost:8080/memory \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test memory", "metadata": {"source": "manual", "confidence": 0.95}}'
```

## React Frontend Features

The React frontend provides an intuitive interface to:

1. **View Memories** - Browse and search through stored memories
2. **Add Memories** - Create new memories with text, metadata, and tags
3. **Visualize Relationships** - See how memories relate to each other
4. **Search Content** - Perform semantic searches across memories

## Development

### Frontend Development

To make changes to the React frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Make your changes - the app will automatically reload

### Customizing Docker Setup

To modify the Docker Compose configuration:

1. Edit `docker-compose.yml` to change service settings
2. Update environment variables to match your needs
3. Rebuild the services:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## Troubleshooting

### Common Issues

1. **Mem0 API not starting**
   - Check that Neo4j and ChromaDB are running
   - Inspect logs: `docker-compose logs mem0-server`

2. **Neo4j connection errors**
   - Verify Neo4j credentials in the `docker-compose.yml`
   - Check Neo4j logs: `docker-compose logs neo4j`

3. **Frontend cannot connect to API**
   - Ensure the Mem0 API is running
   - Check for CORS issues in the browser console

### Resetting Data

To completely reset all data:

```bash
docker-compose down -v
docker-compose up -d
```

## Future Enhancements

- Add authentication and user management
- Implement webhooks for external integrations
- Expand visualization options for memory relationships
- Add n8n workflow integration examples

## License

[MIT License](LICENSE) 