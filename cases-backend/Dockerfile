# Step 1: Build the app
FROM eclipse-temurin:21-jdk as build
WORKDIR /app
COPY . .

# Give executable permission to mvnw
RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# Step 2: Run the app
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/cases-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
