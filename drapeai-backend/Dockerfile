# syntax=docker/dockerfile:1
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY settings.xml /root/.m2/settings.xml
COPY pom.xml .

RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -s /root/.m2/settings.xml dependency:resolve -B \
    -Dorg.slf4j.simpleLogger.defaultLogLevel=warn \
    -Dmaven.wagon.httpconnectionManager.ttlSecs=60 \
    -Dmaven.wagon.http.retryHandler.count=10 \
    -Dmaven.wagon.http.retryHandler.requestSentEnabled=true \
    -Dmaven.wagon.http.pool=false

COPY src ./src

RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -s /root/.m2/settings.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
