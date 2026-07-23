# syntax=docker/dockerfile:1
# Stage 1: Build JAR using Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy settings.xml for proper Maven configuration
COPY settings.xml /root/.m2/settings.xml

# Copy only pom.xml first — cached Maven deps layer re-used when pom.xml unchanged
COPY pom.xml .

# Download dependencies with better error handling
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -s /root/.m2/settings.xml dependency:resolve -B \
    -Dorg.slf4j.simpleLogger.defaultLogLevel=warn

# Now copy the source code and build (this layer re-runs only when src changes)
COPY src ./src

RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -s /root/.m2/settings.xml clean package -DskipTests -B \
    -Dorg.slf4j.simpleLogger.defaultLogLevel=warn

# Stage 2: Runtime environment using JDK 21 JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
