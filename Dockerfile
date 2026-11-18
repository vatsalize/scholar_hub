# Stage 1: Build the backend using Maven & Java 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven aggregator POM and backend source code
COPY pom.xml .
COPY backend ./backend

# Build the Spring Boot executable JAR (skip unit tests for fast deployment)
RUN mvn clean package -pl backend -DskipTests

# Stage 2: Minimal Java 21 runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated JAR artifact
COPY --from=build /app/backend/target/*.jar app.jar

# Render assigns a dynamic PORT environment variable (typically 10000)
ENV PORT=8080
EXPOSE ${PORT}

# Run the Spring Boot application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
