# SimDikta Backend

Spring Boot application with GraphQL API, JWT authentication, and PostgreSQL database.

## Prerequisites

- Java 21
- PostgreSQL database
- Redis (for caching)

## Running the Application

### Using Gradle Wrapper (Recommended)

```bash
# Run the application
./gradlew bootRun

# Build the JAR file
./gradlew build

# Run tests
./gradlew test

# Clean build directory
./gradlew clean
```

### Using Java JAR

```bash
# Build JAR first
./gradlew bootJar

# Run the JAR
java -jar app/build/libs/simdikta-backend.jar
```

## Configuration

The application requires the following environment variables or application properties:

- Database connection (PostgreSQL)
- Redis connection
- JWT secret key
- Kafka configuration (if using)

## Default Endpoints

- Application: `http://localhost:8080`
- GraphQL: `http://localhost:8080/graphql`
- GraphQL Playground: `http://localhost:8080/graphiql` (if enabled)
- Health Check: `http://localhost:8080/actuator/health`

## Development

### Hot Reload

For development with automatic restart on file changes:

```bash
./gradlew bootRun --continuous
```

### Running Tests

```bash
# Run all tests
./gradlew test

# Run tests with coverage
./gradlew test jacocoTestReport
```