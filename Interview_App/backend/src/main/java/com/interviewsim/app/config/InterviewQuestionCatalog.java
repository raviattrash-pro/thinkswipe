package com.interviewsim.app.config;

import com.interviewsim.app.model.Question;
import java.util.List;

public final class InterviewQuestionCatalog {

    private InterviewQuestionCatalog() {
    }

    public static List<Question> build() {
        return List.of(
                // --- MCQ EXAMPLES ---
                new Question(
                        "What is the default port for a Spring Boot application?",
                        "Spring Boot",
                        "Easy",
                        "8080",
                        "MCQ",
                        "8080, 80, 443, 3000",
                        "Amazon"
                ),
                new Question(
                        "Which annotation is used to enable auto-configuration in Spring Boot?",
                        "Spring Boot",
                        "Easy",
                        "@EnableAutoConfiguration",
                        "MCQ",
                        "@SpringBootApplication, @EnableAutoConfiguration, @Configuration, @Component",
                        "Google"
                ),
                new Question(
                        "Which interface must be implemented to create a thread by extending a class?",
                        "Java",
                        "Easy",
                        "None, you should extend Thread or implement Runnable",
                        "MCQ",
                        "Runnable, Serializable, Thread, Cloneable",
                        "Microsoft"
                ),

                // --- CODE OUTPUT EXAMPLES ---
                new Question(
                        "What is the output of this code snippet?\n\nint a = 10;\nint b = 20;\nSystem.out.println(a + b + \" Output\");",
                        "Java",
                        "Medium",
                        "30 Output",
                        "CODE",
                        "public class Solution {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 20;\n        System.out.println(a + b + \" Output\");\n    }\n}",
                        "Amazon"
                ),
                new Question(
                        "Predict the result:\n\nInteger x = 127;\nInteger y = 127;\nSystem.out.println(x == y);",
                        "Java",
                        "Medium",
                        "true (due to Integer caching)",
                        "CODE",
                        "public class Solution {\n    public static void main(String[] args) {\n        Integer x = 127;\n        Integer y = 127;\n        System.out.println(x == y);\n    }\n}",
                        "Meta"
                ),

                // --- BUG DETECTION EXAMPLES ---
                new Question(
                        "Identify the bug in this snippet:\n\npublic void print(String s) {\n    if (s == \"hello\") {\n        System.out.println(s);\n    }\n}",
                        "Java",
                        "Medium",
                        "String comparison should use .equals() instead of == for content equality.",
                        "BUG",
                        null
                ),
                new Question(
                        "What's wrong with this list operation?\n\nList<Integer> list = List.of(1, 2, 3);\nlist.remove(0);",
                        "Java",
                        "Medium",
                        "List.of() creates an immutable list; calling remove() throws UnsupportedOperationException.",
                        "BUG",
                        null
                ),
                new Question(
                        "Where is the bug?\n\ndouble d = 10 / 3;\nSystem.out.println(d);",
                        "Java",
                        "Medium",
                        "Integer division (10 / 3) results in 3; use 10.0 / 3 to get 3.333.",
                        "BUG",
                        null
                ),

                // --- MORE MCQ EXAMPLES ---
                new Question(
                        "Which interface in Java is used to allow a class to be used as a key in a TreeMap?",
                        "Java",
                        "Easy",
                        "Comparable",
                        "MCQ",
                        "Comparable, Serializable, Cloneable, Runnable"
                ),
                new Question(
                        "What is the output of 'System.out.println(10 + 20 + \"30\" + 40);'?",
                        "Java",
                        "Medium",
                        "303040",
                        "MCQ",
                        "100, 303040, 6040, Error"
                ),
                new Question(
                        "Which method of the String class can be used to check if a string matches a regex?",
                        "Java",
                        "Easy",
                        "matches()",
                        "MCQ",
                        "equals(), contains(), matches(), regionMatches()"
                ),

                // --- MORE CODE OUTPUT EXAMPLES ---
                new Question(
                        "What will be printed?\n\nString s1 = \"abc\";\nString s2 = \"abc\";\nSystem.out.println(s1 == s2);",
                        "Java",
                        "Easy",
                        "true",
                        "CODE",
                        null
                ),
                new Question(
                        "Determine the output:\n\ntry {\n    return 1;\n} finally {\n    return 2;\n}",
                        "Java",
                        "Hard",
                        "2",
                        "CODE",
                        null
                ),

                // --- ORIGINAL CONCEPT QUESTIONS ---
                new Question(
                        "What is Spring Boot and what are its main features?",
                        "Spring Boot",
                        "Easy",
                        "Spring Boot is an opinionated layer on top of Spring that helps us build production-ready applications faster. "
                                + "Its key features are auto-configuration, starter dependencies, embedded servers, externalized configuration, "
                                + "and actuator support for health, metrics, and monitoring."
                ),
                new Question(
                        "What is the difference between @Controller and @RestController?",
                        "Spring Boot",
                        "Easy",
                        "@Controller is mainly used for MVC applications that return view names, while @RestController is a convenience annotation "
                                + "that combines @Controller and @ResponseBody so the return value is written directly as JSON or XML."
                ),
                new Question(
                        "What is @Transactional and where do you use it?",
                        "Spring Boot",
                        "Medium",
                        "@Transactional defines a database transaction boundary. We usually place it on service-layer methods that perform multiple "
                                + "write operations so either all changes commit together or everything rolls back on failure, preserving consistency."
                ),
                new Question(
                        "Explain singleton scope and prototype scope in Spring.",
                        "Spring Boot",
                        "Easy",
                        "A singleton bean has one shared instance per Spring container and is the default scope. A prototype bean creates a new instance "
                                + "every time it is requested, which is useful for stateful or short-lived objects."
                ),
                new Question(
                        "What is the difference between PUT and PATCH in REST APIs?",
                        "Spring Boot",
                        "Medium",
                        "PUT generally replaces the full resource representation and is idempotent. PATCH applies partial updates to selected fields. "
                                + "In implementation, PUT handlers validate the complete payload while PATCH handlers merge only the provided fields."
                ),
                new Question(
                        "How do you secure REST API endpoints in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "I secure endpoints using Spring Security with authentication and authorization rules. Common steps include JWT or OAuth2 based "
                                + "authentication, role-based access checks, HTTPS, input validation, CSRF considerations for browser flows, and centralized exception handling."
                ),
                new Question(
                        "What is the difference between authentication and authorization?",
                        "Spring Boot",
                        "Easy",
                        "Authentication answers who the user is by verifying identity, while authorization answers what the authenticated user is allowed to do. "
                                + "A user may be successfully authenticated but still be denied access to a resource because of missing roles or permissions."
                ),
                new Question(
                        "How do you handle exceptions in a Spring Boot REST API?",
                        "Spring Boot",
                        "Medium",
                        "I use @ControllerAdvice with @ExceptionHandler methods to convert exceptions into consistent HTTP responses. "
                                + "That keeps controllers clean, standardizes error payloads, and lets us map validation, business, and system exceptions clearly."
                ),
                new Question(
                        "What is JPA and how is it different from Hibernate?",
                        "Spring Boot",
                        "Easy",
                        "JPA is a Java specification for ORM, while Hibernate is a popular implementation of that specification. "
                                + "We code mostly against JPA annotations and APIs for portability, and Hibernate provides the actual runtime behavior."
                ),
                new Question(
                        "Explain one-to-one mapping and one-to-many mapping in JPA.",
                        "Spring Boot",
                        "Medium",
                        "A one-to-one mapping connects one entity record to exactly one related record, such as User to Profile. "
                                + "A one-to-many mapping connects one parent to multiple children, such as Order to OrderItems, usually backed by a foreign key in the child table."
                ),
                new Question(
                        "What is lazy loading and eager loading in JPA?",
                        "Spring Boot",
                        "Medium",
                        "Lazy loading fetches related data only when it is accessed, which helps performance and reduces unnecessary joins. "
                                + "Eager loading fetches the relation immediately with the parent entity, which is simpler but can cause over-fetching and N+1 style issues if misused."
                ),
                new Question(
                        "How do you improve the health and observability of a Spring Boot application?",
                        "Spring Boot",
                        "Medium",
                        "I enable actuator endpoints for health, metrics, info, and readiness or liveness checks. "
                                + "I also add structured logging, tracing, alerting, proper exception metrics, and dashboards so the service can be monitored in production."
                ),
                new Question(
                        "What are Java 8 functional interfaces and what happens if @FunctionalInterface has two abstract methods?",
                        "Java 8",
                        "Easy",
                        "A functional interface has exactly one abstract method and can be used with lambdas or method references. "
                                + "If we annotate an interface with @FunctionalInterface and add two abstract methods, compilation fails because the contract is violated."
                ),
                new Question(
                        "Why were default methods introduced in Java 8?",
                        "Java 8",
                        "Medium",
                        "Default methods were introduced to evolve interfaces without breaking existing implementations. "
                                + "They let library authors add behavior to interfaces while keeping backward compatibility for older classes."
                ),
                new Question(
                        "What is the difference between map and flatMap in Java streams?",
                        "Java Streams",
                        "Medium",
                        "map transforms each element into another element, so one input becomes one output value. "
                                + "flatMap is used when each input produces a stream or collection and we want to flatten all nested results into one continuous stream."
                ),
                new Question(
                        "What is the difference between stream and parallelStream?",
                        "Java Streams",
                        "Medium",
                        "stream processes elements sequentially in one thread, while parallelStream splits work across multiple threads from the common ForkJoinPool. "
                                + "Parallel streams can improve CPU-bound workloads on large data sets, but they add overhead and must be avoided for blocking or order-sensitive operations."
                ),
                new Question(
                        "What are parallel streams and what are their pitfalls in web applications?",
                        "Java Streams",
                        "Medium",
                        "Parallel streams run stream operations concurrently using the common thread pool. "
                                + "Their pitfalls include thread contention, unpredictable performance for small tasks, difficulty with debugging, and problems when the pipeline performs blocking I/O or depends on thread-local context."
                ),
                new Question(
                        "Write a Java 8 approach to find the first repeating character in the string google.",
                        "Coding",
                        "Medium",
                        "Use a LinkedHashMap to preserve order while counting characters. "
                                + "Stream over the characters of google, group by character with LinkedHashMap and counting, then return the first entry whose count is greater than one, which is g."
                ),
                new Question(
                        "How would you print the frequency of each character in the string Abhishek Singh using Java 8?",
                        "Coding",
                        "Medium",
                        "Convert the string to lowercase, filter out spaces if needed, then use chars(), mapToObj, and Collectors.groupingBy with LinkedHashMap and counting. "
                                + "That gives a predictable ordered frequency map for each character."
                ),
                new Question(
                        "How would you count occurrences of words in an array like apple, apple, banana, kiwi using Java 8?",
                        "Coding",
                        "Easy",
                        "Create a stream from the array and use Collectors.groupingBy(Function.identity(), Collectors.counting()). "
                                + "The result is a map such as apple=2, banana=1, kiwi=1."
                ),
                new Question(
                        "Write Java code using the Runnable interface and explain when it is used.",
                        "Java",
                        "Easy",
                        "Runnable represents a task that can run on a thread and has a single run method. "
                                + "We use it to define concurrent work separately from thread management, and then submit it to a Thread or ExecutorService for execution."
                ),
                new Question(
                        "What is the executor framework and why do we use it?",
                        "Java",
                        "Medium",
                        "The executor framework provides thread pools and task execution abstractions such as ExecutorService and ScheduledExecutorService. "
                                + "We use it to reuse threads, control concurrency, manage queues, schedule tasks, and avoid creating threads manually for every request."
                ),
                new Question(
                        "Difference between checked and unchecked exceptions?",
                        "Java",
                        "Easy",
                        "Checked exceptions are verified at compile time and must be handled or declared, for example IOException. "
                                + "Unchecked exceptions extend RuntimeException, are not forced by the compiler, and usually represent programming errors such as NullPointerException or IllegalArgumentException."
                ),
                new Question(
                        "Difference between String, StringBuilder, and StringBuffer?",
                        "Java",
                        "Easy",
                        "String is immutable, so every modification creates a new object. StringBuilder is mutable and faster for single-threaded string changes. "
                                + "StringBuffer is also mutable but synchronized, so it is safer for concurrent access and usually slower than StringBuilder."
                ),
                new Question(
                        "Difference between HashMap, TreeMap, and LinkedHashMap?",
                        "Java",
                        "Easy",
                        "HashMap stores entries with no ordering guarantee and usually gives O(1) average lookup. LinkedHashMap preserves insertion or access order. "
                                + "TreeMap keeps keys sorted using natural order or a comparator and gives O(log n) operations."
                ),
                new Question(
                        "Difference between List and ArrayList?",
                        "Java",
                        "Easy",
                        "List is an interface that defines list behavior, while ArrayList is one concrete implementation backed by a dynamic array. "
                                + "We usually code to the List interface and choose ArrayList when we need fast random access and append operations."
                ),
                new Question(
                        "What is a static method and what is the difference between static and final?",
                        "Java",
                        "Easy",
                        "A static method belongs to the class rather than an instance, so it can be called without creating an object. "
                                + "static is about class-level ownership, while final is about preventing change: final variables cannot be reassigned, final methods cannot be overridden, and final classes cannot be extended."
                ),
                new Question(
                        "What is a sealed class and why is it useful?",
                        "Java",
                        "Medium",
                        "A sealed class restricts which classes or interfaces can extend or implement it. "
                                + "It is useful when we want controlled inheritance, stronger domain modeling, and better exhaustiveness handling in pattern matching or business hierarchies."
                ),
                new Question(
                        "What is API Gateway and what features does it provide?",
                        "Microservices",
                        "Medium",
                        "An API Gateway is the single entry point for clients in a microservices architecture. "
                                + "It can handle routing, authentication, rate limiting, request aggregation, SSL termination, observability, caching, and protection of internal service topology."
                ),
                new Question(
                        "How do microservices communicate with each other?",
                        "Microservices",
                        "Easy",
                        "Microservices usually communicate either synchronously through REST or gRPC, or asynchronously through brokers such as Kafka, RabbitMQ, or SQS. "
                                + "The choice depends on whether the use case needs immediate response, loose coupling, retry support, or event-driven processing."
                ),
                new Question(
                        "How can concurrency be achieved in microservices?",
                        "Microservices",
                        "Medium",
                        "Concurrency can be achieved by running multiple service instances behind a load balancer, using async processing and message queues, "
                                + "offloading parallel tasks to executors, and designing stateless services so requests can be processed independently."
                ),
                new Question(
                        "Difference between synchronous and asynchronous communication in microservices?",
                        "Microservices",
                        "Easy",
                        "Synchronous communication waits for an immediate response and is simpler for request-reply flows, but it increases coupling and latency sensitivity. "
                                + "Asynchronous communication uses events or messages, reduces direct dependency, improves resilience, and is better for decoupled workflows."
                ),
                new Question(
                        "What is service discovery and service registry?",
                        "Microservices",
                        "Medium",
                        "A service registry stores the network locations of running service instances, and service discovery is the mechanism clients use to find them dynamically. "
                                + "Tools like Eureka or Consul help avoid hard-coded endpoints and support scaling and failover."
                ),
                new Question(
                        "How do you handle traffic spikes in microservices?",
                        "Microservices",
                        "Medium",
                        "I scale services horizontally, put them behind a load balancer, use autoscaling rules, enable caching, rate limiting, and queue-based buffering. "
                                + "For hot paths, I also tune thread pools, database queries, and downstream timeouts to keep latency stable under load."
                ),
                new Question(
                        "How do you debug microservices and troubleshoot a failure spread across services?",
                        "Microservices",
                        "Hard",
                        "I start with logs, metrics, traces, and dashboards to identify the failing hop and the time window. "
                                + "Then I follow traceId and spanId across services, inspect recent deploys or config changes, reproduce the failure if possible, and verify downstream dependencies such as DB, cache, broker, and network."
                ),
                new Question(
                        "What is distributed tracing and what is the difference between traceId and spanId?",
                        "Microservices",
                        "Medium",
                        "Distributed tracing follows a request as it moves across multiple services. "
                                + "A traceId identifies the full end-to-end request, while a spanId identifies one individual operation within that trace, such as a database call or a downstream HTTP request."
                ),
                new Question(
                        "What is a circuit breaker and what are its states?",
                        "Microservices",
                        "Medium",
                        "A circuit breaker stops repeated calls to an unhealthy dependency so the caller does not keep wasting resources. "
                                + "Its states are closed for normal traffic, open when failures cross a threshold, and half-open when limited test calls are allowed to check recovery."
                ),
                new Question(
                        "If service A depends on service B and service B fails, what would you do?",
                        "Microservices",
                        "Hard",
                        "I would protect the call with timeouts, retries where safe, a circuit breaker, and a fallback or degraded response if the business case allows it. "
                                + "I would also surface clear alerts, use idempotent messaging if asynchronous retry is appropriate, and prevent the failure from cascading to the rest of the system."
                ),
                new Question(
                        "How do you handle database failure in microservices?",
                        "Microservices",
                        "Hard",
                        "I use connection pool tuning, timeouts, retries for transient failures, replication or failover, and application-level resilience patterns. "
                                + "On the design side, I isolate service databases, add graceful degradation where possible, and use backups, monitoring, and recovery runbooks for operational resilience."
                ),
                new Question(
                        "What is saga pattern and when is it used?",
                        "Microservices",
                        "Hard",
                        "Saga pattern manages distributed business transactions by splitting them into local transactions with compensating actions. "
                                + "It is used when each microservice owns its own database and we need eventual consistency instead of a single ACID transaction across services."
                ),
                new Question(
                        "What design patterns are commonly used in microservices?",
                        "Microservices",
                        "Medium",
                        "Common patterns include API Gateway, Circuit Breaker, Saga, Service Discovery, Bulkhead, Retry, CQRS, Event Sourcing in specific domains, "
                                + "Strangler for migration, and externalized configuration for environment management."
                ),
                new Question(
                        "What is Apache Kafka and why is it useful in microservices?",
                        "Kafka",
                        "Easy",
                        "Kafka is a distributed event streaming platform that stores messages durably in partitions and allows multiple consumers to read them independently. "
                                + "It is useful in microservices for asynchronous communication, loose coupling, replay, high throughput, and event-driven integration."
                ),
                new Question(
                        "How does Kafka support asynchronous communication?",
                        "Kafka",
                        "Medium",
                        "A producer publishes an event to a topic without waiting for the consumer to process it immediately. "
                                + "Kafka stores the event durably, and consumers pull messages using offsets at their own pace, which decouples producer and consumer availability."
                ),
                new Question(
                        "What are producer, consumer, topic, partition, and offset in Kafka?",
                        "Kafka",
                        "Easy",
                        "A producer publishes records, a consumer reads them, and a topic is the logical channel that holds events. "
                                + "Topics are split into partitions for scalability and ordering within a partition, while offset is the position of a record inside a partition."
                ),
                new Question(
                        "What is the difference between RabbitMQ style messaging and Kafka?",
                        "Kafka",
                        "Medium",
                        "RabbitMQ is a traditional message broker optimized for queue-based delivery and acknowledgments, while Kafka is an event streaming platform optimized for throughput, retention, replay, and partition-based scaling. "
                                + "Kafka consumers track offsets and can reread data, which is a major architectural difference."
                ),
                new Question(
                        "How do you reduce API response time?",
                        "System Design",
                        "Medium",
                        "I start by measuring latency and identifying the biggest bottleneck. Typical fixes include query optimization, pagination, caching, connection reuse, async processing, payload reduction, batching, indexing, and removing unnecessary synchronous calls."
                ),
                new Question(
                        "What is caching and how do Redis cache and Hibernate cache help?",
                        "System Design",
                        "Medium",
                        "Caching stores frequently used data closer to the application to reduce repeated expensive work. "
                                + "Redis is a fast external distributed cache suited for shared application data, while Hibernate caches can reduce repeated ORM lookups at the session or second-level cache layer."
                ),
                new Question(
                        "What are the types of indexes in databases and what is the difference between primary and unique index?",
                        "SQL",
                        "Medium",
                        "Common index types include primary, unique, composite, clustered, non-clustered, full-text, and hash depending on the database engine. "
                                + "A primary index usually enforces the table's main identifier and does not allow nulls, while a unique index enforces uniqueness but may allow null handling based on database rules."
                ),
                new Question(
                        "What is the difference between left outer join and inner join?",
                        "SQL",
                        "Easy",
                        "An inner join returns only rows that match in both tables. "
                                + "A left outer join returns all rows from the left table and the matching rows from the right table, filling unmatched right-side columns with nulls."
                ),
                new Question(
                        "Write the SQL idea to find duplicate marks in a student table.",
                        "SQL",
                        "Easy",
                        "Group the student records by marks and use HAVING COUNT(*) greater than one. "
                                + "The pattern is select marks, count(*) from student group by marks having count(*) > 1."
                ),
                new Question(
                        "How would you ingest a large volume of data into a Spring Boot application and save it efficiently?",
                        "System Design",
                        "Hard",
                        "I would avoid row-by-row inserts and instead use batching, chunk processing, streaming reads, async queues, and backpressure. "
                                + "For very large uploads, I would store files first, process them in the background, validate in chunks, and tune JDBC batch size, indexes, and transaction boundaries."
                ),
                new Question(
                        "Multiple users upload files to the same server at the same time. How do you handle conflicts and avoid crashes?",
                        "System Design",
                        "Hard",
                        "I would use unique file names or object keys, temporary upload locations, size limits, streaming instead of loading full files into memory, and a queue or async worker for heavy processing. "
                                + "I would also enforce concurrency-safe metadata updates, validation, retries, and resource throttling so one spike does not crash the node."
                ),
                new Question(
                        "What are best practices while designing REST API endpoints?",
                        "System Design",
                        "Medium",
                        "Use resource-oriented nouns, proper HTTP methods and status codes, versioning where needed, idempotency for safe retries, pagination, validation, standardized error responses, authentication, observability, and clear contracts that are backward compatible."
                ),
                new Question(
                        "How do you resolve a production issue and perform RCA?",
                        "System Design",
                        "Hard",
                        "I first stabilize the system by mitigation such as rollback, feature flag, scaling, or failover. "
                                + "Then I gather evidence from logs, metrics, traces, deployments, and config changes, identify the root cause, document impact and timeline, and create preventive action items with owners."
                ),
                new Question(
                        "How does JWT work?",
                        "Security",
                        "Medium",
                        "JWT is a signed token that contains claims such as user id, roles, and expiry. "
                                + "After authentication, the server issues the token, the client sends it with later requests, and the server validates the signature and claims before authorizing access."
                ),
                new Question(
                        "What is the difference between load balancer and API Gateway?",
                        "System Design",
                        "Medium",
                        "A load balancer mainly distributes network traffic across service instances for availability and scaling. "
                                + "An API Gateway works at the API layer and can also route requests, authenticate clients, transform payloads, aggregate responses, and apply rate limiting."
                ),
                new Question(
                        "Explain microservices architecture in simple terms.",
                        "Microservices",
                        "Easy",
                        "Microservices architecture breaks a large application into small independently deployable services aligned to business capabilities. "
                                + "Each service owns its logic and often its data, communicates through APIs or events, and can scale or release independently."
                ),
                new Question(
                        "What is React and why is it useful for front-end applications?",
                        "ReactJS",
                        "Easy",
                        "React is a JavaScript library for building component-based user interfaces. "
                                + "It is useful because it encourages reusable UI pieces, one-way data flow, predictable state updates, and efficient rendering with a virtual DOM."
                ),
                new Question(
                        "What is the difference between state and props in React?",
                        "ReactJS",
                        "Easy",
                        "Props are read-only inputs passed from a parent component to a child component. "
                                + "State is internal mutable data owned by a component that changes over time and triggers re-rendering when updated."
                ),
                new Question(
                        "What is useEffect and when do you use it in React?",
                        "ReactJS",
                        "Medium",
                        "useEffect is a hook used to run side effects after rendering, such as API calls, subscriptions, timers, or DOM synchronization. "
                                + "Its dependency array controls when the effect reruns and cleanup helps prevent leaks."
                ),
                new Question(
                        "How do you optimize React application performance?",
                        "ReactJS",
                        "Medium",
                        "I reduce unnecessary renders by keeping state local, splitting components properly, memoizing only where it truly helps, lazy loading heavy routes, virtualizing large lists, "
                                + "debouncing expensive input actions, and profiling with React DevTools to confirm the real bottleneck."
                ),
                new Question(
                        "What AWS services would you mention for a Java microservices interview and when would you use them?",
                        "AWS",
                        "Medium",
                        "IAM controls access, EC2 runs virtual machines, Lambda runs event-driven serverless code, S3 stores objects, CloudWatch handles logs and metrics, and RDS provides managed relational databases. "
                                + "For messaging and streaming I would mention SQS, SNS, Kinesis, and MSK; for containers ECS and EKS; for managed app deployment Elastic Beanstalk; and for caching ElastiCache."
                ),
                new Question(
                        "What is the AWS alternative to running Kafka yourself?",
                        "AWS",
                        "Easy",
                        "Amazon MSK is the managed Kafka offering on AWS. "
                                + "If the use case is simpler event routing or queueing rather than Kafka compatibility, services like Kinesis, SQS, and SNS can also be considered depending on the pattern."
                ),
                new Question(
                        "How would you monitor microservices running on AWS?",
                        "AWS",
                        "Medium",
                        "I would use CloudWatch metrics, logs, dashboards, and alarms, add distributed tracing with X-Ray or OpenTelemetry, "
                                + "centralize application logs, monitor queue depth and database metrics, and define actionable alerts tied to latency, error rate, saturation, and business KPIs."
                ),
                new Question(
                        "How would you design a URL shortener at a high level?",
                        "LLD",
                        "Medium",
                        "At a high level I would expose an API to create short links, generate unique short codes, store the mapping in a fast data store, and redirect lookups quickly with caching. "
                                + "I would also discuss expiration, analytics, idempotency, collision handling, and rate limiting."
                ),
                new Question(
                        "What is @Primary and the difference between @Primary and @Qualifier?",
                        "Spring Boot",
                        "Medium",
                        "@Primary indicates that a bean should be given preference when multiple candidates are qualified to autowire a single-valued dependency. "
                                + "@Qualifier is used on the injection point to specify exactly which bean name should be used. "
                                + "Use @Primary for the default choice and @Qualifier for specific overrides."),
                new Question(
                        "We have two databases of the same type. How can we inject a particular bean of one database?",
                        "Spring Boot",
                        "Hard",
                        "I would define two separate DataSource beans and annotate one with @Primary. "
                                + "Then I use @Qualifier(\"beanName\") at the injection point to specify which dataSource, entityManagerFactory, "
                                + "or transactionManager should be used for that specific repository or service."),
                new Question(
                        "What is the result of a == b and a.equals(b) for Integer a=10, b=10? What about String s1=new String(\"hello\"), s2=new String(\"hello\")?",
                        "Java",
                        "Easy",
                        "For Integer a=10 and b=10, both a == b and a.equals(b) are true because of Integer caching (-128 to 127). "
                                + "For the Strings, s1 == s2 is false because they are different objects on the heap, but s1.equals(s2) is true because the content is identical."),
                new Question(
                        "Input: \"bbcaadeebadcbbce\". Output: \"d2a3c3e3b5\". Write the logic for this.",
                        "Coding",
                        "Hard",
                        "I would use a Map to count character frequencies, then build the output string by iterating over the unique characters. "
                                + "For \"bbcaadeebadcbbce\", the counts are d:2, a:3, c:3, e:3, b:5. "
                                + "A frequency map followed by a formatted string build achieves this."),
                new Question(
                        "Explain different AWS services: Kinesis, SQS, SNS, and ElastiCache.",
                        "AWS",
                        "Medium",
                        "Kinesis is for real-time data streaming at scale. SQS is a distributed message queueing service. "
                                + "SNS is a pub/sub messaging service. ElastiCache is a managed in-memory data store using Redis or Memcached to improve application performance."),
                new Question(
                        "How does auto-configuration work in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "It works through classpath scanning and conditional annotations like @ConditionalOnClass and @ConditionalOnMissingBean. "
                                + "Spring Boot checks for specific libraries on the classpath and automatically configures beans with sensible defaults if they are missing."),
                new Question(
                        "What is HATEOAS and how do you implement it in Spring Boot?",
                        "Spring Boot",
                        "Hard",
                        "HATEOAS stands for Hypermedia As The Engine Of Application State. It adds hypermedia links to REST responses to make the API self-documenting. "
                                + "In Spring Boot, we use the 'spring-boot-starter-hateoas' dependency and EntityModel to wrap data with links using linkTo and methodOn."),
                new Question(
                        "How do you version REST APIs in a Spring Boot application?",
                        "Spring Boot",
                        "Medium",
                        "API versioning can be done via URI path (e.g., /api/v1/users), request parameters (?version=1), custom headers (X-API-VERSION: 1), "
                                + "or content negotiation using the Accept header. URI versioning is the most common and explicit approach."),
                new Question(
                        "What is the monitoring stack commonly used with Spring Boot microservices?",
                        "Microservices",
                        "Medium",
                        "A common stack includes Spring Boot Actuator for metrics, Prometheus for metrics collection, Grafana for visualization, "
                                + "and Zipkin or Jaeger for distributed tracing. This provides full visibility into application health and performance."),
                new Question(
                        "Explain the JVM Memory Model. What are Heap, Stack, and Metaspace?",
                        "Java",
                        "Hard",
                        "Heap is the runtime data area where all class instances and arrays are allocated. "
                                + "Stack is per-thread and stores local variables and partial results. "
                                + "Metaspace (replacing PermGen) stores class metadata and grows automatically as needed."),
                new Question(
                        "How does HashMap work internally in Java 8?",
                        "Java",
                        "Hard",
                        "It uses an array of nodes (buckets). A hash of the key determines the bucket index. "
                                + "In Java 8, if a bucket exceeds a threshold (8), the linked list is converted to a Red-Black Tree for O(log n) lookup. "
                                + "It uses equals() and hashCode() to handle collisions."),
                new Question(
                        "Difference between CountDownLatch and CyclicBarrier?",
                        "Java",
                        "Medium",
                        "CountDownLatch is used to wait for one or more threads to complete a set of operations. It cannot be reset. "
                                + "CyclicBarrier allows a set of threads to all wait for each other to reach a common barrier point and can be reused after being reset."),
                new Question(
                        "What is the N+1 Query Problem in JPA and how to solve it?",
                        "JPA",
                        "Hard",
                        "It occurs when you load a parent entity and then JPA executes N additional queries to load associated children (when using lazy loading). "
                                + "Solution: Use 'JOIN FETCH' in JPQL, @EntityGraph, or Batch fetching to load associations in a single query."),
                new Question(
                        "What is the Saga Pattern in Microservices?",
                        "Microservices",
                        "Hard",
                        "Saga is a failure management pattern for distributed transactions. "
                                + "It breaks a transaction into a series of local transactions, each updating a single service's database. "
                                + "If a step fails, the Saga executes compensating transactions to undo the previous steps."),
                new Question(
                        "Explain the concept of CQRS (Command Query Responsibility Segregation).",
                        "Microservices",
                        "Hard",
                        "CQRS separates the data modification (Commands) from the data retrieval (Queries). "
                                + "This allows you to scale read and write operations independently and use different data models or even different databases for each."),
                new Question(
                        "What is the difference between Orchestration and Choreography in microservices?",
                        "Microservices",
                        "Medium",
                        "Orchestration uses a central controller (orchestrator) to tell each service what to do. "
                                + "Choreography has services follow a decentralized flow, reacting to events published by other services."),
                new Question(
                        "What is a Bounded Context in DDD?",
                        "Microservices",
                        "Medium",
                        "A Bounded Context specifies where a particular domain model applies. "
                                + "It defines the boundary around a system where a specific language and model are consistently used, preventing confusion with models in other contexts."),
                new Question(
                        "What are the 12 Principles of a 12-Factor App?",
                        "Architecture",
                        "Hard",
                        "1. Codebase 2. Dependencies 3. Config 4. Backing services 5. Build, release, run 6. Processes 7. Port binding 8. Concurrency 9. Disposability 10. Dev/prod parity 11. Logs 12. Admin processes."),
                new Question(
                        "Difference between Optimistic and Pessimistic Locking in JPA?",
                        "JPA",
                        "Medium",
                        "Optimistic locking (@Version) assumes accidents are rare and checks for conflicts at commit time. "
                                + "Pessimistic locking (LockModeType.PESSIMISTIC_WRITE) explicitly locks the database record to prevent others from accessing it until the transaction finishes."),
                new Question(
                        "How do you implement Distributed Tracing in Spring Boot?",
                        "Microservices",
                        "Medium",
                        "We use Micrometer Tracing (formerly Spring Cloud Sleuth) to add trace and span IDs to logs. "
                                + "These IDs are propagated across microservices, and we can export the traces to Zipkin or Jaeger for visualization."),
                new Question(
                        "What is polyglot persistence?",
                        "Database",
                        "Medium",
                        "It is the practice of using different data storage technologies (RDBMS, NoSQL, Graph, etc.) within the same system, "
                                + "choosing the best database type for each specific business requirement or microservice."),
                new Question(
                        "Explain Blue/Green Deployment strategy.",
                        "DevOps",
                        "Medium",
                        "An environment (Blue) runs the current production code while an identical environment (Green) runs the new version. "
                                + "Once Green is tested, traffic is switched from Blue to Green. This allows for zero-downtime and easy rollbacks."),
                new Question(
                        "What is Kafka Consumer Lag?",
                        "Kafka",
                        "Medium",
                        "It is the difference between the latest offset in a partition and the offset currently being processed by a consumer group. "
                                + "High lag indicates that consumers are falling behind and the processing speed needs to be increased."),
                new Question(
                        "Difference between @Controller and @RestController?",
                        "Spring Boot",
                        "Easy",
                        "@Controller is for traditional web apps with views (JSP/Thymeleaf). "
                                + "@RestController combines @Controller and @ResponseBody, meaning every method's return value is written directly to the response body (usually as JSON)."),
                new Question(
                        "What is a Functional Interface and what happens if we add two abstract methods?",
                        "Java",
                        "Easy",
                        "A Functional Interface has exactly one abstract method. "
                                + "If you add a second abstract method and annotate it with @FunctionalInterface, the compiler will throw an error."),
                new Question(
                        "Explain the difference between Map and FlatMap in Stream API.",
                        "Java",
                        "Medium",
                        "map() transforms each element of a stream into another element. "
                                + "flatMap() transforms each element into a stream of elements and then flattens those streams into a single result stream."),
                new Question(
                        "How do you handle Database failure in a Microservices architecture?",
                        "Microservices",
                        "Hard",
                        "Use Circuit Breakers to stop requests, Caching to serve stale data, Retries with backoff, "
                                + "and Dead Letter Queues for asynchronous messages that couldn't be processed due to DB downtime."),
                new Question(
                        "What is the use of the 'Optional' class in Java 8?",
                        "Java",
                        "Medium",
                        "Optional is a container object used to represent the presence or absence of a value. "
                                + "It helps avoid NullPointerException by providing methods like orElse(), ifPresent(), and map() to handle nulls more gracefully."),
                new Question(
                        "Explain the purpose of the 'transient' keyword in Java.",
                        "Java",
                        "Medium",
                        "The transient keyword indicates that a field should not be serialized when the object is converted into a byte stream. "
                                + "It is useful for sensitive data (passwords) or fields that can be recalculated."),
                new Question(
                        "What is use of @Transactional annotation?",
                        "Spring Boot",
                        "Medium",
                        "It defines the scope of a single database transaction. "
                                + "If any runtime exception occurs within the method, Spring will roll back the transaction to ensure data integrity."),
                new Question(
                        "Difference between OneToOne, OneToMany, and ManyToMany?",
                        "JPA",
                        "Medium",
                        "OneToOne: One entity relates to exactly one other. OneToMany: One parent has many children. "
                                + "ManyToMany: Many entities relate to many others, usually requiring a join table."),
                new Question(
                        "What is the role of Spring Boot Actuator?",
                        "Spring Boot",
                        "Medium",
                        "Actuator provides production-ready features like health checks, metrics, auditing, and environment info "
                                + "via HTTP endpoints or JMX, helping you monitor and manage your application."),
                new Question(
                        "Explain the 'Diamond Problem' and how Java 8 handles it with default methods.",
                        "Java",
                        "Medium",
                        "It occurs when a class implements two interfaces that have the same default method. "
                                + "Java 8 requires the developer to resolve the ambiguity manually by overriding the method in the implementation class."),
                new Question(
                        "What is the difference between Runnable and Callable?",
                        "Java",
                        "Medium",
                        "Runnable's run() method does not return a value and cannot throw checked exceptions. "
                                + "Callable's call() method can return a result and throw exceptions."),
                new Question(
                        "How do you secure REST API endpoints?",
                        "Spring Boot",
                        "Hard",
                        "Use Spring Security with OAuth2/JWT for stateless authentication, HTTPS for encryption, "
                                + "and Role-Based Access Control (RBAC) to restrict access to specific endpoints based on user authorities."),
                new Question(
                        "What is a Circuit Breaker Pattern?",
                        "Microservices",
                        "Hard",
                        "It prevents a service from repeatedly trying to execute an operation that is likely to fail, "
                                + "allowing it to 'trip' to an open state and execute a fallback method until the dependency is healthy again."),
                new Question(
                        "What is the difference between Service Discovery and API Gateway?",
                        "Microservices",
                        "Medium",
                        "Service Discovery (e.g., Eureka) is a registry that keeps track of where services are running. "
                                + "API Gateway (e.g., Spring Cloud Gateway) is a single entry point for clients that handles routing, security, and rate limiting."),
                new Question(
                        "How do you intake a large volume of dataset in Spring Boot?",
                        "Spring Boot",
                        "Hard",
                        "Use Batch processing (Spring Batch), Chunk-based processing, or Steaming (reactive streams) "
                                + "to process data in small parts instead of loading everything into memory at once."),
                new Question(
                        "What happens if multiple users upload files to the same server simultaneously?",
                        "System Design",
                        "Medium",
                        "The server must handle concurrent requests using multi-threading. "
                                + "If the server writes to local disk, filenames must be unique (e.g., UUID-prefixed) to avoid collisions, or a shared distributed storage like S3 should be used."),
                new Question(
                        "Write a Java 8 approach to find the first non-repeating character in a string.",
                        "Coding",
                        "Hard",
                        "I would use a LinkedHashMap to store character counts to maintain order, or use IntStream on the string chars. "
                                + "s.chars().mapToObj(i -> (char)i).collect(groupingBy(identity, LinkedHashMap::new, counting())).entrySet().stream().filter(e -> e.getValue() == 1L).findFirst().get().getKey();"),
                new Question(
                        "How to implement Caching in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "Annotate the main class with @EnableCaching and use @Cacheable on methods you want to cache. "
                                + "Spring will intersect the call and return the cached result if available. Common providers: Redis, Caffeine, or Hazelcast."),
                new Question(
                        "Explain the difference between Checked and Unchecked Exceptions.",
                        "Java",
                        "Easy",
                        "Checked exceptions must be handled at compile time (throws or try-catch). "
                                + "Unchecked exceptions (RuntimeExceptions) don't have this requirement and usually indicate programming errors or unexpected states."),
                new Question(
                        "What is the difference between Singleton and Prototype scope?",
                        "Spring Boot",
                        "Easy",
                        "Singleton (default) creates one instance of the bean for the entire application context. "
                                + "Prototype creates a new instance every time the bean is requested from the container."),
                new Question(
                        "Difference between PUT and PATCH methods?",
                        "Spring Boot",
                        "Easy",
                        "PUT is used to replace the entire resource with a new version. "
                                + "PATCH is used for partial updates, only modifying the specific fields provided in the request body."),
                new Question(
                        "Explain the concept of 'Eventual Consistency'.",
                        "System Design",
                        "Medium",
                        "It is a consistency model where data will eventually become consistent across all nodes if no new updates are made, "
                                + "often used in distributed systems where high availability is prioritized over strong consistency."),
                new Question(
                        "Is the @FunctionalInterface annotation mandatory?",
                        "Java",
                        "Easy",
                        "No, it is not mandatory. Any interface with exactly one abstract method is considered a functional interface by the compiler. "
                                + "However, using the annotation is a best practice because it triggers a compiler error if the rules are violated."),
                new Question(
                        "How can you sort a list of strings ignoring case using method references?",
                        "Java",
                        "Easy",
                        "I would use the sort() method on the list with a method reference: names.sort(String::compareToIgnoreCase);"),
                new Question(
                        "What are the pitfalls of using parallelStream() in a web application?",
                        "Java",
                        "Hard",
                        "Parallel streams use the common ForkJoinPool, which has a limited number of threads. "
                                + "Blocked operations in a parallel stream can starve the pool, affecting the performance of all other parallel streams in the application."),
                new Question(
                        "Difference between ArrayList and LinkedList?",
                        "Java",
                        "Easy",
                        "ArrayList uses a dynamic array, making it faster for index-based access (O(1)). "
                                + "LinkedList uses a doubly-linked list, making it faster for additions or removals (O(1) if at the ends) but slower for random access (O(n))."),
                new Question(
                        "How to make a class Immutable in Java?",
                        "Java",
                        "Medium",
                        "1. Declare the class as final. 2. Make all fields private and final. 3. Do not provide setter methods. "
                                + "4. Initialize all fields via a constructor. 5. Perform deep copies of mutable objects in getters and constructor."),
                new Question(
                        "What is the difference between Comparable and Comparator?",
                        "Java",
                        "Medium",
                        "Comparable provides the natural ordering of a class through the compareTo() method. "
                                + "Comparator allows for multiple, custom ordering strategies defined externally via the compare() method."),
                new Question(
                        "Explain 'try-with-resources' in Java.",
                        "Java",
                        "Easy",
                        "It is a feature that automatically closes resources (like files or database connections) at the end of the statement, "
                                + "provided the resource implements the AutoCloseable interface, reducing boilerplate code for final blocks."),
                new Question(
                        "What is String Interning?",
                        "Java",
                        "Medium",
                        "Interning is a method of storing only one copy of each distinct string value, which must be immutable. "
                                + "This is handled by the String Pool to save memory and improve performance of equality checks."),
                new Question(
                        "Difference between wait() and sleep()?",
                        "Java",
                        "Medium",
                        "wait() is defined in the Object class and releases the lock while waiting. "
                                + "sleep() is defined in the Thread class and does NOT release the lock during the specified sleep time."),
                new Question(
                        "What is a ReentrantLock and how does it differ from synchronized?",
                        "Java",
                        "Hard",
                        "ReentrantLock provides more advanced capabilities like fairness policies, interruptible lock waits, "
                                + "and condition variables. Unlike synchronized, you must explicitly call unlock() in a finally block."),
                new Question(
                        "How does the Volatile keyword solve the visibility problem?",
                        "Java",
                        "Hard",
                        "The volatile keyword ensures that the value of a variable is always read from and written to the main memory, "
                                + "rather than being cached in a thread's local CPU cache, ensuring all threads see the most recent value."),
                new Question(
                        "What is the purpose of @Primary and @Qualifier in Spring?",
                        "Spring Boot",
                        "Medium",
                        "@Primary marks a bean as the default choice when multiple beans of the same type exist. "
                                + "@Qualifier allows specifying exactly which bean to inject at the injection point by its name."),
                new Question(
                        "Difference between @ControllerAdvice and @RestControllerAdvice?",
                        "Spring Boot",
                        "Easy",
                        "@ControllerAdvice is used for centralized exception handling in traditional MVC controllers. "
                                + "@RestControllerAdvice is a specialized version that also includes @ResponseBody, making it ideal for REST APIs."),
                new Question(
                        "What is a Marker Interface? Give examples.",
                        "Java",
                        "Easy",
                        "A marker interface has no methods or fields. It serves as a tag to tell the JVM or a framework something special about the class. "
                                + "Examples include Serializable, Cloneable, and Remote."),
                new Question(
                        "Difference between checked and unchecked exceptions?",
                        "Java",
                        "Easy",
                        "Checked exceptions must be handled or declared in the method signature. "
                                + "Unchecked exceptions (RuntimeExceptions) don't need explicit handling and usually indicate logic errors."),
                new Question(
                        "How does Eureka Server work in Spring Cloud?",
                        "Microservices",
                        "Medium",
                        "Eureka Server acting as a Service Registry. Each microservice registers itself with Eureka, providing its host and port. "
                                + "Other services (clients) query Eureka to find the location of a service they need to call."),
                new Question(
                        "What is the difference between bootstrap.yml and application.yml?",
                        "Spring Boot",
                        "Medium",
                        "bootstrap.yml is loaded before application.yml. It is used to configure properties needed for the bootstrap phase, "
                                + "such as connecting to a Spring Cloud Config Server to fetch the rest of the configuration."),
                new Question(
                        "Explain Open, Closed, and Half-Open states in a Circuit Breaker.",
                        "Microservices",
                        "Hard",
                        "Closed: Requests flow normally. Open: Requests fail fast without calling the dependency. "
                                + "Half-Open: A limited number of requests are allowed through to check if the dependency has recovered."),
                new Question(
                        "What is the difference between @Cacheable and @CachePut?",
                        "Spring Boot",
                        "Medium",
                        "@Cacheable checks the cache before executing the method; if found, it returns the cached value. "
                                + "@CachePut always executes the method and updates the cache with the new result."),
                new Question(
                        "What is the N+1 problem and how to solve it in Hibernate?",
                        "JPA",
                        "Hard",
                        "It happens when fetching a list of entities resulting in 1 query for the list and N queries for associated entities. "
                                + "Solve it using Join Fetch, EntityGraphs, or setting BatchSize."),
                new Question(
                        "Difference between JPA, Hibernate, and Spring Data JPA?",
                        "JPA",
                        "Easy",
                        "JPA is a specification. Hibernate is an implementation of that specification. "
                                + "Spring Data JPA is an abstraction layer that makes it easier to use JPA/Hibernate by providing repository interfaces."),
                new Question(
                        "What is a Surrogate Key?",
                        "Database",
                        "Easy",
                        "A surrogate key is a unique identifier (usually a numeric ID or UUID) that has no business meaning and is used purely to uniquely identify a record."),
                new Question(
                        "Explain ACID properties in a database.",
                        "Database",
                        "Easy",
                        "Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (persisted permanently)."),
                new Question(
                        "Difference between Inner Join and Left Join?",
                        "Database",
                        "Easy",
                        "Inner Join returns only the rows where there is a match in both tables. "
                                + "Left Join returns all rows from the left table and the matched rows from the right table; unmatched rows have NULLs."),
                new Question(
                        "How does Kafka handle Replication?",
                        "Kafka",
                        "Hard",
                        "Kafka replicates each partition across multiple brokers. One replica is the Leader (handling all reads/writes), "
                                + "and the others are Followers (syncing from the leader). If the leader fails, a follower is elected as the new leader."),
                new Question(
                        "What is an In-Sync Replica (ISR) in Kafka?",
                        "Kafka",
                        "Hard",
                        "It is the set of replicas that are fully caught up with the leader. Kafka only allows replicas in the ISR "
                                + "to be elected as leaders to ensure no data loss during a failover."),
                new Question(
                        "What is the difference between horizontal and vertical partitioning in a database?",
                        "Database",
                        "Medium",
                        "Horizontal partitioning (sharding) splits rows across different tables or databases. "
                                + "Vertical partitioning splits columns into different tables, often to separate rarely used data from frequently used data."),
                new Question(
                        "What is the purpose of @GeneratedValue in JPA?",
                        "JPA",
                        "Easy",
                        "It specifies how the primary key values should be generated. Strategies include "
                                + "IDENTITY (DB handles it), SEQUENCE (uses a DB sequence), and UUID (Spring/JPA generates a unique string)."),
                new Question(
                        "How do you implement Pagination in Spring Data JPA?",
                        "JPA",
                        "Easy",
                        "By extending PagingAndSortingRepository and passing a Pageable object (created via PageRequest.of(page, size)) to the repository method."),
                new Question(
                        "What is Distributed Tracing and why is it needed?",
                        "Microservices",
                        "Medium",
                        "It allows you to track a request as it travels through multiple microservices by attaching a unique Trace ID, "
                                + "helping identify bottlenecks or failures in complex distributed systems."),
                new Question(
                        "What is the difference between gRPC and REST?",
                        "Microservices",
                        "Hard",
                        "REST uses HTTP 1.1 and JSON (text-based), while gRPC uses HTTP/2 and Protocol Buffers (binary). "
                                + "gRPC is generally faster, supports bi-directional streaming, but is less human-readable than REST."),
                new Question(
                        "Explain the 'Bulkhead' pattern in microservices.",
                        "Microservices",
                        "Hard",
                        "It isolates elements of an application into pools (like threads or instances) so that if one fails, "
                                + "others continue to function, similar to how separate sections in a ship (bulkheads) prevent the whole ship from sinking."),
                new Question(
                        "What is a Dead Letter Queue (DLQ)?",
                        "Microservices",
                        "Medium",
                        "A DLQ is a specialized queue where messages that could not be processed successfully (after multiple retries) "
                                + "are moved for manual investigation or separate error handling."),
                new Question(
                        "Difference between @Autowired and @Inject?",
                        "Spring Boot",
                        "Easy",
                        "@Autowired is Spring-specific. @Inject is part of the Java Dependency Injection (JSR-330) standard. "
                                + "Functionally they are very similar, but @Autowired has a 'required' attribute."),
                new Question(
                        "How to implement custom validation in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "Create a custom annotation, apply it to a field, and implement a ConstraintValidator class "
                                + "that contains the logic to validate the input data."),
                new Question(
                        "What is the role of the DispatcherServlet in Spring MVC?",
                        "Spring Boot",
                        "Hard",
                        "It is the Front Controller that receives all incoming requests, resolves them using HandlerMappings, "
                                + "calls the appropriate Controller, and finally returns the view or response body."),
                new Question(
                        "What is the difference between @PathVariable and @RequestParam?",
                        "Spring Boot",
                        "Easy",
                        "@PathVariable is used to extract values directly from the URI path (e.g., /users/{id}). "
                                + "@RequestParam is used to extract values from query parameters (e.g., /users?id=123)."),
                new Question(
                        "Explain the Spring Bean Lifecycle.",
                        "Spring Boot",
                        "Hard",
                        "It includes: 1. Instantiation 2. Populating properties 3. BeanNameAware/BeanFactoryAware "
                                + "4. Pre-initialization (BeanPostProcessor) 5. AfterPropertiesSet (@PostConstruct) "
                                + "6. Custom init method 7. Post-initialization 8. Ready for use 9. Destruction (@PreDestroy)."),
                new Question(
                        "What is the default server and port for a Spring Boot web application?",
                        "Spring Boot",
                        "Easy",
                        "The default embedded server is Apache Tomcat, and it runs on port 8080 by default."),
                new Question(
                        "What is ng-content and how does content projection work in Angular?",
                        "Angular",
                        "Medium",
                        "ng-content is a tag used as a placeholder in a component's template to inject external HTML content (content projection) "
                                + "from the parent component into a specific location in the child component's view."),
                new Question(
                        "Difference between @ViewChild and @ContentChild in Angular?",
                        "Angular",
                        "Hard",
                        "@ViewChild is used to access elements or components that are part of the component's own template. "
                                + "@ContentChild is used to access elements or components that are projected into the component via ng-content."),
                new Question(
                        "How does Dependency Injection work in Angular?",
                        "Angular",
                        "Medium",
                        "Angular has its own DI framework. Services are typical dependencies registered with an Injector. "
                                + "When a component or service needs a dependency, the Injector provides an instance (usually a singleton)."),
                new Question(
                        "What is an Angular Pipe?",
                        "Angular",
                        "Easy",
                        "Pipes are simple functions used in template expressions to accept an input value and return a transformed value "
                                + "for display (e.g., DatePipe, UpperCasePipe, CurrencyPipe)."),
                new Question(
                        "What is an HTTP Interceptor in Angular?",
                        "Angular",
                        "Medium",
                        "An Interceptor allows you to intercept and modify outgoing HTTP requests or incoming responses globally, "
                                + "often used for adding authentication tokens (JWT) or logging errors."),
                new Question(
                        "What is the difference between Subject and BehaviorSubject in RxJS?",
                        "Angular",
                        "Hard",
                        "A Subject does not store a value and only emits current values to active subscribers. "
                                + "A BehaviorSubject stores the 'current' value and emits it immediately to any new subscriber."),
                new Question(
                        "Explain GraphQL vs REST.",
                        "System Design",
                        "Medium",
                        "REST uses fixed endpoints and returns predefined data models. "
                                + "GraphQL allows the client to request exactly the fields it needs in a single request, reducing over-fetching and under-fetching."),
                new Question(
                        "How do you handle merge conflicts in Git?",
                        "DevOps",
                        "Easy",
                        "I identify the conflicting files, open them to see the markers (<<<<, ====, >>>>), "
                                + "manually choose the correct code, remove the markers, and then 'git add' and 'git commit' the resolved changes."),
                new Question(
                        "What is ISO8583?",
                        "Miscellaneous",
                        "Hard",
                        "ISO8583 is an international standard for financial transaction card originated messages. "
                                + "It defines the message format and communication flow between systems that exchange electronic transactions made by cardholders."),
                new Question(
                        "Difference between method overloading and method overriding?",
                        "Java",
                        "Easy",
                        "Overloading occurs in the same class and involves methods with the same name but different parameters (compile-time). "
                                + "Overriding occurs in a subclass that provides a specific implementation for a method already defined in its superclass (run-time)."),
                new Question(
                        "How many ways can an object be created in Java?",
                        "Java",
                        "Medium",
                        "Common ways: 1. Using 'new' keyword. 2. Using Class.forName().newInstance(). "
                                + "3. Using clone() method. 4. Using Deserialization. 5. Using Factory methods."),
                new Question(
                        "What is the use of ResponseEntity in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "ResponseEntity represents the entire HTTP response, including the status code, headers, and body. "
                                + "It gives you full control over the response returned to the client."),
                new Question(
                        "How to implement idempotency in Microservices?",
                        "Microservices",
                        "Hard",
                        "Idempotency can be achieved by using unique Request-IDs, database constraints, "
                                + "or idempotency-keys stored in a cache (like Redis) to ensure that processing the same request multiple times has the same effect as processing it once."),
                new Question(
                        "Explain the N+1 query problem and how to solve it in JPA.",
                        "Database",
                        "Hard",
                        "N+1 occurs when you fetch a list of entities and then fetch a related entity for each. "
                                + "Solve it using JOIN FETCH in JPQL or @EntityGraph to fetch associations in a single query."),
                new Question(
                        "What is the difference between @ViewChild and @ContentChild in Angular?",
                        "Angular",
                        "Medium",
                        "@ViewChild is used to access elements inside the component's own template. "
                                + "@ContentChild is used to access projected content (inside ng-content) provided by a parent."),
                new Question(
                        "Difference between switchMap, mergeMap, and concatMap in RxJS?",
                        "Angular",
                        "Hard",
                        "switchMap cancels the previous inner observable when a new value arrives. "
                                + "mergeMap handles all inner observables concurrently. concatMap handles them sequentially."),
                new Question(
                        "What are the top 3 performance bottlenecks in Microservices?",
                        "System Design",
                        "Medium",
                        "1. Network Latency (too many hops). 2. Database I/O (slow queries or lack of caching). "
                                + "3. Thread/Resource exhaustion under high concurrency."),
                new Question(
                        "Explain Blue-Green vs Canary deployments.",
                        "DevOps",
                        "Medium",
                        "Blue-Green: Switch all traffic from an old environment to a new one. "
                                + "Canary: Gradually roll out the new version to a small percentage of users first."),
                new Question(
                        "How do you reverse a string while preserving word positions? (e.g., 'Hello World' -> 'olleH dlroW')",
                        "Coding",
                        "Medium",
                        "Split the string by spaces into an array, reverse each word individually using a StringBuilder, "
                                + "and then join them back with spaces."),
                new Question(
                        "How to find the longest substring without repeating characters?",
                        "Coding",
                        "Hard",
                        "Use the 'Sliding Window' technique with a HashSet to track characters. "
                                + "Expand the window until a duplicate is found, then shrink it from the left."),
                new Question(
                        "How do you check if two strings are Anagrams?",
                        "Coding",
                        "Easy",
                        "Sort both strings and compare them, or use a character frequency count array (size 256) to verify all counts match."),
                new Question(
                        "Explain Spring Bean Scopes: Singleton vs Prototype vs Request.",
                        "Spring Boot",
                        "Medium",
                        "Singleton: Only one instance per Spring container. Prototype: A new instance every time it is requested. "
                                + "Request: A new instance per HTTP request."),
                new Question(
                        "What is the difference between @PathVariable and @RequestParam?",
                        "Spring Boot",
                        "Easy",
                        "@PathVariable extracts values from the URI path (e.g., /users/{id}). "
                                + "@RequestParam extracts values from query parameters (e.g., /users?id=123)."),
                new Question(
                        "What is Spring Boot Auto-Configuration?",
                        "Spring Boot",
                        "Medium",
                        "It is the mechanism where Spring Boot automatically configures beans based on the jars present in the classpath (e.g., H2 jar triggers a DataSource bean)."),
                new Question(
                        "How do you handle exceptions globally in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "By using the @ControllerAdvice and @ExceptionHandler annotations to create a central class that catches and handles exceptions from all controllers."),
                new Question(
                        "What is the purpose of Spring Actuator?",
                        "Spring Boot",
                        "Easy",
                        "It provides production-ready features like health checks, metrics, and environment details via HTTP endpoints (/health, /metrics)."),
                new Question(
                        "What is Service Discovery (Eureka)?",
                        "Microservices",
                        "Medium",
                        "Service Discovery allows microservices to find each other dynamically without hardcoding IP addresses, typically using a registry like Netflix Eureka."),
                new Question(
                        "Explain the Circuit Breaker pattern (Resilience4j).",
                        "Microservices",
                        "Hard",
                        "It prevents cascading failures by 'opening' when a threshold of failures is met, stopping requests to the failing service until it recovers."),
                new Question(
                        "How to exclude a class from Component Scan?",
                        "Spring Boot",
                        "Medium",
                        "Use the 'excludeFilters' attribute in @ComponentScan with @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = YourClass.class)."),
                new Question(
                        "What is the difference between Checked and Unchecked Exceptions?",
                        "Java",
                        "Easy",
                        "Checked exceptions must be handled at compile-time (e.g., IOException). Unchecked exceptions occur at runtime and are optional to catch."),
                new Question(
                        "How does a HashMap work internally in Java?",
                        "Java",
                        "Hard",
                        "It uses an array of buckets and hashing. If a collision occurs, it uses a linked list or a red-black tree (since Java 8) to store entries."),
                new Question(
                        "What is the difference between get() and load() in Hibernate?",
                        "Database",
                        "Medium",
                        "get() hits the DB immediately and returns null if not found. load() returns a proxy and only hits the DB when a property is accessed."),
                new Question(
                        "What is the difference between Mocking and Stubbing?",
                        "Java",
                        "Medium",
                        "Stubbing provides a fixed response (canned data). Mocking verifies that certain methods were called with specific parameters."),
                new Question(
                        "How to check if two strings are palindromes?",
                        "Coding",
                        "Easy",
                        "Reverse the string and compare it with the original, or use two pointers moving from ends toward the middle."),
                new Question(
                        "How to find the second highest element in an array?",
                        "Coding",
                        "Medium",
                        "Iterate once, keeping track of the 'largest' and 'second largest' numbers found so far."),
                new Question(
                        "How to find common elements of two arrays?",
                        "Coding",
                        "Easy",
                        "Store one array in a HashSet, then iterate through the second array and check if the element exists in the set."),
                new Question(
                        "How to check if a number is Prime?",
                        "Coding",
                        "Easy",
                        "Check for divisibility from 2 up to the square root of the number."),
                new Question(
                        "State 5 semantic HTML tags and their significance.",
                        "Frontend",
                        "Easy",
                        "<header>, <nav>, <main>, <article>, and <footer>. They provide meaning to the web structure for accessibility and SEO."),
                new Question(
                        "How do you flatten a nested array in JavaScript? (e.g., [1, [2, [3]]] -> [1, 2, 3])",
                        "Coding",
                        "Medium",
                        "Use the .flat(Infinity) method, or a recursive function that spreads nested arrays into a single result array."),
                new Question(
                        "Explain JWT vs OAuth2.",
                        "Security",
                        "Medium",
                        "JWT is a token format used for authentication. OAuth2 is an authorization framework that defines how to grant access to resources."),
                new Question(
                        "What is Feign Client in Spring Cloud?",
                        "Microservices",
                        "Medium",
                        "It is a declarative web service client that makes writing HTTP clients easier by using interfaces and annotations."),
                new Question(
                        "Explain @PostConstruct and @PreDestroy.",
                        "Spring Boot",
                        "Easy",
                        "@PostConstruct runs right after dependency injection. @PreDestroy runs just before the bean is removed from the container."),
                new Question(
                        "What are the Maven commands you use daily?",
                        "DevOps",
                        "Easy",
                        "mvn clean install (to build), mvn test (to run tests), and mvn spring-boot:run (to start the app)."),
                new Question(
                        "What is a Dockerfile and its main instructions?",
                        "DevOps",
                        "Medium",
                        "A text file with instructions to build a Docker image. Common commands: FROM (base image), COPY (copy files), and ENTRYPOINT (execution command)."),
                new Question(
                        "Difference between @Controller and @RestController?",
                        "Spring Boot",
                        "Easy",
                        "@Controller is used for traditional MVC (returns views). @RestController is a combination of @Controller and @ResponseBody (returns JSON/data)."),
                new Question(
                        "What is the role of Hibernate Second-Level Cache?",
                        "Database",
                        "Hard",
                        "It provides a way to cache data across different sessions (shared cache), reducing the number of queries to the database."),
                new Question(
                        "How to handle version mismatch between microservices?",
                        "Microservices",
                        "Hard",
                        "Use semantic versioning, maintain backward compatibility in APIs, or implement consumer-driven contract testing."),
                new Question(
                        "Explain Service Discovery vs API Gateway.",
                        "Microservices",
                        "Medium",
                        "Service Discovery tracks service instances. API Gateway acts as a single entry point for routing, authentication, and logging."),
                new Question(
                        "Explain Dependency Injection and its benefits.",
                        "System Design",
                        "Easy",
                        "DI is a design pattern where objects receive their dependencies from the outside, making the code more testable, modular, and decoupled."),
                new Question(
                        "What is the 12 Factor App methodology?",
                        "System Design",
                        "Hard",
                        "A set of 12 best practices for building modern, cloud-native applications (e.g., Config in environment, Statelessness, Logs as event streams)."),
                new Question(
                        "How to find the factorial of a number using recursion?",
                        "Coding",
                        "Easy",
                        "Function base case: if n is 0 or 1, return 1. Recursive case: return n * factorial(n-1)."),
                new Question(
                        "Explain central configuration and secrets management.",
                        "DevOps",
                        "Medium",
                        "Central config (Spring Cloud Config) manages application settings globally. Secrets management (HashiCorp Vault) keeps sensitive keys/passwords secure."),
                // --- PHASE 1: STREAMS (50) ---
                new Question(
                        "Output of: Stream.of(1, 2, 3).map(n -> n * 2).filter(n -> n > 4).count();",
                        "Java Streams",
                        "Easy",
                        "1. (1,2,3) -> (2,4,6). Filtering n > 4 leaves only (6). Count is 1."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).peek(System.out::print).count();",
                        "Java Streams",
                        "Medium",
                        "3 (and prints 123 if lazy evaluation is triggered by count). Some Java versions optimize count() and might not trigger peek() if the size is known, but generally it would print 123."),
                new Question(
                        "Output of: Stream.of(\"a\", \"b\", \"c\").findFirst().orElse(\"d\");",
                        "Java Streams",
                        "Easy",
                        "\"a\". findFirst() returns the first element of the stream wrapped in an Optional."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).reduce(10, (a, b) -> a + b);",
                        "Java Streams",
                        "Medium",
                        "16. Start with identity 10, then add 1 (11), 2 (13), 3 (16)."),
                new Question(
                        "Output of: Stream.of(\"A\", \"B\").flatMap(s -> Stream.of(s, s.toLowerCase())).collect(Collectors.joining());",
                        "Java Streams",
                        "Hard",
                        "\"AaBb\". flatMap flattens the two-element streams produced for 'A' and 'B' into a single stream."),
                new Question(
                        "What happens?\nList<Integer> list = new ArrayList<>(Arrays.asList(1, 2));\nlist.stream().forEach(n -> list.remove(n));",
                        "Java Streams",
                        "Hard",
                        "Throws ConcurrentModificationException. You cannot modify the underlying collection while a stream is iterating over it."),
                new Question(
                        "Output of: Stream.iterate(0, n -> n + 2).limit(3).collect(Collectors.toList());",
                        "Java Streams",
                        "Medium",
                        "[0, 2, 4]. Iterates starting from 0, adding 2 each time, limited to 3 elements."),
                new Question(
                        "Output of: Stream.of(1, 2, 2, 3).distinct().count();",
                        "Java Streams",
                        "Easy",
                        "3. distinct() removes the duplicate '2'."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).allMatch(n -> n > 0);",
                        "Java Streams",
                        "Easy",
                        "true. All elements in (1, 2, 3) are greater than 0."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).anyMatch(n -> n == 2);",
                        "Java Streams",
                        "Easy",
                        "true. The element 2 exists in the stream."),
                new Question(
                        "Output of: Stream.empty().findAny().isPresent();",
                        "Java Streams",
                        "Medium",
                        "false. findAny() on an empty stream returns an empty Optional."),
                new Question(
                        "Output of: IntStream.range(1, 5).sum();",
                        "Java Streams",
                        "Medium",
                        "10. range(1, 5) includes 1, 2, 3, 4. Sum is 1+2+3+4=10."),
                new Question(
                        "Output of: IntStream.rangeClosed(1, 5).sum();",
                        "Java Streams",
                        "Medium",
                        "15. rangeClosed(1, 5) includes 1, 2, 3, 4, 5. Sum is 15."),
                new Question(
                        "Output of: Stream.of(\"cat\", \"dog\").map(String::length).max(Integer::compare).get();",
                        "Java Streams",
                        "Medium",
                        "3. Both lengths are 3, so max is 3."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).noneMatch(n -> n < 0);",
                        "Java Streams",
                        "Easy",
                        "true. None of the elements are less than 0."),
                new Question(
                        "Output of: Stream.of(10, 20).filter(n -> n > 100).findFirst().orElse(-1);",
                        "Java Streams",
                        "Easy",
                        "-1. Filter returns an empty stream, so orElse returns the default value."),
                new Question(
                        "Output of: Stream.of(1, 2, 3, 4, 5).skip(3).count();",
                        "Java Streams",
                        "Easy",
                        "2. skip(3) removes (1, 2, 3), leaving (4, 5)."),
                new Question(
                        "Output of: Stream.of(\"a\", \"b\").map(s -> s + s).collect(Collectors.toList());",
                        "Java Streams",
                        "Easy",
                        "[\"aa\", \"bb\"]."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).parallel().reduce(0, Integer::sum);",
                        "Java Streams",
                        "Medium",
                        "6. Parallel streams split the work but the final sum is the same for associative operations."),
                new Question(
                        "Is this valid?\nStream<Integer> s = Stream.of(1, 2);\nlong c1 = s.count();\nlong c2 = s.count();",
                        "Java Streams",
                        "Medium",
                        "Throws IllegalStateException. A stream cannot be reused once a terminal operation (like count) is performed."),
                new Question(
                        "Output of: Stream.of(5, 3, 1).sorted().collect(Collectors.toList());",
                        "Java Streams",
                        "Easy",
                        "[1, 3, 5]. sorted() uses natural ordering by default."),
                new Question(
                        "Output of: Stream.generate(() -> \"Hi\").limit(2).collect(Collectors.joining());",
                        "Java Streams",
                        "Medium",
                        "\"HiHi\". generate creates an infinite stream, limited to 2 elements."),
                new Question(
                        "Output of: Stream.of(Arrays.asList(1), Arrays.asList(2)).flatMap(List::stream).count();",
                        "Java Streams",
                        "Medium",
                        "2. flatMap flattens the outer stream of lists into a single stream of integers."),
                new Question(
                        "Output of: IntStream.of(1, 2, 3).average().getAsDouble();",
                        "Java Streams",
                        "Medium",
                        "2.0. Average of (1, 2, 3) is 6/3 = 2.0."),
                new Question(
                        "Output of: Stream.of(\"A\", \"AB\", \"ABC\").mapToInt(String::length).min().getAsInt();",
                        "Java Streams",
                        "Medium",
                        "1. The smallest length is from \"A\"."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).collect(Collectors.partitioningBy(n -> n > 1)).get(true).size();",
                        "Java Streams",
                        "Hard",
                        "2. partitioningBy splits into true/false maps. (2, 3) are > 1, so true map size is 2."),
                new Question(
                        "Output of: Stream.of(\"apple\", \"banana\", \"apricot\").filter(s -> s.startsWith(\"a\")).count();",
                        "Java Streams",
                        "Easy",
                        "2. \"apple\" and \"apricot\" both start with 'a'."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).limit(0).count();",
                        "Java Streams",
                        "Easy",
                        "0. limit(0) makes the stream empty."),
                new Question(
                        "Output of: Stream.of(10, 2, 30).sorted(Comparator.reverseOrder()).findFirst().get();",
                        "Java Streams",
                        "Medium",
                        "30. Reverse order makes it (30, 20, 10), so first is 30."),
                new Question(
                        "Output of: Stream.of(1, 1, 1).distinct().collect(Collectors.toList());",
                        "Java Streams",
                        "Easy",
                        "[1]."),
                new Question(
                        "Output of: Stream.concat(Stream.of(1), Stream.of(2)).count();",
                        "Java Streams",
                        "Easy",
                        "2."),
                new Question(
                        "Output of: Stream.of(1, 2, 3, 4).dropWhile(n -> n < 3).count(); (Java 9+)",
                        "Java Streams",
                        "Hard",
                        "2. dropWhile removes (1, 2) while condition is true, leaving (3, 4)."),
                new Question(
                        "Output of: Stream.of(1, 2, 3, 4).takeWhile(n -> n < 3).count(); (Java 9+)",
                        "Java Streams",
                        "Hard",
                        "2. takeWhile stops once condition is false, taking (1, 2)."),
                new Question(
                        "Output of: Stream.of(\"a\", \"b\", \"c\").map(s -> s.toUpperCase()).reduce(\"\", (s1, s2) -> s1 + s2);",
                        "Java Streams",
                        "Medium",
                        "\"ABC\". Concatenates the upper-case strings."),
                new Question(
                        "Output of: IntStream.of(1, 2, 3).boxed().collect(Collectors.toList()).getClass().getSimpleName();",
                        "Java Streams",
                        "Hard",
                        "ArrayList (typically, depending on collector implementation). boxed() converts IntStream to Stream<Integer>."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).peek(n -> n = n + 10).findFirst().get();",
                        "Java Streams",
                        "Hard",
                        "1. peek cannot modify the elements of a stream of immutable objects (like Integer)."),
                new Question(
                        "Output of: Stream.of(new StringBuilder(\"A\")).peek(sb -> sb.append(\"B\")).findFirst().get().toString();",
                        "Java Streams",
                        "Hard",
                        "\"AB\". Objects themselves can be mutated in peek if they are mutable."),
                new Question(
                        "Output of: DoubleStream.of(1.1, 2.2).map(Math::floor).sum();",
                        "Java Streams",
                        "Medium",
                        "3.0. (1.0 + 2.0)."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).filter(n -> n > 10).findAny().isPresent();",
                        "Java Streams",
                        "Easy",
                        "false."),
                new Question(
                        "Output of: Stream.of(1, 2).map(n -> null).count();",
                        "Java Streams",
                        "Medium",
                        "2. count() counts null elements too."),
                new Question(
                        "What happens?\nStream.of(1, 2).forEach(System.out::print);\nStream.of(3).forEach(System.out::print);",
                        "Java Streams",
                        "Easy",
                        "123. These are two separate streams."),
                new Question(
                        "Output of: Stream.of(1, 2).collect(Collectors.averagingInt(n -> n));",
                        "Java Streams",
                        "Medium",
                        "1.5."),
                new Question(
                        "Output of: Stream.of(\"A\", \"B\", \"C\").collect(Collectors.joining(\"-\"));",
                        "Java Streams",
                        "Easy",
                        "\"A-B-C\"."),
                new Question(
                        "Output of: Stream.of(\"A\", \"B\").collect(Collectors.joining(\"[\", \",\", \"]\"));",
                        "Java Streams",
                        "Medium",
                        "\"[A,B]\". [prefix, delimiter, suffix]."),
                new Question(
                        "Output of: Stream.of(1, 2, 3).filter(n -> { System.out.print(n); return n > 1; }).findFirst().get();",
                        "Java Streams",
                        "Hard",
                        "2 (prints 12). findFirst stops as soon as it finds a match. 1 is checked (fails), 2 is checked (passes and returns)."),
                new Question(
                        "Output of: Stream.of(10, 5, 8).min(Comparator.naturalOrder()).get();",
                        "Java Streams",
                        "Easy",
                        "5."),
                new Question(
                        "Output of: Stream.of(10, 5, 8).max(Comparator.naturalOrder()).get();",
                        "Java Streams",
                        "Easy",
                        "10."),
                new Question(
                        "Output of: Stream.of(1, 2).isParallel();",
                        "Java Streams",
                        "Easy",
                        "false (by default)."),
                new Question(
                        "Output of: Stream.of(1, 2).parallel().isParallel();",
                        "Java Streams",
                        "Easy",
                        "true."),
                new Question(
                        "What happens?\nStream.of(1, 2, 3).filter(n -> n > 1).parallel().forEach(System.out::print);",
                        "Java Streams",
                        "Medium",
                        "23 or 32. Parallel forEach does not guarantee order."),
                // --- PHASE 1: SQL (50) ---
                new Question(
                        "SQL: SELECT COUNT(*) FROM (SELECT NULL UNION ALL SELECT NULL);",
                        "SQL",
                        "Medium",
                        "2. UNION ALL includes duplicates/nulls, and COUNT(*) counts the rows."),
                new Question(
                        "SQL: SELECT COALESCE(NULL, NULL, 5, 10);",
                        "SQL",
                        "Easy",
                        "5. COALESCE returns the first non-null value."),
                new Question(
                        "SQL: SELECT 1 / 2;",
                        "SQL",
                        "Medium",
                        "0 (in many dialects like SQL Server/Postgres as integer division) or 0.5 (in MySQL/Oracle)."),
                new Question(
                        "SQL: SELECT 'A' + 'B' in SQL Server vs MySQL?",
                        "SQL",
                        "Medium",
                        "SQL Server: 'AB' (+ is concat). MySQL: 0 (+ is addition, non-numeric strings promote to 0)."),
                new Question(
                        "SQL: In 'SELECT * FROM EMP WHERE NOT (SAL > 1000 OR SAL < 2000)', what SAL matches?",
                        "SQL",
                        "Hard",
                        "None. The range (SAL > 1000 OR SAL < 2000) covers all numbers, so NOT of that matches nothing (except NULLs depending on dialect)."),
                new Question(
                        "SQL: Difference between UNION and UNION ALL?",
                        "SQL",
                        "Easy",
                        "UNION removes duplicates; UNION ALL does not."),
                new Question(
                        "SQL: SELECT COUNT(COMM) FROM EMP; (Assume 4 rows, COMM values: 100, NULL, 50, NULL)",
                        "SQL",
                        "Medium",
                        "2. Aggregate functions like COUNT(column) ignore NULLs."),
                new Question(
                        "SQL: SELECT COUNT(*) FROM EMP; (Assume 4 rows, some columns NULL)",
                        "SQL",
                        "Easy",
                        "4. COUNT(*) counts all rows including those with NULLs."),
                new Question(
                        "SQL: What happens in a LEFT JOIN if the right table has no match?",
                        "SQL",
                        "Easy",
                        "The result will have the left table row with NULL values for all right table columns."),
                new Question(
                        "SQL: SELECT 1 WHERE 1 = NULL;",
                        "SQL",
                        "Medium",
                        "No results. NULL comparisons must use IS NULL; = NULL is always UNKNOWN/false."),
                new Question(
                        "SQL: SELECT 'True' WHERE NULL IS NULL;",
                        "SQL",
                        "Easy",
                        "'True'."),
                new Question(
                        "SQL: Results of: SELECT RANK() OVER (ORDER BY SAL DESC) FROM (SAL=100, 100, 50);",
                        "SQL",
                        "Hard",
                        "1, 1, 3. RANK() leaves gaps after ties."),
                new Question(
                        "SQL: Results of: SELECT DENSE_RANK() OVER (ORDER BY SAL DESC) FROM (SAL=100, 100, 50);",
                        "SQL",
                        "Hard",
                        "1, 1, 2. DENSE_RANK() does not leave gaps."),
                new Question(
                        "SQL: Results of: SELECT ROW_NUMBER() OVER (ORDER BY SAL DESC) FROM (SAL=100, 100, 50);",
                        "SQL",
                        "Medium",
                        "1, 2, 3. ROW_NUMBER() assigns unique sequential numbers."),
                new Question(
                        "SQL: SELECT * FROM EMP LIMIT 5 OFFSET 2; Which rows are returned?",
                        "SQL",
                        "Medium",
                        "Rows 3 through 7 (Skips 2, takes next 5)."),
                new Question(
                        "SQL: SELECT LENGTH(' Hello ');",
                        "SQL",
                        "Easy",
                        "7 (includes spaces)."),
                new Question(
                        "SQL: SELECT UPPER('java');",
                        "SQL",
                        "Easy",
                        "'JAVA'."),
                new Question(
                        "SQL: SELECT SUBSTRING('Interview', 1, 5);",
                        "SQL",
                        "Medium",
                        "'Inter'. (Starts at 1, length/end 5 depending on dialect)."),
                new Question(
                        "SQL: SELECT * FROM EMP WHERE NAME LIKE '_a%'; Matches which names?",
                        "SQL",
                        "Medium",
                        "Names where the second letter is 'a' (e.g., Cat, Jack)."),
                new Question(
                        "SQL: SELECT * FROM EMP WHERE NAME LIKE '%a';",
                        "SQL",
                        "Easy",
                        "Names ending in 'a' (e.g., Anna, Java)."),
                new Question(
                        "SQL: Can you use aliases in the WHERE clause?",
                        "SQL",
                        "Medium",
                        "Generally no, as WHERE is processed before the SELECT alias is created."),
                new Question(
                        "SQL: SELECT DISTINCT NULL, NULL;",
                        "SQL",
                        "Easy",
                        "One row with NULL. DISTINCT treats all NULLs as the same duplicate."),
                new Question(
                        "SQL: SELECT 10 % 3;",
                        "SQL",
                        "Easy",
                        "1 (Modulo operator)."),
                new Question(
                        "SQL: Result of: SELECT CASE WHEN 1=1 THEN 'A' ELSE 'B' END;",
                        "SQL",
                        "Easy",
                        "'A'."),
                new Question(
                        "SQL: Result of: SELECT CASE WHEN 1=2 THEN 'A' WHEN 2=2 THEN 'B' END;",
                        "SQL",
                        "Easy",
                        "'B'."),
                new Question(
                        "SQL: SELECT * FROM T1 CROSS JOIN T2; (T1 size 3, T2 size 4)",
                        "SQL",
                        "Medium",
                        "12 rows (Cartesian product)."),
                new Question(
                        "SQL: Does DELETE remove the table structure?",
                        "SQL",
                        "Easy",
                        "No, it only removes data. DROP removes the structure."),
                new Question(
                        "SQL: Difference between TRUNCATE and DELETE?",
                        "SQL",
                        "Medium",
                        "TRUNCATE is faster, cannot be rolled back (in some DBs), and deletes all rows. DELETE can have a WHERE clause."),
                new Question(
                        "SQL: SELECT AVG(SAL) FROM EMP; (Assume 2 rows: 100, NULL)",
                        "SQL",
                        "Medium",
                        "100. NULL is ignored, so (100) / 1 = 100."),
                new Question(
                        "SQL: SELECT SUM(SAL) FROM EMP; (Assume 2 rows: NULL, NULL)",
                        "SQL",
                        "Medium",
                        "NULL. Sum of only NULLs is NULL."),
                new Question(
                        "SQL: SELECT '5' + 5; (MySQL)",
                        "SQL",
                        "Medium",
                        "10. MySQL performs implicit numeric conversion for +."),
                new Question(
                        "SQL: SELECT '5' || '5'; (Oracle/Postgres)",
                        "SQL",
                        "Medium",
                        "'55'. || is the string concatenation operator."),
                new Question(
                        "SQL: SELECT * FROM EMP WHERE SAL BETWEEN 100 AND 200; Is 100 included?",
                        "SQL",
                        "Easy",
                        "Yes, BETWEEN is inclusive."),
                new Question(
                        "SQL: SELECT * FROM EMP WHERE SAL IN (100, 200);",
                        "SQL",
                        "Easy",
                        "Matches rows where SAL is exactly 100 or 200."),
                new Question(
                        "SQL: What happens to data in a VIEW if the base table is updated?",
                        "SQL",
                        "Easy",
                        "The VIEW results are updated automatically as it is a virtual table."),
                new Question(
                        "SQL: SELECT current_date; (Standard SQL)",
                        "SQL",
                        "Easy",
                        "Returns the current system date."),
                new Question(
                        "SQL: SELECT CAST('123' AS INT);",
                        "SQL",
                        "Easy",
                        "123 (numeric)."),
                new Question(
                        "SQL: SELECT COALESCE(NULLIF(1, 1), 2);",
                        "SQL",
                        "Hard",
                        "2. NULLIF(1, 1) returns NULL, then COALESCE(NULL, 2) returns 2."),
                new Question(
                        "SQL: SELECT REPLACE('ABC', 'B', 'Z');",
                        "SQL",
                        "Easy",
                        "'AZC'."),
                new Question(
                        "SQL: SELECT TRIM('  A  ');",
                        "SQL",
                        "Easy",
                        "'A'."),
                new Question(
                        "SQL: Results of: SELECT * FROM TAB WHERE COL > ANY (1, 5, 10);",
                        "SQL",
                        "Medium",
                        "Rows where COL is greater than at least one value (effectively > 1)."),
                new Question(
                        "SQL: Results of: SELECT * FROM TAB WHERE COL > ALL (1, 5, 10);",
                        "SQL",
                        "Medium",
                        "Rows where COL is greater than all values (effectively > 10)."),
                new Question(
                        "SQL: SELECT EXISTS (SELECT 1 WHERE 1=2);",
                        "SQL",
                        "Medium",
                        "false (0). The subquery returns no rows."),
                new Question(
                        "SQL: SELECT * FROM EMP ORDER BY 1; What does 1 mean?",
                        "SQL",
                        "Medium",
                        "Order by the first column in the SELECT list."),
                new Question(
                        "SQL: How to add a column? ALTER TABLE EMP ____ ADD ____;",
                        "SQL",
                        "Easy",
                        "ALTER TABLE EMP ADD column_name datatype;"),
                new Question(
                        "SQL: SELECT * FROM EMP ORDER BY SAL DESC, NAME ASC; Which takes priority?",
                        "SQL",
                        "Medium",
                        "SAL DESC. NAME ASC is only used for rows where SAL is identical."),
                new Question(
                        "SQL: Can a Primary Key contain a NULL value?",
                        "SQL",
                        "Easy",
                        "No."),
                new Question(
                        "SQL: Can a Unique Key contain a NULL value?",
                        "SQL",
                        "Medium",
                        "Yes, and in most DBs, you can have multiple rows with NULL in a unique column."),
                new Question(
                        "SQL: What is the purpose of a Foreign Key?",
                        "SQL",
                        "Easy",
                        "To enforce referential integrity between two tables."),
                new Question(
                        "SQL: SELECT ABS(-10);",
                        "SQL",
                        "Easy",
                        "10."),
                // --- 50 JAVA OUTPUT SNIPPETS ---
                new Question(
                        "What is the output?\nInteger a = 100, b = 100;\nInteger c = 150, d = 150;\nSystem.out.println(a==b);\nSystem.out.println(c==d);",
                        "Java Snippet",
                        "Medium",
                        "true, false. Java caches Integer objects between -128 and 127. 'a' and 'b' refer to the same cached object, while 'c' and 'd' are new separate objects."),
                new Question(
                        "What is the output?\nString s1 = \"Java\";\nString s2 = new String(\"Java\");\nSystem.out.println(s1 == s2.intern());",
                        "Java Snippet",
                        "Medium",
                        "true. The intern() method returns the string from the continuous pool, which is the same reference as the literal s1."),
                new Question(
                        "What happens here?\ntry { return 1; } finally { return 2; }",
                        "Java Snippet",
                        "Medium",
                        "The method returns 2. The finally block's return statement overrides any return statement in the try or catch block."),
                new Question(
                        "Output of: System.out.println(Math.min(Double.MIN_VALUE, 0.0d));",
                        "Java Snippet",
                        "Hard",
                        "0.0. Double.MIN_VALUE is the smallest POSITIVE value (approx 4.9E-324), so it is greater than 0.0."),
                new Question(
                        "What is the output?\npublic class Test {\n  static int i = 1;\n  public static void main(String[] args) {\n    System.out.println(i + \", \" + Test.i);\n  }\n}",
                        "Java Snippet",
                        "Easy",
                        "1, 1. Static variables can be accessed directly or via the class name."),
                new Question(
                        "Will this compile?\nList<String> list = new ArrayList<>();\nlist.add(10);",
                        "Java Snippet",
                        "Easy",
                        "No. Java generics provide compile-time safety; you cannot add an Integer to a List of Strings."),
                new Question(
                        "What is the output?\nString s = \"1\" + 2 + 3;\nSystem.out.println(s);",
                        "Java Snippet",
                        "Easy",
                        "\"123\". String concatenation occurs from left to right. \"1\" + 2 becomes \"12\", then \"12\" + 3 becomes \"123\"."),
                new Question(
                        "What is the output?\nSystem.out.println(1 + 2 + \"3\");",
                        "Java Snippet",
                        "Easy",
                        "\"33\". 1 + 2 is evaluated first (numeric addition), resulting in 3. Then 3 + \"3\" results in \"33\"."),
                new Question(
                        "What happens?\npublic void test(Object o) { System.out.println(\"Obj\"); }\npublic void test(String s) { System.out.println(\"Str\"); }\n...\ntest(null);",
                        "Java Snippet",
                        "Medium",
                        "Prints \"Str\". Java choose the most specific method; String is more specific than Object."),
                new Question(
                        "Output of: System.out.println(0.1 + 0.2 == 0.3);",
                        "Java Snippet",
                        "Hard",
                        "false. Due to floating point precision errors, 0.1 + 0.2 is actually something like 0.30000000000000004."),
                new Question(
                        "What is the output?\nSet<Short> s = new HashSet<>();\nfor (short i=0; i<10; i++) {\n  s.add(i);\n  s.remove(i - 1);\n}\nSystem.out.println(s.size());",
                        "Java Snippet",
                        "Hard",
                        "10. The expression (i - 1) is promoted to an Integer. HashSet.remove(Object) will not find a Short object when passed an Integer."),
                new Question(
                        "What is unique about a 'finally' block?",
                        "Java Snippet",
                        "Easy",
                        "It always executes regardless of whether an exception is thrown or caught (unless System.exit() is called)."),
                new Question(
                        "Output of: System.out.println(true ? null : 0);",
                        "Java Snippet",
                        "Hard",
                        "Throws NullPointerException. The ternary operator performs unboxing of the '0' (primitive int) to match the types, causing a null pointer on the null part."),
                new Question(
                        "Output of: System.out.println(10 >> 1);",
                        "Java Snippet",
                        "Medium",
                        "5. Right shift by 1 is equivalent to dividing by 2."),
                new Question(
                        "Output of: System.out.println(1 << 3);",
                        "Java Snippet",
                        "Medium",
                        "8. Left shift by 3 is equivalent to multiplying 1 by 2^3."),
                new Question(
                        "What is the result?\nString a = \"A\";\nString b = \"A\";\nSystem.out.println(a == b);",
                        "Java Snippet",
                        "Easy",
                        "true. Both refer to the same literal in the String Constant Pool."),
                new Question(
                        "What happens?\nThread t = new Thread(() -> System.out.println(\"Hi\"));\nt.run();",
                        "Java Snippet",
                        "Medium",
                        "Prints \"Hi\". However, t.run() executes in the CURRENT thread, not a new parallel thread. t.start() should be used for concurrency."),
                new Question(
                        "What is the behavior of 'volatile'?",
                        "Java Snippet",
                        "Hard",
                        "Ensures that a variable is always read from/written to the main memory, providing visibility across threads but not atomicity."),
                new Question(
                        "Output of: System.out.println(5 / 2);",
                        "Java Snippet",
                        "Easy",
                        "2. Integer division discards the fractional part."),
                new Question(
                        "Output of: System.out.println(5.0 / 2);",
                        "Java Snippet",
                        "Easy",
                        "2.5. Floating point division preserve the fractional part."),
                new Question(
                        "What is the output?\nint x = 5;\nSystem.out.println(x++);\nSystem.out.println(++x);",
                        "Java Snippet",
                        "Medium",
                        "5, 7. x++ returns 5 then increments to 6. ++x increments to 7 then returns 7."),
                new Question(
                        "What happens?\nList list = new ArrayList();\nlist.add(\"A\");\nlist.add(1);\nString s = (String) list.get(1);",
                        "Java Snippet",
                        "Medium",
                        "Throws ClassCastException at runtime. Raw lists accept any object, but casting an Integer to a String fails."),
                new Question(
                        "Output of: System.out.println(\"A\".compareTo(\"B\"));",
                        "Java Snippet",
                        "Medium",
                        "-1. 'A' comes before 'B' in lexicographical order."),
                new Question(
                        "Will this compile?\nfinal int x;\nx = 10;\nx = 20;",
                        "Java Snippet",
                        "Easy",
                        "No. A final variable can only be assigned once."),
                new Question(
                        "What is the output?\npublic class P { static void m() { System.out.print(\"P\"); } }\npublic class C extends P { static void m() { System.out.print(\"C\"); } }\n...\nP p = new C(); p.m();",
                        "Java Snippet",
                        "Hard",
                        "P. Static methods are not overridden but hidden. The method called depends on the reference type (P), not the object type (C)."),
                new Question(
                        "Output of: System.out.println(null instanceof Object);",
                        "Java Snippet",
                        "Easy",
                        "false. 'null' is not an instance of any class."),
                new Question(
                        "What is the output?\nboolean b = false;\nif (b = true) System.out.print(\"Yes\");",
                        "Java Snippet",
                        "Medium",
                        "Yes. The expression (b = true) assigns true to b and then evaluates to true, so the if-block executes."),
                new Question(
                        "What is the capacity of a default ArrayList if it has 1 element?",
                        "Java Snippet",
                        "Hard",
                        "10. ArrayList starts with a default capacity of 10 when the first element is added."),
                new Question(
                        "Output of: System.out.println(1 | 2);",
                        "Java Snippet",
                        "Medium",
                        "3. Bitwise OR of 01 and 10 is 11 (3)."),
                new Question(
                        "Output of: System.out.println(1 & 2);",
                        "Java Snippet",
                        "Medium",
                        "0. Bitwise AND of 01 and 10 is 00 (0)."),
                new Question(
                        "What happens?\ninterface I { int x = 10; }\nI.x = 20;",
                        "Java Snippet",
                        "Easy",
                        "Compilation error. Fields in interfaces are implicitly public, static, and final."),
                new Question(
                        "Output of: System.out.println(\"Java\".replace('a', 'o'));",
                        "Java Snippet",
                        "Easy",
                        "\"Jovo\". The replace method swaps all occurrences of the character."),
                new Question(
                        "What is the output?\nString s = \" \".trim();\nSystem.out.println(s.isEmpty());",
                        "Java Snippet",
                        "Easy",
                        "true. trim() removes the space, leaving an empty string."),
                new Question(
                        "What happens?\nclass Foo { Foo(int x) {} }\nFoo f = new Foo();",
                        "Java Snippet",
                        "Medium",
                        "Compilation error. Once you define a constructor with parameters, the compiler no longer provides the default no-arg constructor."),
                new Question(
                        "Output of: System.out.println(10 % 3);",
                        "Java Snippet",
                        "Easy",
                        "1. The remainder of 10 divided by 3 is 1."),
                new Question(
                        "What is the result?\nint[] a = {1, 2};\nint[] b = {1, 2};\nSystem.out.println(a.equals(b));",
                        "Java Snippet",
                        "Medium",
                        "false. Arrays do not override equals(); they use Object's version which compares references (use Arrays.equals() instead)."),
                new Question(
                        "Output of: System.out.println(Character.isDigit('1'));",
                        "Java Snippet",
                        "Easy",
                        "true."),
                new Question(
                        "What is the output?\nStringBuilder sb = new StringBuilder(\"Hi\");\nsb.append(\"!\").reverse();\nSystem.out.println(sb);",
                        "Java Snippet",
                        "Medium",
                        "\"!iH\". The content is appended then reversed in-place."),
                new Question(
                        "Will this compile?\nvoid m() { static int x = 1; }",
                        "Java Snippet",
                        "Easy",
                        "No. Local variables cannot be static in Java."),
                new Question(
                        "What happens?\nint x = 010;\nSystem.out.println(x);",
                        "Java Snippet",
                        "Hard",
                        "8. Prefixing a number with 0 makes it an Octal literal (Base 8)."),
                new Question(
                        "Output of: System.out.println(0x10);",
                        "Java Snippet",
                        "Medium",
                        "16. Prefixing with 0x makes it Hexadecimal (Base 16)."),
                new Question(
                        "Output of: System.out.println(10 == 10.0);",
                        "Java Snippet",
                        "Medium",
                        "true. Numeric promotion occurs, comparing 10.0 and 10.0."),
                new Question(
                        "What is the output?\nList<Integer> l = Arrays.asList(1, 2, 3);\nl.remove(0);",
                        "Java Snippet",
                        "Hard",
                        "Throws UnsupportedOperationException. Arrays.asList returns a fixed-size list that does not support structural modifications."),
                new Question(
                        "Output of: System.out.println(\"Java\".substring(1, 3));",
                        "Java Snippet",
                        "Medium",
                        "\"av\". Start index is inclusive (1), end index is exclusive (3)."),
                new Question(
                        "What is the output?\nint a = 1, b = 2;\nSystem.out.println(a + b + \"Sum\");",
                        "Java Snippet",
                        "Easy",
                        "\"3Sum\". 1 + 2 is numeric, then 3 + \"Sum\" is string concatenation."),
                new Question(
                        "What is the output?\nSystem.out.println(\"Sum\" + a + b);",
                        "Java Snippet",
                        "Easy",
                        "\"Sum12\". \"Sum\" + 1 is \"Sum1\", then \"Sum1\" + 2 is \"Sum12\"."),
                new Question(
                        "What happens?\nint x = (int) 3.9;\nSystem.out.println(x);",
                        "Java Snippet",
                        "Easy",
                        "3. Casting to int truncated the decimal part."),
                new Question(
                        "Output of: System.out.println(Math.ceil(2.1));",
                        "Java Snippet",
                        "Easy",
                        "3.0. Ceil always rounds up to the next double integer."),
                new Question(
                        "Output of: System.out.println(Math.floor(2.9));",
                        "Java Snippet",
                        "Easy",
                        "2.0. Floor always rounds down."),
                new Question(
                        "What is the output?\nString s = \"ABC\";\nSystem.out.println(s.length() + s.charAt(0));",
                        "Java Snippet",
                        "Hard",
                        "68. s.length() is 3. s.charAt(0) is 'A' (char). Numeric addition promotes 'A' to its ASCII value (65). 3 + 65 = 68."),
                // --- PHASE 2: LLD (30) ---
                new Question(
                        "LLD: If Class A has-a Class B, and B is destroyed when A is destroyed, what is this relation?",
                        "LLD",
                        "Medium",
                        "Composition. It is a 'strong' has-a relationship where the lifetimes are linked."),
                new Question(
                        "LLD: Which SOLID principle says 'Classes should be open for extension but closed for modification'?",
                        "LLD",
                        "Easy",
                        "Open/Closed Principle (OCP)."),
                new Question(
                        "LLD: Which pattern allows adding behavior to an object without altering its structure?",
                        "LLD",
                        "Medium",
                        "Decorator Pattern."),
                new Question(
                        "LLD: Which pattern defines a family of algorithms and makes them interchangeable?",
                        "LLD",
                        "Medium",
                        "Strategy Pattern."),
                new Question(
                        "LLD: Does Singleton pattern violate Single Responsibility Principle?",
                        "LLD",
                        "Hard",
                        "Yes, often argued it does because it manages its own lifecycle AND its actual business task."),
                new Question(
                        "LLD: Which principle says 'Subtypes must be substitutable for their base types'?",
                        "LLD",
                        "Easy",
                        "Liskov Substitution Principle (LSP)."),
                new Question(
                        "LLD: Which pattern is best for implementing a 'global' point of access to a resource?",
                        "LLD",
                        "Easy",
                        "Singleton Pattern."),
                new Question(
                        "LLD: What is the benefit of Dependency Inversion Principle?",
                        "LLD",
                        "Medium",
                        "It decouples high-level modules from low-level modules by making both depend on abstractions."),
                new Question(
                        "LLD: Which pattern uses a 'registry' to manage many instances of a class?",
                        "LLD",
                        "Medium",
                        "Multiton Pattern or Flyweight (depending on the context of reuse)."),
                new Question(
                        "LLD: Which pattern provides a simplified interface to a large body of code?",
                        "LLD",
                        "Easy",
                        "Facade Pattern."),
                new Question(
                        "LLD: In Observer pattern, what happens when the subject's state changes?",
                        "LLD",
                        "Easy",
                        "All registered observers are notified automatically."),
                new Question(
                        "LLD: Which pattern is used to separate an object's construction from its representation?",
                        "LLD",
                        "Medium",
                        "Builder Pattern."),
                new Question(
                        "LLD: What is 'Duck Typing'?",
                        "LLD",
                        "Medium",
                        "If it looks like a duck and quacks like a duck, it's a duck—focus on behavior rather than explicit class hierarchy."),
                new Question(
                        "LLD: Which pattern allows a class to have only one instance while providing a global access point?",
                        "LLD",
                        "Easy",
                        "Singleton."),
                new Question(
                        "LLD: Difference between Abstract Factory and Factory Method?",
                        "LLD",
                        "Hard",
                        "Factory Method creates one product; Abstract Factory creates families of related products."),
                new Question(
                        "LLD: Which pattern is ideal for undo/redo functionality?",
                        "LLD",
                        "Medium",
                        "Command Pattern."),
                new Question(
                        "LLD: What is the 'Hollywood Principle' in LLD?",
                        "LLD",
                        "Medium",
                        "'Don't call us, we'll call you'—a core concept for Dependency Injection and Frameworks."),
                new Question(
                        "LLD: Which pattern converts the interface of a class into another interface clients expect?",
                        "LLD",
                        "Easy",
                        "Adapter Pattern."),
                new Question(
                        "LLD: Which pattern is used to reduce the memory usage of many similar objects?",
                        "LLD",
                        "Hard",
                        "Flyweight Pattern."),
                new Question(
                        "LLD: Which pattern encapsulates a request as an object?",
                        "LLD",
                        "Medium",
                        "Command Pattern."),
                new Question(
                        "LLD: Design a parking lot—which entities are core?",
                        "LLD",
                        "Medium",
                        "ParkingLot, Floor, ParkingSpot, Vehicle, Ticket, PaymentTerminal."),
                new Question(
                        "LLD: What is an 'Interface Segregation' violation?",
                        "LLD",
                        "Medium",
                        "When a class is forced to implement methods it doesn't use from a large, bloated interface."),
                new Question(
                        "LLD: Does composition favor internal or external reuse?",
                        "LLD",
                        "Hard",
                        "External/Black-box reuse, as inner details are hidden compared to inheritance."),
                new Question(
                        "LLD: Which pattern is used for complex state-dependent behavior?",
                        "LLD",
                        "Medium",
                        "State Pattern."),
                new Question(
                        "LLD: Which pattern allows an object to appear as another object's placeholder?",
                        "LLD",
                        "Easy",
                        "Proxy Pattern."),
                new Question(
                        "LLD: Which pattern should be used for traversing a collection without exposing its internal structure?",
                        "LLD",
                        "Easy",
                        "Iterator Pattern."),
                new Question(
                        "LLD: What is a 'God Object' antipattern?",
                        "LLD",
                        "Easy",
                        "A class that knows or does too much, violating Single Responsibility."),
                new Question(
                        "LLD: Which pattern handles requests by passing them along a chain of handlers?",
                        "LLD",
                        "Medium",
                        "Chain of Responsibility."),
                new Question(
                        "LLD: Which pattern allows creating new objects by copying an existing instance?",
                        "LLD",
                        "Medium",
                        "Prototype Pattern."),
                new Question(
                        "LLD: What is the main benefit of the Bridge pattern?",
                        "LLD",
                        "Hard",
                        "It decouples an abstraction from its implementation so that the two can vary independently."),
                // --- PHASE 2: FRONTEND (30) ---
                new Question(
                        "JS: Output of 'console.log(typeof null)'?",
                        "Frontend",
                        "Easy",
                        "'object'. This is a long-standing legacy bug in JavaScript."),
                new Question(
                        "React: When does the cleanup function of useEffect run?",
                        "Frontend",
                        "Medium",
                        "It runs before the component unmounts and before the effect runs again due to dependency changes."),
                new Question(
                        "JS: Output of 'console.log(1 + \"1\" - 1)'?",
                        "Frontend",
                        "Hard",
                        "10. '1' + \"1\" is \"11\" (string). Then \"11\" - 1 is 10 (coerced back to numeric)."),
                new Question(
                        "CSS: Difference between 'display: none' and 'visibility: hidden'?",
                        "Frontend",
                        "Medium",
                        "'display: none' removes the element from the layout. 'visibility: hidden' keeps the space but hides the element."),
                new Question(
                        "JS: What is a closure?",
                        "Frontend",
                        "Medium",
                        "A function that remembers the variables from its outer scope even after the outer scope has finished executing."),
                new Question(
                        "React: Can you call hooks inside a loop?",
                        "Frontend",
                        "Easy",
                        "No. Hooks must be called at the top level to ensure consistent call order across renders."),
                new Question(
                        "JS: Output of 'console.log(0 == false)' vs 'console.log(0 === false)'?",
                        "Frontend",
                        "Medium",
                        "true, false. '==' performs type coercion, '===' does not."),
                new Question(
                        "CSS: What is the 'box-sizing: border-box' property?",
                        "Frontend",
                        "Medium",
                        "It includes padding and border in the element's total width and height."),
                new Question(
                        "JS: How to find if an object has a property without looking at prototype chain?",
                        "Frontend",
                        "Medium",
                        "Using 'obj.hasOwnProperty(propName)'."),
                new Question(
                        "React: What is the purpose of 'key' prop in lists?",
                        "Frontend",
                        "Easy",
                        "Allows React to identify which items have changed, been added, or removed for efficient DOM updates."),
                new Question(
                        "JS: What happens in 'setTimeout(() => console.log(1), 0); console.log(2);'?",
                        "Frontend",
                        "Medium",
                        "Prints 2 then 1. setTimeout is pushed to the task queue and runs after the main stack is empty."),
                new Question(
                        "CSS: What is Specificity order (ID, Class, Element)?",
                        "Frontend",
                        "Easy",
                        "ID > Class > Element."),
                new Question(
                        "JS: Output of '[] == ![]'?",
                        "Frontend",
                        "Hard",
                        "true. ![] is false. [] == false is converted to 0 == 0."),
                new Question(
                        "React: Difference between useMemo and useCallback?",
                        "Frontend",
                        "Medium",
                        "useMemo returns a memoized VALUE; useCallback returns a memoized FUNCTION."),
                new Question(
                        "JS: What is 'Hoisting'?",
                        "Frontend",
                        "Medium",
                        "The behavior where variable and function declarations are moved to the top of their containing scope during compilation."),
                new Question(
                        "HTML: What is the purpose of 'alt' attribute in <img>?",
                        "Frontend",
                        "Easy",
                        "Provides alternative text for screen readers or if the image fails to load."),
                new Question(
                        "Angular: When is ngOnChanges called?",
                        "Frontend",
                        "Medium",
                        "It is called before ngOnInit and whenever one or more data-bound input properties (@Input) change."),
                new Question(
                        "JS: What is a Promise?",
                        "Frontend",
                        "Easy",
                        "An object representing the eventual completion or failure of an asynchronous operation."),
                new Question(
                        "CSS: What does 'flex-shrink: 0' do?",
                        "Frontend",
                        "Medium",
                        "Prevents the flex item from shrinking even if there is not enough space in the container."),
                new Question(
                        "React: What is the Virtual DOM?",
                        "Frontend",
                        "Medium",
                        "A lightweight, in-memory representation of the real DOM used to calculate efficient updates."),
                new Question(
                        "JS: Output of 'NaN === NaN'?",
                        "Frontend",
                        "Hard",
                        "false. NaN is the only value in JS that is not equal to itself."),
                new Question(
                        "CSS: Purpose of 'z-index'?",
                        "Frontend",
                        "Easy",
                        "Determines the stack order of elements along the z-axis (depth)."),
                new Question(
                        "JS: Difference between null and undefined?",
                        "Frontend",
                        "Medium",
                        "null is an assigned 'empty' value; undefined means a variable has been declared but not yet assigned."),
                new Question(
                        "React: What happens if you update state directly (state.x = 10) instead of setState?",
                        "Frontend",
                        "Easy",
                        "The component will not re-render, as React doesn't detect the change."),
                new Question(
                        "JS: What is the 'Event Delegation' pattern?",
                        "Frontend",
                        "Hard",
                        "Attaching a single event listener to a parent element to manage events for all its children using event bubbling."),
                new Question(
                        "Frontend: What is a PWA?",
                        "Frontend",
                        "Easy",
                        "Progressive Web App—a web app that uses modern APIs to provide an app-like experience (offline, installable)."),
                new Question(
                        "JS: Result of 'Boolean(\"\")'?",
                        "Frontend",
                        "Easy",
                        "false."),
                new Question(
                        "CSS: What is a Pseudo-class?",
                        "Frontend",
                        "Easy",
                        "A keyword added to a selector that specifies a special state of the element (e.g., :hover, :focus)."),
                new Question(
                        "React: What is 'Prop Drilling'?",
                        "Frontend",
                        "Medium",
                        "Passing data through many layers of components that don't need it, just to reach a deep child component."),
                new Question(
                        "JS: What is the 'spread operator' (...)?",
                        "Frontend",
                        "Easy",
                        "Allows an iterable (like an array) to be expanded in places where zero or more arguments or elements are expected."),
                // --- PHASE 2: KAFKA (20) ---
                new Question(
                        "Kafka: What happens if a consumer group has more consumers than partitions?",
                        "Kafka",
                        "Hard",
                        "The extra consumers will remain idle and not receive any messages."),
                new Question(
                        "Kafka: What is a Partition?",
                        "Kafka",
                        "Easy",
                        "A unit of parallelism and scale in a Kafka topic; messages are ordered within a partition."),
                new Question(
                        "Kafka: What is the purpose of 'acks=all'?",
                        "Kafka",
                        "Hard",
                        "Guarantees that the leader and all in-sync replicas have received the message before the producer's request is considered complete."),
                new Question(
                        "Kafka: What is a Consumer Group?",
                        "Kafka",
                        "Medium",
                        "A group of consumers that work together to consume messages from a set of partitions, ensuring each message is processed only once per group."),
                new Question(
                        "Kafka: What is Retries in Producer configuration?",
                        "Kafka",
                        "Easy",
                        "Determines how many times the producer will attempt to re-send a message if the first attempt fails."),
                new Question(
                        "Kafka: What is a Rebalance?",
                        "Kafka",
                        "Medium",
                        "The process where Kafka reassigns partitions among consumers in a group when a member leaves or joins."),
                new Question(
                        "Kafka: What is the default retention period for a topic?",
                        "Kafka",
                        "Medium",
                        "7 days (168 hours)."),
                new Question(
                        "Kafka: What is a Zookeeper's role (in older versions)?",
                        "Kafka",
                        "Medium",
                        "Manages cluster state, controller election, and topic/partition metadata."),
                new Question(
                        "Kafka: Difference between Log Compaction and Deletion?",
                        "Kafka",
                        "Hard",
                        "Compaction keeps the LAST message for each key; Deletion removes segments based on time or size."),
                new Question(
                        "Kafka: What is an Offset?",
                        "Kafka",
                        "Easy",
                        "A unique identifier for a message within a partition, marking its position."),
                new Question(
                        "Kafka: Is Kafka push-based or pull-based for consumers?",
                        "Kafka",
                        "Medium",
                        "Pull-based. Consumers request data from brokers when they are ready."),
                new Question(
                        "Kafka: What is a Producer Idempotence?",
                        "Kafka",
                        "Hard",
                        "Ensures that messages are delivered exactly once to a partition, even if the producer retries due to network issues."),
                new Question(
                        "Kafka: What is the Leader in a partition?",
                        "Kafka",
                        "Easy",
                        "The broker instance that handles all read/write requests for a given partition."),
                new Question(
                        "Kafka: What is an ISR (In-Sync Replica)?",
                        "Kafka",
                        "Medium",
                        "A follower partition that is caught up with the leader's log."),
                new Question(
                        "Kafka: Can you change the number of partitions after topic creation?",
                        "Kafka",
                        "Medium",
                        "Yes, but you cannot decrease the number, only increase it."),
                new Question(
                        "Kafka: What is a Topic?",
                        "Kafka",
                        "Easy",
                        "A logical category or feed name to which records are published."),
                new Question(
                        "Kafka: What is the purpose of 'Bootstrap Servers'?",
                        "Kafka",
                        "Easy",
                        "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster."),
                new Question(
                        "Kafka: What is a Dead Letter Queue (DLQ)?",
                        "Kafka",
                        "Medium",
                        "A topic where messages that fail to be processed by consumers are sent for later investigation."),
                new Question(
                        "Kafka: What is KSQL?",
                        "Kafka",
                        "Medium",
                        "A streaming SQL engine for Kafka that allows processing data in real-time using SQL-like syntax."),
                new Question(
                        "Kafka: What is a Producer Interceptor?",
                        "Kafka",
                        "Hard",
                        "A plugin that allows modifying or inspecting messages before they are sent to the broker."),
                // --- PHASE 2: AWS (30) ---
                new Question(
                        "AWS: Which service is used for scalable block storage?",
                        "AWS",
                        "Easy",
                        "EBS (Elastic Block Store)."),
                new Question(
                        "AWS: What is S3?",
                        "AWS",
                        "Easy",
                        "Simple Storage Service—an object storage service providing industry-leading scalability and data availability."),
                new Question(
                        "AWS: In IAM, what is the 'Principle of Least Privilege'?",
                        "AWS",
                        "Medium",
                        "Granting only the permissions required to perform a task and no more."),
                new Question(
                        "AWS: What is a VPC?",
                        "AWS",
                        "Medium",
                        "Virtual Private Cloud—a logically isolated section of the AWS Cloud where you can launch resources."),
                new Question(
                        "AWS: Difference between EC2 and Lambda?",
                        "AWS",
                        "Medium",
                        "EC2 provides virtual servers (IaaS); Lambda is serverless (FaaS) and runs code in response to events."),
                new Question(
                        "AWS: Which service is used for managed relational databases?",
                        "AWS",
                        "Easy",
                        "RDS (Relational Database Service)."),
                new Question(
                        "AWS: What is an IAM Role?",
                        "AWS",
                        "Medium",
                        "An identity that you can create in your account that has specific permissions, which can be assumed by users or services."),
                new Question(
                        "AWS: What is the purpose of CloudFront?",
                        "AWS",
                        "Medium",
                        "A fast content delivery network (CDN) service that securely delivers data to users with low latency."),
                new Question(
                        "AWS: What is Auto Scaling?",
                        "AWS",
                        "Easy",
                        "Automatically adjusting the number of EC2 instances to maintain performance and optimize costs."),
                new Question(
                        "AWS: Which service provides serverless NoSQL databases?",
                        "AWS",
                        "Easy",
                        "DynamoDB."),
                new Question(
                        "AWS: What is a Region vs an Availability Zone?",
                        "AWS",
                        "Medium",
                        "A Region is a geographic area. An Availability Zone is one or more discrete data centers within a Region."),
                new Question(
                        "AWS: Which service is used to monitor AWS resources?",
                        "AWS",
                        "Easy",
                        "CloudWatch."),
                new Question(
                        "AWS: What is the purpose of CloudTrail?",
                        "AWS",
                        "Medium",
                        "Tracks user activity and API usage across your AWS infrastructure for auditing and security."),
                new Question(
                        "AWS: What is ElastiCache used for?",
                        "AWS",
                        "Medium",
                        "A fully managed, in-memory caching service supporting Redis or Memcached."),
                new Question(
                        "AWS: What is a Security Group?",
                        "AWS",
                        "Medium",
                        "A virtual firewall for your EC2 instances to control incoming and outgoing traffic."),
                new Question(
                        "AWS: What is Route 53?",
                        "AWS",
                        "Easy",
                        "A highly available and scalable cloud Domain Name System (DNS) web service."),
                new Question(
                        "AWS: Which service is used for serverless container execution?",
                        "AWS",
                        "Medium",
                        "AWS Fargate."),
                new Question(
                        "AWS: What is an AWS Lambda Trigger?",
                        "AWS",
                        "Easy",
                        "An AWS service or resource that invokes your Lambda function (e.g., S3 upload, SNS message)."),
                new Question(
                        "AWS: What is an Elastic IP address?",
                        "AWS",
                        "Medium",
                        "A static IPv4 address designed for dynamic cloud computing, which you can mask the failure of an instance."),
                new Question(
                        "AWS: Which service is used for simple notification/messaging?",
                        "AWS",
                        "Easy",
                        "SNS (Simple Notification Service)."),
                new Question(
                        "AWS: Which service is used for message queuing?",
                        "AWS",
                        "Easy",
                        "SQS (Simple Queue Service)."),
                new Question(
                        "AWS: What is the purpose of an Internet Gateway?",
                        "AWS",
                        "Hard",
                        "Allows communication between your VPC and the internet."),
                new Question(
                        "AWS: What is VPC Peering?",
                        "AWS",
                        "Hard",
                        "Connecting two VPCs so you can route traffic between them using private IP addresses."),
                new Question(
                        "AWS: Which service provides a managed Hadoop framework?",
                        "AWS",
                        "Medium",
                        "EMR (Elastic MapReduce)."),
                new Question(
                        "AWS: What is the difference between S3 Standard and Glacier?",
                        "AWS",
                        "Easy",
                        "Standard is for frequently accessed data; Glacier is low-cost storage for long-term archival."),
                new Question(
                        "AWS: What is an AMI?",
                        "AWS",
                        "Medium",
                        "Amazon Machine Image—a template that contains the software configuration (OS, app server) to launch an instance."),
                new Question(
                        "AWS: Which service provides private connections from on-premises to AWS?",
                        "AWS",
                        "Hard",
                        "AWS Direct Connect."),
                new Question(
                        "AWS: What is a NAT Gateway?",
                        "AWS",
                        "Hard",
                        "Allows instances in a private subnet to connect to the internet while preventing the internet from initiating connections."),
                new Question(
                        "AWS: Which service is used to manage encryption keys?",
                        "AWS",
                        "Easy",
                        "KMS (Key Management Service)."),
                new Question(
                        "AWS: What is the AWS Shared Responsibility Model?",
                        "AWS",
                        "Medium",
                        "AWS is responsible for 'Security OF the Cloud'; the customer is responsible for 'Security IN the Cloud'."),
                // --- PHASE 3: ONE STOP SOLUTION DEEP DIVE (NEW BATCH) ---
                new Question(
                        "Explain the difference between JRE, JDK, and JVM.",
                        "Java",
                        "Easy",
                        "JVM executes the bytecode, JRE provides the libraries and JVM to run programs, and JDK is the full development kit including JRE and tools like compiler (javac)."),
                new Question(
                        "What are the different memory regions in JVM?",
                        "Java",
                        "Hard",
                        "The primary regions are Heap (objects), Stack (local variables/frames), Metaspace (class metadata), Code Cache (JIT compiled code), and PC Registers."),
                new Question(
                        "Why is String immutable in Java?",
                        "Java",
                        "Medium",
                        "Immutability provides security (parameters don't change), thread-safety, allows String Pool caching for memory efficiency, and ensures hashCode doesn't change."),
                new Question(
                        "What is the difference between Abstraction and Encapsulation?",
                        "OOP",
                        "Medium",
                        "Abstraction hides the implementation details and shows only functionality, while Encapsulation binds the data and code together into a single unit (hiding data)."),
                new Question(
                        "Explain the 'Diamond Problem' in Multiple Inheritance.",
                        "OOP",
                        "Medium",
                        "It occurs when a class extends two classes that both have a method with the same signature. Java avoids this by not supporting multiple inheritance of classes, but allows it through interfaces with default methods (requiring manual resolution)."),
                new Question(
                        "What is the difference between Composition and Inheritance?",
                        "OOP",
                        "Medium",
                        "Inheritance is an 'is-a' relationship (tightly coupled), while Composition is a 'has-a' relationship (loosely coupled). Composition is generally preferred for better flexibility."),
                new Question(
                        "What is the contract between hashCode() and equals()?",
                        "Java",
                        "Hard",
                        "If two objects are equal according to equals(), they must have the same hashCode. However, two objects with the same hashCode are not necessarily equal."),
                new Question(
                        "Explain the Singleton Design Pattern.",
                        "OOP Patterns",
                        "Medium",
                        "It ensures a class has only one instance and provides a global point of access to it. It's often implemented with a private constructor and a static getInstance method."),
                new Question(
                        "What is a Fail-Fast vs Fail-Safe Iterator?",
                        "Java Collections",
                        "Hard",
                        "Fail-fast iterators (ArrayList/HashMap) throw ConcurrentModificationException if the collection is modified during iteration. Fail-safe iterators (CopyOnWriteArrayList) work on a copy and avoid this."),
                new Question(
                        "Explain the difference between ArrayList and Vector.",
                        "Java Collections",
                        "Easy",
                        "ArrayList is not synchronized and is faster, while Vector is synchronized (thread-safe) but slower due to locking overhead."),
                new Question(
                        "What is a Deadlock and how can you prevent it?",
                        "Multithreading",
                        "Hard",
                        "A situation where two threads wait for each other to release locks. Prevention involves consistent lock ordering, avoiding nested locks, or using timed lock attempts."),
                new Question(
                        "What is the purpose of the 'volatile' keyword?",
                        "Multithreading",
                        "Hard",
                        "It ensures that a variable's value is always read from and written to main memory, ensuring visibility of changes across multiple threads."),
                new Question(
                        "Explain the difference between wait/notify and await/signal.",
                        "Multithreading",
                        "Hard",
                        "wait/notify are low-level methods in the Object class used with synchronized blocks. await/signal are part of the Condition interface used with explicit ReentrantLocks for finer control."),
                new Question(
                        "What is the 'N+1' problem in Hibernate?",
                        "Database",
                        "Hard",
                        "It occurs when fetching a list of entities causes one query for the list and then N additional queries for associated data (lazy loading). Solve with JOIN FETCH or EntityGraphs."),
                new Question(
                        "What are ACID properties in a database?",
                        "Database",
                        "Medium",
                        "Atomicity (all or nothing), Consistency (valid state), Isolation (independent transactions), and Durability (permanence)."),
                new Question(
                        "Explain the difference between TDD and BDD.",
                        "Testing",
                        "Medium",
                        "TDD (Test Driven Development) focuses on technical implementation through small unit tests. BDD (Behavior Driven Development) focuses on user stories and behavior from a business perspective."),
                new Question(
                        "What is Mocking vs Spying in Mockito?",
                        "Testing",
                        "Medium",
                        "Mocking creates a completely fake object where all behavior must be stubbed. Spying wraps a real object, allowing you to track interactions and stub only specific methods."),
                new Question(
                        "What is Git Rebase vs Git Merge?",
                        "Git",
                        "Medium",
                        "Merge combines two branches with a new 'merge commit', preserving history. Rebase reapplies commits on top of another branch, creating a linear history (but rewriting it)."),
                new Question(
                        "What is the purpose of the .gitignore file?",
                        "Git",
                        "Easy",
                        "It specifies patterns for files and directories that Git should ignore (e.g., target, node_modules, log files)."),
                new Question(
                        "Explain the difference between Scrum and Kanban.",
                        "Agile",
                        "Medium",
                        "Scrum uses fixed-length 'Sprints' with specific roles. Kanban is a continuous flow system focused on visualizing work and limiting 'Work in Progress' (WIP)."),
                // --- PHASE 4: THE BIG EXPANSION (80+ Questions) ---
                new Question(
                        "How is the 'Write Once, Run Anywhere' principle achieved in Java?",
                        "Java",
                        "Easy",
                        "By compiling source code into platform-independent bytecode (.class), which can run on any JVM tailored for the specific operating system."),
                new Question(
                        "What are the main areas of memory provided by the JVM?",
                        "Java",
                        "Hard",
                        "Heap (objects), Stack (method execution), Method Area (metadata), PC Registers, and Native Method Stacks."),
                new Question(
                        "Explain the role of the JIT Compiler in the JVM.",
                        "Java",
                        "Hard",
                        "Just-In-Time compiler optimizes performance by compiling frequently executed bytecode (hot spots) into native machine code at runtime."),
                new Question(
                        "What is the difference between float and double in Java?",
                        "Java",
                        "Easy",
                        "float is a 32-bit single-precision type (needs 'f' suffix), while double is a 64-bit double-precision type (default for decimals)."),
                new Question(
                        "What is the range of a 'byte' data type in Java?",
                        "Java",
                        "Easy",
                        "-128 to 127."),
                new Question(
                        "What does the 'instanceof' operator do?",
                        "Java",
                        "Easy",
                        "It checks if an object is an instance of a particular class or interface at runtime."),
                new Question(
                        "What is the 'String Pool' and where is it located?",
                        "Java",
                        "Medium",
                        "A cache of String objects stored in the Heap (specifically in Metaspace/PermGen in older versions, now in the main Heap) to optimize memory."),
                new Question(
                        "Explain the 'ternary operator' with an example.",
                        "Java",
                        "Easy",
                        "A shorthand for if-else: 'condition ? valueIfTrue : valueIfFalse;'. Example: 'int max = (a > b) ? a : b;'"),
                new Question(
                        "What is the difference between a while and a do-while loop?",
                        "Java",
                        "Easy",
                        "while checks the condition before the first iteration; do-while executes the block at least once before checking the condition."),
                new Question(
                        "What is Autoboxing and Unboxing?",
                        "Java",
                        "Easy",
                        "Autoboxing is the automatic conversion of primitives to their wrapper objects (int to Integer); Unboxing is the reverse."),
                new Question(
                        "Explain the 'this' keyword and its common uses.",
                        "Java",
                        "Medium",
                        "Refers to the current object instance. Used to differentiate between fields and parameters, invoke other constructors (this()), or pass the current object to methods."),
                new Question(
                        "Explain the 'super' keyword and its common uses.",
                        "Java",
                        "Medium",
                        "Refers to the parent class object. Used to call parent constructors (super()), invoke parent methods, or access parent fields."),
                new Question(
                        "Can a 'static' method access 'non-static' variables? Why?",
                        "Java",
                        "Medium",
                        "No, because static methods belong to the class and are resolved at compile time, while non-static variables depend on an object instance that might not exist."),
                new Question(
                        "What is the purpose of the 'static' block in Java?",
                        "Java",
                        "Medium",
                        "Used for initializing static variables when the class is first loaded into memory by the JVM."),
                new Question(
                        "What is the difference between final, finally, and finalize?",
                        "Java",
                        "Medium",
                        "final is a modifier (constant/no-override/no-inherit), finally is a block for cleanup in try-catch, and finalize is a method (deprecated) called by GC before object destruction."),
                new Question(
                        "How does the JVM identify unreachable objects for Garbage Collection?",
                        "Java",
                        "Hard",
                        "Using reachability analysis, often starting from 'GC Roots' (stack variables, static fields) and tracing all reachable object references."),
                new Question(
                        "What is the difference between Serialization and Externalization?",
                        "Java",
                        "Hard",
                        "Serialization is automatic (marker interface); Externalization (Externalizable) requires the developer to manually implement writeExternal and readExternal for complete control."),
                new Question(
                        "What is Type Erasure in Java Generics?",
                        "Java",
                        "Hard",
                        "The process where the compiler removes generic type information during compilation to ensure backward compatibility with older Java versions."),
                new Question(
                        "What are wildcards in Generics? (Unbounded, Upper Bounded, Lower Bounded)",
                        "Java",
                        "Hard",
                        "<?> accepts any type; <? extends T> accepts T or its subclasses (upper bound); <? super T> accepts T or its superclasses (lower bound)."),
                new Question(
                        "Explain the 'Default Method' in Java 8 interfaces.",
                        "Java 8",
                        "Medium",
                        "A method with a body in an interface (marked 'default') that allows evolving interfaces without breaking existing implementations."),
                new Question(
                        "What is a 'Method Reference' in Java 8?",
                        "Java 8",
                        "Medium",
                        "A shorthand for a lambda expression that calling a specific method (e.g., System.out::println)."),
                new Question(
                        "Difference between 'flatMap' and 'map' in Java Streams?",
                        "Java 8",
                        "Medium",
                        "map transforms each element; flatMap transforms each element into a stream and flattens all resulting streams into one."),
                new Question(
                        "What is the 'Optional' class and why was it introduced?",
                        "Java 8",
                        "Medium",
                        "A container to represent optional values, introduced to reduce the frequency of NullPointerExceptions."),
                new Question(
                        "Explain the 'Collector' interface in Java Streams.",
                        "Java 8",
                        "Medium",
                        "A terminal operation that accumulates stream elements into a final result (like a List, Set, or Map)."),
                new Question(
                        "Difference between LocalDate and LocalDateTime?",
                        "Java 8",
                        "Easy",
                        "LocalDate stores only date (YYYY-MM-DD); LocalDateTime stores both date and time (no timezone)."),
                new Question(
                        "What are Method Access Modifiers? (Public, Private, Protected, Default)",
                        "OOP",
                        "Easy",
                        "Public (anywhere), Private (this class), Protected (same package + subclasses), Default (same package only)."),
                new Question(
                        "What is 'Composition' and why is it often better than 'Inheritance'?",
                        "OOP",
                        "Medium",
                        "Composition ('has-a') is more flexible and maintains loose coupling, whereas Inheritance ('is-a') creates a rigid, tightly coupled hierarchy."),
                new Question(
                        "Can we override a 'private' or 'static' method?",
                        "OOP",
                        "Medium",
                        "No. Private methods aren't visible to subclasses, and static methods are bound to the class at compile time (hiding occurs, not overriding)."),
                new Question(
                        "What is the difference between 'Error' and 'Exception' in Java?",
                        "Java",
                        "Medium",
                        "Exceptions are conditions that an application might want to catch (checked or unchecked). Errors are serious problems (like OutOfMemoryError) that an application should not try to catch."),
                new Question(
                        "Explain the hierarchy of the 'Throwable' class.",
                        "Java",
                        "Medium",
                        "Throwable is the root class for all errors and exceptions. Its two main subclasses are Error and Exception."),
                new Question(
                        "What is a 'Checked Exception' vs an 'Unchecked Exception'?",
                        "Java",
                        "Easy",
                        "Checked exceptions are checked at compile-time (e.g., IOException). Unchecked (Runtime) exceptions are checked at runtime (e.g., NullPointerException)."),
                new Question(
                        "What is 'try-with-resources' in Java 7+?",
                        "Java",
                        "Medium",
                        "A try statement that declares one or more resources (like a BufferedReader) which are automatically closed at the end of the statement."),
                new Question(
                        "Explain the internal working of a 'HashMap'.",
                        "Java",
                        "Hard",
                        "It uses an array of buckets and hashing to store key-value pairs. In case of collisions, it uses a linked list, which converts to a red-black tree (since Java 8) if the bucket exceeds a threshold."),
                new Question(
                        "What is the default initial capacity and load factor of a HashMap?",
                        "Java",
                        "Medium",
                        "Initial capacity is 16, and the default load factor is 0.75."),
                new Question(
                        "Difference between 'ArrayList' and 'LinkedList'?",
                        "Java",
                        "Easy",
                        "ArrayList uses a dynamic array (faster for random access); LinkedList uses a doubly linked list (faster for insertions/deletions at the ends)."),
                new Question(
                        "What is 'Fail-fast' vs 'Fail-safe' iterator?",
                        "Java",
                        "Hard",
                        "Fail-fast iterators (ArrayList) throw ConcurrentModificationException if the collection is modified during iteration. Fail-safe iterators (ConcurrentHashMap) work on a copy and don't throw an exception."),
                new Question(
                        "What is 'ConcurrentHashMap' and how does it achieve thread safety?",
                        "Java",
                        "Hard",
                        "A thread-safe version of HashMap that uses bucket-level locking (or CAS operations in modern Java) to allow multiple threads to read and write concurrently without locking the whole map."),
                new Question(
                        "What is 'CopyOnWriteArrayList'?",
                        "Java",
                        "Hard",
                        "A thread-safe variant of ArrayList where all mutative operations (add, set) are implemented by creating a fresh copy of the underlying array."),
                new Question(
                        "Difference between 'Set' and 'List' interfaces?",
                        "Java",
                        "Easy",
                        "List maintains insertion order and allows duplicates. Set does not allow duplicates and may or may not maintain order."),
                new Question(
                        "What is a 'PriorityQueue' in Java?",
                        "Java",
                        "Medium",
                        "A queue where elements are ordered according to their natural ordering or by a specified Comparator."),
                new Question(
                        "Explain 'Comparable' vs 'Comparator'.",
                        "Java",
                        "Medium",
                        "Comparable is used for natural sorting of a class (int compareTo()). Comparator is used for custom sorting (int compare(T o1, T o2))."),
                new Question(
                        "What is a 'Daemon Thread' in Java?",
                        "Java",
                        "Medium",
                        "A low-priority thread that runs in the background to perform tasks like garbage collection. It does not prevent the JVM from exiting."),
                new Question(
                        "Explain the Lifecycle of a Thread in Java.",
                        "Java",
                        "Medium",
                        "New, Runnable, Blocked, Waiting, Timed Waiting, and Terminated."),
                new Question(
                        "What is the 'synchronized' keyword used for?",
                        "Java",
                        "Medium",
                        "To ensure that only one thread can execute a block of code or a method at a time on a shared resource."),
                new Question(
                        "What is a 'Deadlock' and how to avoid it?",
                        "Java",
                        "Hard",
                        "A situation where two or more threads are blocked forever, waiting for each other. Avoid it by acquiring locks in a consistent order."),
                new Question(
                        "What is the 'volatile' keyword?",
                        "Java",
                        "Hard",
                        "Ensures that a variable's value is always read from and written to main memory, making it visible across all threads immediately."),
                new Question(
                        "Explain 'Wait' vs 'Sleep' in threading.",
                        "Java",
                        "Hard",
                        "sleep() is a static method of Thread (does not release lock). wait() is a method of Object (releases lock and must be called inside a synchronized block)."),
                new Question(
                        "What is the 'ExecutorService' interface?",
                        "Java",
                        "Medium",
                        "A higher-level replacement for working directly with threads, providing features like thread pooling and task scheduling."),
                new Question(
                        "Difference between 'Callable' and 'Runnable'?",
                        "Java",
                        "Medium",
                        "Runnable's run() does not return a result and cannot throw checked exceptions. Callable's call() returns a result and can throw checked exceptions."),
                new Question(
                        "What are Inner Classes in Java?",
                        "Java",
                        "Medium",
                        "Classes defined within another class. Types include Member Inner Class, Static Nested Class, Local Inner Class, and Anonymous Inner Class."),
                new Question(
                        "What is the 'Record' keyword (introduced in Java 14/16)?",
                        "Java",
                        "Medium",
                        "A special kind of class used to model immutable data with less boilerplate code (automatically provides getters, equals, hashCode, and toString)."),
                new Question(
                        "What are 'Sealed Classes' (Java 15/17)?",
                        "Java",
                        "Hard",
                        "Classes or interfaces that restrict which other classes or interfaces may extend or implement them."),
                new Question(
                        "Explain the 'Module System' (Project Jigsaw) in Java 9.",
                        "Java",
                        "Hard",
                        "A mechanism to bundle Java packages into modules, specifying which packages are exported and which modules are required."),
                new Question(
                        "What is the 'Mark-Sweep-Compact' algorithm in Garbage Collection?",
                        "Java",
                        "Hard",
                        "A strategy where GC marks reachable objects, sweeps away unreachable ones, and then compacts the remaining objects to one end of the heap."),
                new Question(
                        "What is the 'G1' (Garbage First) collector?",
                        "Java",
                        "Hard",
                        "A server-style garbage collector that divides the heap into regions and prioritizes collecting regions with the most garbage."),
                new Question(
                        "What is the 'Metaspace' in Java 8+?",
                        "Java",
                        "Hard",
                        "The replacement for PermGen that stores class metadata in native memory instead of the JVM heap."),
                new Question(
                        "What is the purpose of '@FunctionalInterface' annotation?",
                        "Java 8",
                        "Easy",
                        "To ensure an interface has exactly one abstract method, making it eligible for use in lambda expressions."),
                new Question(
                        "What are 'Functional Interfaces' provided by Java 8 (Predicate, Consumer, Supplier, Function)?",
                        "Java 8",
                        "Medium",
                        "Predicate (boolean test(T)), Consumer (void accept(T)), Supplier (T get()), Function (R apply(T))."),
                new Question(
                        "How do you handle 'Multiple Inheritance' issues with default methods in Java 8?",
                        "Java 8",
                        "Hard",
                        "If a class implements two interfaces with the same default method signature, the compiler forces the class to override and manually resolve the ambiguity."),
                new Question(
                        "What is the 'Diamond Problem' in Java?",
                        "OOP",
                        "Medium",
                        "Ambiguity arising from multiple inheritance of classes (not supported in Java). Java 8 handles this in interfaces by requiring manual resolution if two defaults clash."),
                new Question(
                        "Explain Method Overloading vs Method Overriding.",
                        "OOP",
                        "Medium",
                        "Overloading (Compile-time): Same name, different parameters in the same class. Overriding (Runtime): Same name/parameters in a subclass."),
                new Question(
                        "What is an 'Abstract Class' vs an 'Interface'?",
                        "OOP",
                        "Medium",
                        "Abstract classes can have state and constructors; Interfaces define a contract (and since Java 8, default/static behavior). A class extends one class but can implement many interfaces."),
                new Question(
                        "What is the 'Prototype' scope in Spring?",
                        "Spring Boot",
                        "Easy",
                        "A new bean instance is created every time it is requested from the Spring container."),
                new Question(
                        "Explain '@ConditionalOnProperty' in Spring Boot.",
                        "Spring Boot",
                        "Medium",
                        "An annotation that enables a configuration or bean only if a specific property is present and has a specific value in the environment."),
                new Question(
                        "How does '@SpringBootApplication' work?",
                        "Spring Boot",
                        "Medium",
                        "It's a convenience annotation that combines @Configuration, @EnableAutoConfiguration, and @ComponentScan."),
                new Question(
                        "What is the difference between '@Component', '@Service', and '@Repository'?",
                        "Spring Boot",
                        "Easy",
                        "All are @Component; @Service is for business logic, and @Repository provides automatic persistence-layer exception translation."),
                new Question(
                        "What is the purpose of 'spring-boot-starter-parent'?",
                        "Spring Boot",
                        "Medium",
                        "Provides default configurations, resource filtering, and dependency management (versions) for Spring Boot applications."),
                new Question(
                        "How do you handle 'CORS' in a Spring Boot application?",
                        "Spring Boot",
                        "Medium",
                        "Using the @CrossOrigin annotation on controllers or by defining a WebMvcConfigurer bean for global configuration."),
                new Question(
                        "What is 'Actuator' in Spring Boot used for?",
                        "Spring Boot",
                        "Easy",
                        "Monitoring and managing the application via HTTP or JMX endpoints (e.g., /health, /metrics)."),
                new Question(
                        "Difference between application.properties and application.yml?",
                        "Spring Boot",
                        "Easy",
                        "Properties uses key-value pairs; YAML uses an indented, hierarchical structure that is often more readable for complex configs."),
                new Question(
                        "What is 'Profiles' in Spring Boot used for?",
                        "Spring Boot",
                        "Easy",
                        "To segregate parts of your application configuration and make it only available in certain environments (e.g., dev, test, prod)."),
                new Question(
                        "Explain '@MockBean' in Spring Boot testing.",
                        "Spring Boot",
                        "Medium",
                        "Replaces a bean in the Spring ApplicationContext with a Mockito mock during testing."),
                new Question(
                        "What is a 'ResponseEntity' in Spring controllers?",
                        "Spring Boot",
                        "Easy",
                        "An object representing the whole HTTP response (status, headers, and body), allowing full control over the response details."),
                new Question(
                        "How do you perform 'Input Validation' in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "Using Bean Validation (Hibernate Validator) via @Valid or @Validated annotations on controller parameters and @NotNull/@Size constraints on DTOs."),
                new Question(
                        "What is the 'N+1 problem' in Hibernate?",
                        "Database",
                        "Hard",
                        "Occurs when fetching a parent entities results in one query for the parents and then N additional queries for each parent's children (due to lazy loading)."),
                new Question(
                        "How do you solve the N+1 problem?",
                        "Database",
                        "Hard",
                        "Using 'JOIN FETCH' in JPQL, @EntityGraph, or Batch Fetching."),
                new Question(
                        "What is '@Query' annotation used for?",
                        "Spring Boot",
                        "Easy",
                        "To define custom SQL or JPQL queries directly in Spring Data JPA repository methods."),
                new Question(
                        "Difference between 'fetch = FetchType.LAZY' and 'FetchType.EAGER'?",
                        "Database",
                        "Medium",
                        "LAZY loads the related entity only when accessed; EAGER loads it immediately when the parent is loaded."),
                new Question(
                        "What is '@Cacheable' annotation?",
                        "Spring Boot",
                        "Easy",
                        "Tells Spring to store the method result in a cache so subsequent calls with the same parameters return the cached value without executing the method."),
                new Question(
                        "What is 'Database Migration' and which tool is popular with Spring Boot?",
                        "Database",
                        "Medium",
                        "Managing database schema changes over time. Flyway and Liquibase are the most popular tools."),
                new Question(
                        "What is 'Distributed Tracing' in microservices?",
                        "Microservices",
                        "Medium",
                        "Tracing a request as it travels through various microservices using unique IDs (TraceID, SpanID)."),
                new Question(
                        "Explain 'Service Discovery' with an example (e.g., Eureka).",
                        "Microservices",
                        "Medium",
                        "A registration center where each microservice registers its network location so other services can find it dynamically."),
                new Question(
                        "What is an 'API Gateway' (e.g., Spring Cloud Gateway)?",
                        "Microservices",
                        "Medium",
                        "A single entry point for all client requests, handling routing, security, and rate limiting."),
                new Question(
                        "What is the 'Circuit Breaker' pattern?",
                        "Microservices",
                        "Hard",
                        "Prevents a service from making calls to a failing dependency, providing a fallback instead, to stop cascading failures."),
                new Question(
                        "Difference between 'Config Server' and 'Local Config'?",
                        "Microservices",
                        "Medium",
                        "Config Server centralizes configurations for all microservices (often in a Git repo), allowing updates without service restarts."),
                new Question(
                        "What is 'Hystrix' or 'Resilience4j' used for?",
                        "Microservices",
                        "Medium",
                        "Fault tolerance libraries implementing patterns like Circuit Breaker, bulkhead, and retry."),
                new Question(
                        "Explain the 'Broker-based' vs 'Direct' communication in microservices.",
                        "Microservices",
                        "Medium",
                        "Direct uses HTTP/REST (synchronous); Broker-based uses Kafka/RabbitMQ (asynchronous/decoupled)."),
                new Question(
                        "What is '@KafkaListener' in Spring Kafka?",
                        "Kafka",
                        "Easy",
                        "An annotation to define a method as a message listener for a specific Kafka topic."),
                new Question(
                        "What is a 'Consumer Group' in Kafka?",
                        "Kafka",
                        "Medium",
                        "A group of consumers that cooperate to consume data from one or more topics, ensuring each partition is assigned to only one consumer in the group."),
                new Question(
                        "What is 'Rebalance' in Kafka?",
                        "Kafka",
                        "Hard",
                        "The process where Kafka redistributes partition ownership among consumers in a group when a consumer joins or leaves."),
                new Question(
                        "What is 'Zookeeper' used for in older Kafka versions?",
                        "Kafka",
                        "Medium",
                        "Managing cluster metadata, leader election, and consumer offset tracking (modern Kafka handles this internally)."),
                new Question(
                        "Difference between 'At-most-once', 'At-least-once', and 'Exactly-once' in Kafka?",
                        "Kafka",
                        "Hard",
                        "At-most-once (msg may be lost); At-least-once (msg never lost, but may repeat); Exactly-once (delivered once and only once via transactions)."),
                new Question(
                        "What is a 'Topic' vs a 'Partition' in Kafka?",
                        "Kafka",
                        "Easy",
                        "A Topic is a logical category; a Partition is a physical log used for parallelism and scaling within a topic."),
                new Question(
                        "How do you secure a Kafka topic?",
                        "Kafka",
                        "Hard",
                        "Using SSL for encryption, SASL for authentication (JAAS), and ACLs (Access Control Lists) for authorization."),
                new Question(
                        "What is 'KStream' in Kafka?",
                        "Kafka",
                        "Hard",
                        "An abstraction for a stream of records that allows real-time processing, filtering, and joining within Kafka."),
                new Question(
                        "Explain 'Message Key' and its importance in Kafka partitions.",
                        "Kafka",
                        "Medium",
                        "Kafka uses the message key to determine the partition. Messages with the same key always go to the same partition, ensuring ordering."),
                new Question(
                        "What is 'Retention Policy' in Kafka?",
                        "Kafka",
                        "Easy",
                        "The rule that determines how long Kafka keeps messages (e.g., 7 days or 1GB) before deleting them."),
                new Question(
                        "What is 'Dead Letter Queue' (DLQ) in Kafka?",
                        "Kafka",
                        "Medium",
                        "A dedicated topic where messages that failed to be processed are sent for further inspection."),
                new Question(
                        "Difference between 'git merge' and 'git rebase'?",
                        "Git",
                        "Medium",
                        "Merge keeps the history of both branches and creates a merge commit; Rebase moves your changes to the tip of the target branch for a linear history."),
                new Question(
                        "What is 'git stash' used for?",
                        "Git",
                        "Easy",
                        "Temporarily saving uncommitted changes to work on a different branch without losing your progress."),
                new Question(
                        "Explain 'git cherry-pick'.",
                        "Git",
                        "Medium",
                        "Applying a specific commit from one branch to another branch."),
                new Question(
                        "What is a 'Pull Request'? (PR)",
                        "Git",
                        "Easy",
                        "A request to merge code changes from one branch into another, allowing for code review and discussion."),
                new Question(
                        "What is 'git fetch' vs 'git pull'?",
                        "Git",
                        "Easy",
                        "Fetch updates local tracking branches from the remote; Pull does a fetch AND a merge into the current branch."),
                new Question(
                        "Explain 'git reset' vs 'git revert'.",
                        "Git",
                        "Medium",
                        "Reset moves the branch pointer back (reverses history); Revert creates a new commit that undoes the changes of a specific commit (preserves history)."),
                new Question(
                        "What is 'Unit Testing'?",
                        "Testing",
                        "Easy",
                        "Testing individual components (methods/classes) in isolation from the rest of the system."),
                new Question(
                        "Explain 'Integration Testing' in Spring Boot.",
                        "Testing",
                        "Medium",
                        "Testing how multiple components work together, often using @SpringBootTest to load the full application context."),
                new Question(
                        "What is 'Regression Testing'?",
                        "Testing",
                        "Easy",
                        "Rerunning tests to ensure that new code changes haven't broken existing functionality."),
                new Question(
                        "Difference between '@Test' and '@BeforeEach' in JUnit 5?",
                        "Testing",
                        "Easy",
                        "@Test marks a method as a test case; @BeforeEach runs before every test method in the class for setup."),
                new Question(
                        "What is 'Code Coverage' and why is it important?",
                        "Testing",
                        "Medium",
                        "The percentage of code executed by tests. It helps identify untested areas, but 100% doesn't guarantee quality."),
                new Question(
                        "Explain 'Test Driven Development' (TDD).",
                        "Testing",
                        "Medium",
                        "A process of writing a failing test first, then writing the minimum code to pass it, and finally refactoring."),
                new Question(
                        "What is 'Behavior Driven Development' (BDD)?",
                        "Testing",
                        "Medium",
                        "An extension of TDD that focuses on user stories and expected behavior (Given-When-Then), often using tools like Cucumber."),
                new Question(
                        "What is 'Mocking'? Why do we use it?",
                        "Testing",
                        "Easy",
                        "Creating dummy versions of dependencies (using Mockito) to isolate the unit being tested and avoid side effects."),
                new Question(
                        "Explain the 'Assert' class in JUnit.",
                        "Testing",
                        "Easy",
                        "Provides static methods (e.g., assertEquals, assertTrue) to verify that the actual test result matches the expected result."),
                new Question(
                        "What is 'Smoke Testing'?",
                        "Testing",
                        "Easy",
                        "High-level testing to ensure the most critical functions of an application work after a build or deployment."),

                // --- NEW COMPANY TAGGED QUESTIONS (POLISH) ---
                new Question(
                        "How would you design a rate limiter for Zomato's checkout API?",
                        "System Design",
                        "Hard",
                        "Use Token Bucket or Leaky Bucket algorithm with Redis to track requests per minute per userId.",
                        "Zomato"
                ),
                new Question(
                        "Explain the difference between Optimistic and Pessimistic locking in a high-concurrency app like Swiggy.",
                        "Database",
                        "Medium",
                        "Optimistic locking uses a version field and is preferred for rare collisions. Pessimistic locking locks the row, ensuring data consistency for frequent updates.",
                        "Swiggy"
                ),
                new Question(
                        "Write a Java function to find the first non-repeating character in a stream of characters (Uber coding round).",
                        "Coding",
                        "Medium",
                        "public class Solution {\n    public static char firstUnique(String s) {\n        int[] counts = new int[256];\n        for(char c : s.toCharArray()) counts[c]++;\n        for(char c : s.toCharArray()) if(counts[c] == 1) return c;\n        return '\\0';\n    }\n}",
                        "CODE",
                        null,
                        "Uber"
                ),
                new Question(
                        "Explain @Scope('prototype') in Spring with a real-world use case for Flipkart's shopping cart.",
                        "Spring Boot",
                        "Medium",
                        "Prototype scope creates a new instance every time a bean is requested. Used for stateful cart objects that shouldn't be shared across users.",
                        "Flipkart"
                ),
                new Question(
                        "How do you handle double payment issues in digital wallets like Paytm?",
                        "Security",
                        "Hard",
                        "Idempotency keys! Each transaction request must have a unique key so retries don't trigger duplicate deductions.",
                        "Paytm"
                ),
                new Question(
                        "What is the time complexity of searching an element in a HashMap in the worst case (Java 8+)?",
                        "Java",
                        "Medium",
                        "O(log n) because bins are converted to Balanced Trees when they exceed 8 elements.",
                        "PhonePe"
                ),
                new Question(
                        "Explain how Zookeeper is used in Distributed Systems (Swiggy infrastructure).",
                        "Infrastructure",
                        "Hard",
                        "Used for service discovery, configuration management, and leader election for Kafka or internal microservices.",
                        "Swiggy"
                ),
                new Question(
                        "Compare Kafka and RabbitMQ for real-time delivery tracking at Zomato.",
                        "System Design",
                        "Hard",
                        "Kafka is better for high-throughput log-based events (replayable). RabbitMQ is better for complex routing and priority queues.",
                        "Zomato"
                ),
                new Question(
                        "Why is immutability preferred for concurrent applications at CRED?",
                        "Java",
                        "Medium",
                        "Immutable objects are thread-safe by design, eliminating synchronization overhead and hidden state mutation bugs.",
                        "CRED"
                ),
                new Question(
                        "How would you implement a simple LRU Cache in Java (Flipkart interview)?",
                        "Coding",
                        "Hard",
                        "public class LRU {\n    // Use LinkedHashMap with accessOrder=true\n    // and override removeEldestEntry to return true when size > capacity\n}",
                        "CODE",
                        null,
                        "Flipkart"
                ),
                new Question(
                        "What is the difference between @Autowired and @Inject?",
                        "Spring Boot",
                        "Easy",
                        "@Autowired is Spring-specific; @Inject is standard (JSR-330). Both achieve constructor/field injection.",
                        "Swiggy"
                ),
                new Question(
                        "Explain 'Fail-Fast' vs 'Fail-Safe' iterators with examples.",
                        "Java",
                        "Medium",
                        "Fail-fast (ArrayList) throws ConcurrentModificationException if modified. Fail-safe (CopyOnWriteArrayList) works on a clone.",
                        "PhonePe"
                ),
                new Question(
                        "How does @Async work internally in Spring Boot?",
                        "Spring Boot",
                        "Medium",
                        "It uses a proxy and an TaskExecutor thread pool to run the method in a separate thread asynchronously.",
                        "Zomato"
                ),
                new Question(
                        "Explain ACID properties with respect to a money transfer in Paytm.",
                        "Database",
                        "Easy",
                        "Atomicity (all or nothing), Consistency (valid state), Isolation (independent), Durability (persisted).",
                        "Paytm"
                ),
                new Question(
                        "What is a 'Thread Dump' and when do you use it at Uber?",
                        "Java",
                        "Medium",
                        "A snapshot of all active threads. Used for debugging deadlocks, CPU spikes, or hung states in production.",
                        "Uber"
                )
        );
    }
}
