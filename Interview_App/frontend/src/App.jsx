import { useEffect, useState, useRef, useCallback } from "react";
import { 
  fetchQuestions, submitAnswer, likeQuestion, fetchPerformanceSummary, 
  pingVisitor, fetchByCompany, skipQuestion, updateLeaderboardProgress,
  getVisitorId
} from "./api";
import ShimmerCard from "./components/ShimmerCard";
import SearchBar from "./components/SearchBar";
import UserSubmit from "./components/UserSubmit";
import AdminPanel from "./components/AdminPanel";
import CompanyFilter from "./components/CompanyFilter";
import Leaderboard from "./components/Leaderboard";
import DailyChallenge from "./components/DailyChallenge";
import CodeSandbox from "./components/CodeSandbox";

// Audio Assets (using placeholders or CDN)
const SOUNDS = {
  ding: new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/button_tiny.mp3"),
  whoosh: new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/water_droplet_3.mp3"),
  error: new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/button_out.mp3")
};

const OFFLINE_QUESTIONS = [
  // ── Original 7 Questions ──────────────────────────────────────────────
  {
    id: "offline-1", title: "What is the primary difference between @Component, @Service, and @Repository in Spring?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "They are identical,@Repository adds DB exception translation,@Service adds security,@Component is deprecated",
    referenceAnswer: "@Repository adds DB exception translation",
    explanation: "@Repository adds persistence exception translation on top of the @Component stereotype. @Service currently acts mainly as a marker.",
    likeCount: 0,
  },
  {
    id: "offline-2", title: "Which of the following is true about Java's garbage collection?",
    category: "Java", difficulty: "Medium", type: "MCQ",
    options: "It guarantees no memory leaks,It runs at a fixed interval,It cannot be forced precisely by the programmer,It only collects objects with no references in Eden space",
    referenceAnswer: "It cannot be forced precisely by the programmer",
    explanation: "Garbage collection in Java reclaims memory automatically, but System.gc() is only a hint and execution time cannot be precisely controlled or forced.",
    likeCount: 0,
  },
  {
    id: "offline-3", title: "In SQL, what is the key difference between a LEFT JOIN and an INNER JOIN?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "LEFT JOIN returns all records from the left table,INNER JOIN only works on primary keys,LEFT JOIN is faster,There is no difference",
    referenceAnswer: "LEFT JOIN returns all records from the left table",
    explanation: "A LEFT JOIN returns all records from the left table and matched records from the right table. INNER JOIN requires matches in both.",
    likeCount: 0,
  },
  {
    id: "offline-4", title: "Which statement best describes a Kafka Topic partition?",
    category: "Kafka", difficulty: "Medium", type: "MCQ",
    options: "A globally ordered queue,An ordered immutable sequence of messages,Can be consumed by multiple consumers in the same group,Partitions cannot be replicated",
    referenceAnswer: "An ordered immutable sequence of messages",
    explanation: "A Kafka partition is an ordered, immutable sequence of records that is continually appended to.",
    likeCount: 0,
  },
  {
    id: "offline-5", title: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    category: "DSA", difficulty: "Easy", type: "MCQ",
    options: "O(1),O(N),O(log N),O(N log N)",
    referenceAnswer: "O(log N)",
    explanation: "In a balanced BST, roughly half the tree is eliminated at each step, resulting in O(log N) time complexity.",
    likeCount: 0,
  },
  {
    id: "offline-6", title: "What does the CAP theorem state regarding distributed systems?",
    category: "System Design", difficulty: "Medium", type: "MCQ",
    options: "You can achieve all three properties simultaneously,You can only achieve two of the three properties simultaneously,Databases must be relational to be consistent,Eventual consistency violates Partition tolerance",
    referenceAnswer: "You can only achieve two of the three properties simultaneously",
    explanation: "The CAP theorem states that a distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition tolerance.",
    likeCount: 0,
  },
  {
    id: "offline-7", title: "Which HTTP method is considered idempotent?",
    category: "API Design", difficulty: "Easy", type: "MCQ",
    options: "POST,PUT,Both POST and PUT,Neither POST nor PUT",
    referenceAnswer: "PUT",
    explanation: "PUT is idempotent, meaning making multiple identical requests has the same effect as making a single request. POST creates new resources each time.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 1. JAVA CODE SNIPPET QUESTIONS (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-cs-1", title: "What is the output?\n\nString s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nSystem.out.println(s1 == s2);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "true,false,Compilation error,Runtime exception",
    referenceAnswer: "false",
    explanation: "== compares references, not content. s1 points to the string pool, s2 to a new heap object. They are different references.",
    likeCount: 0,
  },
  {
    id: "offline-cs-2", title: "What is the output?\n\nint[] arr = {1, 2, 3};\nSystem.out.println(arr.length);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "2,3,Compilation error,0",
    referenceAnswer: "3",
    explanation: "Array length is a field (not a method) that returns the number of elements. {1,2,3} has 3 elements.",
    likeCount: 0,
  },
  {
    id: "offline-cs-3", title: "What is the output?\n\nInteger a = 127;\nInteger b = 127;\nSystem.out.println(a == b);",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "true,false,Compilation error,Depends on JVM",
    referenceAnswer: "true",
    explanation: "Java caches Integer objects for values -128 to 127. Both a and b refer to the same cached object, so == returns true.",
    likeCount: 0,
  },
  {
    id: "offline-cs-4", title: "What is the output?\n\nInteger a = 128;\nInteger b = 128;\nSystem.out.println(a == b);",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "true,false,Compilation error,Depends on JVM",
    referenceAnswer: "false",
    explanation: "Values outside -128 to 127 are not cached by Integer autoboxing. a and b are different objects, so == returns false.",
    likeCount: 0,
  },
  {
    id: "offline-cs-5", title: "What is the output?\n\ntry {\n  return 1;\n} finally {\n  return 2;\n}",
    category: "Java Code", difficulty: "Hard", type: "MCQ",
    options: "1,2,Compilation error,Runtime exception",
    referenceAnswer: "2",
    explanation: "The finally block always executes and its return overrides the return in try. The method returns 2.",
    likeCount: 0,
  },
  {
    id: "offline-cs-6", title: "What is the output?\n\nString s = null;\nSystem.out.println(s + \" world\");",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "null world,NullPointerException,world,Compilation error",
    referenceAnswer: "null world",
    explanation: "String concatenation with + converts null to the string \"null\", so the result is \"null world\".",
    likeCount: 0,
  },
  {
    id: "offline-cs-7", title: "What is the output?\n\nSystem.out.println(1 + 2 + \"3\");",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "123,33,6,Compilation error",
    referenceAnswer: "33",
    explanation: "Left-to-right evaluation: 1+2=3 (integer addition), then 3+\"3\"=\"33\" (string concatenation).",
    likeCount: 0,
  },
  {
    id: "offline-cs-8", title: "What is the output?\n\nSystem.out.println(\"1\" + 2 + 3);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "123,6,15,Compilation error",
    referenceAnswer: "123",
    explanation: "\"1\"+2 = \"12\" (string concat), then \"12\"+3 = \"123\" (string concat). Left-to-right with string dominance.",
    likeCount: 0,
  },
  {
    id: "offline-cs-9", title: "What happens when this code runs?\n\nList<String> list = Arrays.asList(\"a\", \"b\", \"c\");\nlist.add(\"d\");",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "List becomes [a b c d],UnsupportedOperationException,Compilation error,IndexOutOfBoundsException",
    referenceAnswer: "UnsupportedOperationException",
    explanation: "Arrays.asList() returns a fixed-size list backed by the array. Structural modifications like add() throw UnsupportedOperationException.",
    likeCount: 0,
  },
  {
    id: "offline-cs-10", title: "What is the output?\n\ndouble d = 0.1 + 0.2;\nSystem.out.println(d == 0.3);",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "true,false,Compilation error,0.3",
    referenceAnswer: "false",
    explanation: "Floating-point arithmetic has precision issues. 0.1+0.2 is 0.30000000000000004, which is not equal to 0.3.",
    likeCount: 0,
  },
  {
    id: "offline-cs-11", title: "What is the output?\n\nString s = \"abc\";\ns.toUpperCase();\nSystem.out.println(s);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "ABC,abc,Compilation error,null",
    referenceAnswer: "abc",
    explanation: "Strings are immutable in Java. toUpperCase() returns a new String; the original s is unchanged.",
    likeCount: 0,
  },
  {
    id: "offline-cs-12", title: "What is the output?\n\nint x = 5;\nSystem.out.println(x++ + ++x);",
    category: "Java Code", difficulty: "Hard", type: "MCQ",
    options: "11,12,10,13",
    referenceAnswer: "12",
    explanation: "x++ uses 5 then increments to 6. ++x increments 6 to 7 then uses 7. Result = 5 + 7 = 12.",
    likeCount: 0,
  },
  {
    id: "offline-cs-13", title: "What is the output?\n\nboolean b = true;\nif (b = false) {\n  System.out.println(\"YES\");\n} else {\n  System.out.println(\"NO\");\n}",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "YES,NO,Compilation error,Runtime error",
    referenceAnswer: "NO",
    explanation: "b = false is an assignment (not comparison), which assigns false to b. The if condition evaluates to false, so 'NO' is printed.",
    likeCount: 0,
  },
  {
    id: "offline-cs-14", title: "What is the output?\n\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"a\", 1);\nmap.put(\"a\", 2);\nSystem.out.println(map.size());",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "1,2,Compilation error,0",
    referenceAnswer: "1",
    explanation: "HashMap does not allow duplicate keys. The second put() overwrites the value for key 'a'. Size remains 1.",
    likeCount: 0,
  },
  {
    id: "offline-cs-15", title: "What is the output?\n\nfinal int[] arr = {1, 2, 3};\narr[0] = 10;\nSystem.out.println(arr[0]);",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "1,10,Compilation error,Runtime exception",
    referenceAnswer: "10",
    explanation: "final makes the reference constant, not the contents. You cannot reassign arr, but you can modify its elements.",
    likeCount: 0,
  },
  {
    id: "offline-cs-16", title: "What is the output?\n\nString s1 = \"Hello\";\nString s2 = \"Hel\" + \"lo\";\nSystem.out.println(s1 == s2);",
    category: "Java Code", difficulty: "Hard", type: "MCQ",
    options: "true,false,Compilation error,Depends on JVM",
    referenceAnswer: "true",
    explanation: "Compile-time constant expressions are resolved at compile time. \"Hel\" + \"lo\" becomes \"Hello\" in the constant pool, same as s1.",
    likeCount: 0,
  },
  {
    id: "offline-cs-17", title: "What is the output?\n\nswitch(\"hello\") {\n  case \"hello\": System.out.println(\"A\");\n  case \"world\": System.out.println(\"B\");\n}",
    category: "Java Code", difficulty: "Medium", type: "MCQ",
    options: "A,B,A then B,Compilation error",
    referenceAnswer: "A then B",
    explanation: "Without break statements, switch cases fall through. After matching 'hello', both 'A' and 'B' are printed.",
    likeCount: 0,
  },
  {
    id: "offline-cs-18", title: "What is the output?\n\nObject obj = \"Hello\";\nSystem.out.println(obj instanceof String);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "true,false,Compilation error,Runtime error",
    referenceAnswer: "true",
    explanation: "Although the reference type is Object, the actual runtime object is a String. instanceof checks the runtime type.",
    likeCount: 0,
  },
  {
    id: "offline-cs-19", title: "What is the output?\n\nfor(int i = 0; i < 5; i++) {\n  if(i == 3) continue;\n  System.out.print(i + \" \");\n}",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "0 1 2 3 4,0 1 2 4,0 1 2,Compilation error",
    referenceAnswer: "0 1 2 4",
    explanation: "continue skips the rest of the current iteration. When i==3, it skips the print and continues with i=4.",
    likeCount: 0,
  },
  {
    id: "offline-cs-20", title: "What is the output?\n\nString[] arr = new String[3];\nSystem.out.println(arr[0]);",
    category: "Java Code", difficulty: "Easy", type: "MCQ",
    options: "null,\"\",0,NullPointerException",
    referenceAnswer: "null",
    explanation: "Object arrays in Java are initialized with null by default. arr[0] has not been assigned, so it prints null.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 2. JAVA STREAMS MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-st-1", title: "Which terminal operation triggers the processing of a Java Stream pipeline?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "filter(),map(),collect(),peek()",
    referenceAnswer: "collect()",
    explanation: "Streams are lazy. Intermediate operations like filter/map/peek are deferred. Only terminal operations like collect(), forEach(), reduce() trigger execution.",
    likeCount: 0,
  },
  {
    id: "offline-st-2", title: "What does Stream.of(1,2,3).reduce(0, Integer::sum) return?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "0,3,6,Optional[6]",
    referenceAnswer: "6",
    explanation: "reduce(0, Integer::sum) starts with identity 0 and adds each element: 0+1+2+3 = 6. Using identity returns int, not Optional.",
    likeCount: 0,
  },
  {
    id: "offline-st-3", title: "Which Collector groups elements of a stream by a classifier function?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "Collectors.toList(),Collectors.groupingBy(),Collectors.joining(),Collectors.partitioningBy()",
    referenceAnswer: "Collectors.groupingBy()",
    explanation: "Collectors.groupingBy() groups stream elements into a Map<K, List<V>> based on the classifier function provided.",
    likeCount: 0,
  },
  {
    id: "offline-st-4", title: "What is the difference between map() and flatMap() in Streams?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "map transforms and flatMap filters,map is for primitives only,flatMap flattens nested streams into one,They are identical",
    referenceAnswer: "flatMap flattens nested streams into one",
    explanation: "map() applies a function to each element. flatMap() applies a function that returns a stream for each element and then flattens them into a single stream.",
    likeCount: 0,
  },
  {
    id: "offline-st-5", title: "What does the peek() method do in a Stream pipeline?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "Filters elements,Performs an action on each element without modifying the stream,Terminates the stream,Sorts the stream",
    referenceAnswer: "Performs an action on each element without modifying the stream",
    explanation: "peek() is an intermediate operation mainly used for debugging. It lets you observe each element as it passes through.",
    likeCount: 0,
  },
  {
    id: "offline-st-6", title: "How do you create a stream from a List in Java?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "list.toStream(),list.stream(),Stream.from(list),new Stream(list)",
    referenceAnswer: "list.stream()",
    explanation: "The stream() method is defined in the Collection interface and returns a sequential Stream from the collection.",
    likeCount: 0,
  },
  {
    id: "offline-st-7", title: "Which method converts a Stream<Integer> to an IntStream?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "mapToInt(),toIntStream(),castToInt(),intValue()",
    referenceAnswer: "mapToInt()",
    explanation: "mapToInt() maps each element to an int and returns an IntStream, which provides primitive specializations like sum() and average().",
    likeCount: 0,
  },
  {
    id: "offline-st-8", title: "What is a key characteristic of a parallel stream?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "It guarantees order of processing,It uses the ForkJoinPool for parallel execution,It is always faster than sequential,It cannot be used with collect()",
    referenceAnswer: "It uses the ForkJoinPool for parallel execution",
    explanation: "Parallel streams use the common ForkJoinPool to split work across multiple threads. Order is not guaranteed unless explicitly requested.",
    likeCount: 0,
  },
  {
    id: "offline-st-9", title: "What does Optional.orElse() do?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "Throws an exception if empty,Returns the value if present or a default,Filters the Optional,Maps the Optional value",
    referenceAnswer: "Returns the value if present or a default",
    explanation: "orElse() returns the contained value if present, otherwise returns the provided default value.",
    likeCount: 0,
  },
  {
    id: "offline-st-10", title: "What does Collectors.partitioningBy() return?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "A List,A Map<Boolean and List>,A Set,An Optional",
    referenceAnswer: "A Map<Boolean and List>",
    explanation: "partitioningBy() splits elements into two groups based on a Predicate, returning a Map<Boolean, List<T>>.",
    likeCount: 0,
  },
  {
    id: "offline-st-11", title: "Which stream operation removes duplicate elements?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "unique(),distinct(),removeDuplicates(),deduplicate()",
    referenceAnswer: "distinct()",
    explanation: "distinct() uses equals() to filter out duplicate elements, returning a stream with only unique elements.",
    likeCount: 0,
  },
  {
    id: "offline-st-12", title: "What does Stream.generate(() -> 'x').limit(3) produce?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "x x x,xxx,An infinite stream,Compilation error",
    referenceAnswer: "x x x",
    explanation: "Stream.generate() creates an infinite stream of 'x' values. limit(3) truncates it to 3 elements.",
    likeCount: 0,
  },
  {
    id: "offline-st-13", title: "Which method is used to concatenate two streams?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "stream1.merge(stream2),Stream.concat(stream1 and stream2),stream1.addAll(stream2),stream1.join(stream2)",
    referenceAnswer: "Stream.concat(stream1 and stream2)",
    explanation: "Stream.concat() is a static method that creates a lazily concatenated stream whose elements are all elements of the first stream followed by all elements of the second stream.",
    likeCount: 0,
  },
  {
    id: "offline-st-14", title: "What is the difference between findFirst() and findAny()?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "They are identical,findFirst() returns the first element while findAny() may return any element in parallel,findAny() is faster always,findFirst() throws if empty",
    referenceAnswer: "findFirst() returns the first element while findAny() may return any element in parallel",
    explanation: "In sequential streams they behave similarly, but in parallel streams findAny() does not guarantee returning the first element, offering better performance.",
    likeCount: 0,
  },
  {
    id: "offline-st-15", title: "What happens if you reuse a stream after a terminal operation?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "It works normally,IllegalStateException is thrown,It returns an empty stream,NullPointerException",
    referenceAnswer: "IllegalStateException is thrown",
    explanation: "Streams can only be consumed once. After a terminal operation, the stream is closed and any further operation throws IllegalStateException.",
    likeCount: 0,
  },
  {
    id: "offline-st-16", title: "Which method converts a stream to an array?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "toList(),toArray(),asArray(),collect(Collectors.toArray())",
    referenceAnswer: "toArray()",
    explanation: "toArray() is a terminal operation that returns an array containing the elements of the stream.",
    likeCount: 0,
  },
  {
    id: "offline-st-17", title: "What does Collectors.joining(\", \") do?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "Joins elements with a comma separator,Joins streams together,Combines two collectors,Creates a new list",
    referenceAnswer: "Joins elements with a comma separator",
    explanation: "Collectors.joining(\", \") concatenates all stream elements (Strings) into a single String separated by \", \".",
    likeCount: 0,
  },
  {
    id: "offline-st-18", title: "What is the purpose of Stream.iterate()?",
    category: "Java Streams", difficulty: "Medium", type: "MCQ",
    options: "Iterates over an existing collection,Creates an infinite sequential ordered stream,Replaces for loops completely,Creates a parallel stream",
    referenceAnswer: "Creates an infinite sequential ordered stream",
    explanation: "Stream.iterate(seed, f) produces an infinite stream: seed, f(seed), f(f(seed)), etc. Use limit() to bound it.",
    likeCount: 0,
  },
  {
    id: "offline-st-19", title: "Which stream operation is both stateful and intermediate?",
    category: "Java Streams", difficulty: "Hard", type: "MCQ",
    options: "filter(),sorted(),map(),forEach()",
    referenceAnswer: "sorted()",
    explanation: "sorted() is an intermediate operation that requires seeing all elements before producing output, making it stateful. filter() and map() are stateless.",
    likeCount: 0,
  },
  {
    id: "offline-st-20", title: "What does IntStream.range(1, 5) generate?",
    category: "Java Streams", difficulty: "Easy", type: "MCQ",
    options: "1 2 3 4 5,1 2 3 4,0 1 2 3 4,2 3 4",
    referenceAnswer: "1 2 3 4",
    explanation: "IntStream.range(start, end) generates a sequential stream from start (inclusive) to end (exclusive): 1, 2, 3, 4.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 3. OOPs MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-oop-1", title: "Which OOP principle allows a subclass to provide a specific implementation of a method already defined in its superclass?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "Encapsulation,Polymorphism (Method Overriding),Abstraction,Composition",
    referenceAnswer: "Polymorphism (Method Overriding)",
    explanation: "Method overriding is a form of runtime polymorphism where a subclass provides a specific implementation of a method defined in its parent class.",
    likeCount: 0,
  },
  {
    id: "offline-oop-2", title: "What is the key difference between an abstract class and an interface in Java?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "Interfaces can have constructors,Abstract classes can have state (fields) and constructors,They are identical since Java 8,Abstract classes cannot have methods",
    referenceAnswer: "Abstract classes can have state (fields) and constructors",
    explanation: "Abstract classes can hold instance state, constructors, and both abstract and concrete methods. Interfaces (pre-Java 8) could only have constants and abstract methods.",
    likeCount: 0,
  },
  {
    id: "offline-oop-3", title: "What is encapsulation in OOP?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "Inheriting from multiple classes,Bundling data and methods that operate on it within a single unit,Creating objects from classes,Overloading methods",
    referenceAnswer: "Bundling data and methods that operate on it within a single unit",
    explanation: "Encapsulation hides internal state and requires all interaction to be performed through an object's methods, protecting integrity.",
    likeCount: 0,
  },
  {
    id: "offline-oop-4", title: "Why does Java not support multiple inheritance of classes?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "It's too slow,To avoid the Diamond Problem,Because interfaces exist,Java was designed for simplicity only",
    referenceAnswer: "To avoid the Diamond Problem",
    explanation: "The Diamond Problem causes ambiguity when two parent classes have the same method. Java avoids this by allowing multiple interface implementation instead.",
    likeCount: 0,
  },
  {
    id: "offline-oop-5", title: "What is the difference between method overloading and method overriding?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "Overloading changes return type only,Overloading is compile-time polymorphism and overriding is runtime polymorphism,They are the same thing,Overriding requires different parameters",
    referenceAnswer: "Overloading is compile-time polymorphism and overriding is runtime polymorphism",
    explanation: "Overloading resolves at compile time (same name, different params). Overriding resolves at runtime (same signature, different class).",
    likeCount: 0,
  },
  {
    id: "offline-oop-6", title: "What is the SOLID principle that states a class should have only one reason to change?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "Open/Closed Principle,Single Responsibility Principle,Liskov Substitution Principle,Interface Segregation Principle",
    referenceAnswer: "Single Responsibility Principle",
    explanation: "SRP states each class should have one and only one reason to change, meaning it should have only one job/responsibility.",
    likeCount: 0,
  },
  {
    id: "offline-oop-7", title: "What does the Liskov Substitution Principle state?",
    category: "OOPs", difficulty: "Hard", type: "MCQ",
    options: "Classes should depend on abstractions,Objects of a superclass should be replaceable with objects of its subclass,A class should be open for extension but closed for modification,Prefer composition over inheritance",
    referenceAnswer: "Objects of a superclass should be replaceable with objects of its subclass",
    explanation: "LSP ensures that derived classes must be substitutable for their base classes without altering the correctness of the program.",
    likeCount: 0,
  },
  {
    id: "offline-oop-8", title: "What is the purpose of the 'super' keyword in Java?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "To create a new object,To refer to the parent class object and call its methods or constructor,To make a variable constant,To implement an interface",
    referenceAnswer: "To refer to the parent class object and call its methods or constructor",
    explanation: "super is used to call parent class constructors (super()), access parent methods (super.method()), and parent fields.",
    likeCount: 0,
  },
  {
    id: "offline-oop-9", title: "What is composition in OOP?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "A class inheriting from another,A class containing instances of other classes as fields,Method overloading,Creating abstract classes",
    referenceAnswer: "A class containing instances of other classes as fields",
    explanation: "Composition models 'has-a' relationships. Instead of inheriting behavior, a class holds references to other objects that provide needed functionality.",
    likeCount: 0,
  },
  {
    id: "offline-oop-10", title: "What is the Open/Closed Principle?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "Classes should be open for modification,Software entities should be open for extension but closed for modification,All methods should be public,Files should be open before closing",
    referenceAnswer: "Software entities should be open for extension but closed for modification",
    explanation: "OCP means you should be able to add new functionality without modifying existing code, typically through inheritance or interfaces.",
    likeCount: 0,
  },
  {
    id: "offline-oop-11", title: "What is abstraction in OOP?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "Hiding implementation details and showing only functionality,Creating multiple objects,Copying objects,Encapsulating data",
    referenceAnswer: "Hiding implementation details and showing only functionality",
    explanation: "Abstraction focuses on what an object does rather than how it does it, reducing complexity by hiding unnecessary details.",
    likeCount: 0,
  },
  {
    id: "offline-oop-12", title: "Can a constructor be inherited in Java?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "Yes always,No constructors are not inherited,Only if marked public,Only in abstract classes",
    referenceAnswer: "No constructors are not inherited",
    explanation: "Constructors are not inherited in Java. Each class must define its own. However, a subclass can call a parent constructor using super().",
    likeCount: 0,
  },
  {
    id: "offline-oop-13", title: "What is the difference between aggregation and composition?",
    category: "OOPs", difficulty: "Hard", type: "MCQ",
    options: "They are identical,In composition the child cannot exist without the parent; in aggregation it can,Aggregation is stronger than composition,Composition uses interfaces only",
    referenceAnswer: "In composition the child cannot exist without the parent; in aggregation it can",
    explanation: "Composition implies ownership and lifecycle dependency. Aggregation is a weaker relationship where the child can exist independently.",
    likeCount: 0,
  },
  {
    id: "offline-oop-14", title: "What is the purpose of the 'this' keyword in Java?",
    category: "OOPs", difficulty: "Easy", type: "MCQ",
    options: "To refer to the current class instance,To create a new object,To call a static method,To import a package",
    referenceAnswer: "To refer to the current class instance",
    explanation: "'this' refers to the current object. It is commonly used to disambiguate between instance variables and parameters with the same name.",
    likeCount: 0,
  },
  {
    id: "offline-oop-15", title: "Which access modifier makes a member accessible only within the same package and subclasses?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "private,public,protected,default",
    referenceAnswer: "protected",
    explanation: "protected members are accessible within the same package and by subclasses in other packages.",
    likeCount: 0,
  },
  {
    id: "offline-oop-16", title: "What is the Interface Segregation Principle?",
    category: "OOPs", difficulty: "Hard", type: "MCQ",
    options: "Use one large interface,Clients should not be forced to depend on interfaces they do not use,Interfaces must be segregated into packages,All methods must have implementations",
    referenceAnswer: "Clients should not be forced to depend on interfaces they do not use",
    explanation: "ISP states that many specific interfaces are better than one general-purpose interface. Classes shouldn't implement methods they don't need.",
    likeCount: 0,
  },
  {
    id: "offline-oop-17", title: "What is a covariant return type in Java?",
    category: "OOPs", difficulty: "Hard", type: "MCQ",
    options: "Returning void,Overriding method can have a return type that is a subclass of the original,Changing return type to primitive,Returning multiple values",
    referenceAnswer: "Overriding method can have a return type that is a subclass of the original",
    explanation: "Since Java 5, an overriding method can return a subtype of the return type declared in the parent method. This is covariant return.",
    likeCount: 0,
  },
  {
    id: "offline-oop-18", title: "What pattern uses a private constructor and a static method to control object creation?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "Observer Pattern,Singleton Pattern,Factory Pattern,Strategy Pattern",
    referenceAnswer: "Singleton Pattern",
    explanation: "Singleton restricts instantiation to one object. It uses a private constructor and a static getInstance() method to control creation.",
    likeCount: 0,
  },
  {
    id: "offline-oop-19", title: "What is the Dependency Inversion Principle?",
    category: "OOPs", difficulty: "Hard", type: "MCQ",
    options: "High-level modules should depend on low-level modules,High-level modules should depend on abstractions not on concretions,Dependencies should be inverted at runtime,Use dependency injection only",
    referenceAnswer: "High-level modules should depend on abstractions not on concretions",
    explanation: "DIP states that both high-level and low-level modules should depend on abstractions. Abstractions should not depend on details.",
    likeCount: 0,
  },
  {
    id: "offline-oop-20", title: "Can an interface extend multiple interfaces in Java?",
    category: "OOPs", difficulty: "Medium", type: "MCQ",
    options: "No only classes can,Yes an interface can extend multiple interfaces,Only if they have no methods,Only abstract interfaces can",
    referenceAnswer: "Yes an interface can extend multiple interfaces",
    explanation: "Unlike classes, interfaces in Java can extend multiple interfaces, allowing for flexible contract composition without the Diamond Problem.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 4. CORE JAVA MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-cj-1", title: "What is the difference between == and .equals() in Java?",
    category: "Core Java", difficulty: "Easy", type: "MCQ",
    options: "They are the same,== compares references while .equals() compares content,== is for strings only,.equals() compares references",
    referenceAnswer: "== compares references while .equals() compares content",
    explanation: "== checks if two references point to the same object in memory. .equals() checks if the values/content of the objects are logically equal.",
    likeCount: 0,
  },
  {
    id: "offline-cj-2", title: "What is the purpose of the 'volatile' keyword in Java?",
    category: "Core Java", difficulty: "Hard", type: "MCQ",
    options: "Makes a variable constant,Ensures the variable is read from main memory on every access,Makes the variable thread-local,Prevents garbage collection",
    referenceAnswer: "Ensures the variable is read from main memory on every access",
    explanation: "volatile prevents thread caching of a variable. Every read comes from main memory and every write goes to main memory, ensuring visibility across threads.",
    likeCount: 0,
  },
  {
    id: "offline-cj-3", title: "What is the difference between ArrayList and LinkedList?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "ArrayList is thread-safe,ArrayList uses dynamic array and LinkedList uses doubly-linked list,LinkedList is faster for random access,They have identical performance",
    referenceAnswer: "ArrayList uses dynamic array and LinkedList uses doubly-linked list",
    explanation: "ArrayList provides O(1) random access but O(n) insertions. LinkedList provides O(1) insertions/deletions but O(n) random access.",
    likeCount: 0,
  },
  {
    id: "offline-cj-4", title: "What is the default value of a boolean instance variable in Java?",
    category: "Core Java", difficulty: "Easy", type: "MCQ",
    options: "true,false,null,0",
    referenceAnswer: "false",
    explanation: "Default values: boolean → false, int → 0, double → 0.0, char → '\\u0000', Object references → null.",
    likeCount: 0,
  },
  {
    id: "offline-cj-5", title: "What is the difference between HashMap and ConcurrentHashMap?",
    category: "Core Java", difficulty: "Hard", type: "MCQ",
    options: "HashMap is thread-safe,ConcurrentHashMap allows concurrent reads and writes without external synchronization,They are identical,ConcurrentHashMap is slower always",
    referenceAnswer: "ConcurrentHashMap allows concurrent reads and writes without external synchronization",
    explanation: "ConcurrentHashMap uses internal locking at segment/bucket level for thread safety. HashMap is not thread-safe and requires external synchronization.",
    likeCount: 0,
  },
  {
    id: "offline-cj-6", title: "What is autoboxing in Java?",
    category: "Core Java", difficulty: "Easy", type: "MCQ",
    options: "Converting String to int,Automatic conversion between primitive types and their wrapper classes,Creating arrays automatically,Casting objects",
    referenceAnswer: "Automatic conversion between primitive types and their wrapper classes",
    explanation: "Autoboxing converts primitives (int, double, etc.) to wrapper objects (Integer, Double) automatically. Unboxing is the reverse.",
    likeCount: 0,
  },
  {
    id: "offline-cj-7", title: "What is the purpose of the transient keyword?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "Makes a variable constant,Excludes the field from serialization,Makes the field static,Marks the field for garbage collection",
    referenceAnswer: "Excludes the field from serialization",
    explanation: "transient prevents a field from being serialized. When an object is deserialized, transient fields are restored to their default values.",
    likeCount: 0,
  },
  {
    id: "offline-cj-8", title: "How does Java's String pool work?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "All strings go to heap,String literals are stored in a special memory area to reuse identical strings,String pool is deprecated,Only interned strings use pool",
    referenceAnswer: "String literals are stored in a special memory area to reuse identical strings",
    explanation: "The String pool (in metaspace since Java 7) stores unique string literals. When you create a literal, JVM checks the pool first and reuses if found.",
    likeCount: 0,
  },
  {
    id: "offline-cj-9", title: "What is the difference between Comparable and Comparator?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "They are the same,Comparable defines natural ordering inside the class while Comparator defines external custom ordering,Comparator is faster,Comparable uses equals()",
    referenceAnswer: "Comparable defines natural ordering inside the class while Comparator defines external custom ordering",
    explanation: "Comparable's compareTo() is implemented by the class itself. Comparator's compare() is a separate object, allowing multiple sort strategies.",
    likeCount: 0,
  },
  {
    id: "offline-cj-10", title: "What is a functional interface in Java?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "An interface with multiple methods,An interface with exactly one abstract method,Any interface marked @Override,An interface that extends Function",
    referenceAnswer: "An interface with exactly one abstract method",
    explanation: "A functional interface has exactly one abstract method and can be used as the target for lambda expressions. @FunctionalInterface annotation is optional but recommended.",
    likeCount: 0,
  },
  {
    id: "offline-cj-11", title: "What is the difference between checked and unchecked exceptions?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "Checked are runtime errors,Checked must be declared or caught at compile time while unchecked are runtime exceptions,Unchecked cannot be caught,They are identical",
    referenceAnswer: "Checked must be declared or caught at compile time while unchecked are runtime exceptions",
    explanation: "Checked exceptions (IOException, etc.) must be handled. Unchecked exceptions (NullPointerException, etc.) extend RuntimeException and don't require explicit handling.",
    likeCount: 0,
  },
  {
    id: "offline-cj-12", title: "What is the purpose of the 'static' keyword in Java?",
    category: "Core Java", difficulty: "Easy", type: "MCQ",
    options: "Makes the member unchangeable,Means the member belongs to the class rather than instances,Makes the member private,Enables garbage collection",
    referenceAnswer: "Means the member belongs to the class rather than instances",
    explanation: "static members belong to the class itself, not to any particular instance. They are shared across all instances and can be accessed without creating an object.",
    likeCount: 0,
  },
  {
    id: "offline-cj-13", title: "What is the difference between final, finally, and finalize?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "They all prevent modification,final restricts modification and finally executes after try-catch and finalize is for garbage collection cleanup,They are identical,finally and finalize are the same",
    referenceAnswer: "final restricts modification and finally executes after try-catch and finalize is for garbage collection cleanup",
    explanation: "final: prevents modification. finally: always executes after try/catch. finalize(): called by GC before reclaiming memory (deprecated since Java 9).",
    likeCount: 0,
  },
  {
    id: "offline-cj-14", title: "What is the difference between a HashSet and a TreeSet?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "HashSet is ordered,TreeSet maintains elements in sorted order while HashSet does not,They are identical,HashSet uses a tree internally",
    referenceAnswer: "TreeSet maintains elements in sorted order while HashSet does not",
    explanation: "TreeSet uses a Red-Black tree and maintains natural ordering. HashSet uses a hash table and provides O(1) access but no ordering.",
    likeCount: 0,
  },
  {
    id: "offline-cj-15", title: "What does the 'synchronized' keyword do?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "Makes code faster,Ensures only one thread can execute the block/method at a time,Makes the variable volatile,Creates a new thread",
    referenceAnswer: "Ensures only one thread can execute the block/method at a time",
    explanation: "synchronized acquires a lock (monitor) on the object, preventing other threads from entering the synchronized block/method until the lock is released.",
    likeCount: 0,
  },
  {
    id: "offline-cj-16", title: "What is a WeakReference in Java?",
    category: "Core Java", difficulty: "Hard", type: "MCQ",
    options: "A reference that prevents GC,A reference that does not prevent garbage collection of the referent,A null reference,A reference to a primitive",
    referenceAnswer: "A reference that does not prevent garbage collection of the referent",
    explanation: "WeakReference allows the referent to be GC'd when only weak references remain. Used in caches (WeakHashMap) to avoid memory leaks.",
    likeCount: 0,
  },
  {
    id: "offline-cj-17", title: "What is the difference between Thread.sleep() and Object.wait()?",
    category: "Core Java", difficulty: "Hard", type: "MCQ",
    options: "They are identical,sleep pauses the thread without releasing the lock while wait releases the lock,wait is deprecated,sleep releases the lock",
    referenceAnswer: "sleep pauses the thread without releasing the lock while wait releases the lock",
    explanation: "Thread.sleep() pauses execution but holds the lock. Object.wait() releases the lock and waits for notify/notifyAll, used for inter-thread communication.",
    likeCount: 0,
  },
  {
    id: "offline-cj-18", title: "What is the diamond operator (<>) in Java?",
    category: "Core Java", difficulty: "Easy", type: "MCQ",
    options: "A bitwise operator,Allows type inference for generic class instantiation,A comparison operator,A ternary operator",
    referenceAnswer: "Allows type inference for generic class instantiation",
    explanation: "Introduced in Java 7, the diamond operator allows you to omit type arguments on the right side: List<String> list = new ArrayList<>();",
    likeCount: 0,
  },
  {
    id: "offline-cj-19", title: "What is the Executor framework in Java?",
    category: "Core Java", difficulty: "Hard", type: "MCQ",
    options: "A testing framework,A higher-level replacement for manually creating threads using thread pools,A collection framework,A serialization framework",
    referenceAnswer: "A higher-level replacement for manually creating threads using thread pools",
    explanation: "The Executor framework (java.util.concurrent) manages thread pools, reuses threads, and provides methods to submit tasks and retrieve results via Future.",
    likeCount: 0,
  },
  {
    id: "offline-cj-20", title: "What are records in Java (Java 14+)?",
    category: "Core Java", difficulty: "Medium", type: "MCQ",
    options: "Mutable data classes,Immutable data carriers that auto-generate equals hashCode and toString,Database records,Log entries",
    referenceAnswer: "Immutable data carriers that auto-generate equals hashCode and toString",
    explanation: "Records are a special kind of class that is a transparent carrier of immutable data. The compiler auto-generates constructor, accessors, equals, hashCode, toString.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 5. SPRING BOOT MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-sb-1", title: "What is Spring Boot's auto-configuration mechanism?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Manual XML configuration,Automatically configures beans based on classpath dependencies,IDE plugin configuration,A code generator",
    referenceAnswer: "Automatically configures beans based on classpath dependencies",
    explanation: "Spring Boot scans the classpath and automatically configures beans using @Conditional annotations. For example, adding spring-boot-starter-web auto-configures an embedded Tomcat.",
    likeCount: 0,
  },
  {
    id: "offline-sb-2", title: "What is the purpose of @SpringBootApplication?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "It only starts the web server,It combines @Configuration @EnableAutoConfiguration and @ComponentScan,It replaces @Entity,It enables caching",
    referenceAnswer: "It combines @Configuration @EnableAutoConfiguration and @ComponentScan",
    explanation: "@SpringBootApplication is a convenience annotation that combines three essential annotations for bootstrapping a Spring Boot application.",
    likeCount: 0,
  },
  {
    id: "offline-sb-3", title: "What is the default embedded server in Spring Boot?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "Jetty,Netty,Tomcat,Undertow",
    referenceAnswer: "Tomcat",
    explanation: "Spring Boot uses Apache Tomcat as the default embedded server, but supports Jetty and Undertow as alternatives.",
    likeCount: 0,
  },
  {
    id: "offline-sb-4", title: "What is the purpose of Spring Boot Actuator?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Database migration,Provides production-ready features like health checks and metrics,Frontend rendering,Message queuing",
    referenceAnswer: "Provides production-ready features like health checks and metrics",
    explanation: "Spring Boot Actuator adds endpoints for monitoring: /health, /metrics, /info, /env, and more. It's crucial for production observability.",
    likeCount: 0,
  },
  {
    id: "offline-sb-5", title: "What is the difference between @Controller and @RestController?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "They are identical,@RestController combines @Controller and @ResponseBody,@Controller is for REST APIs,@RestController returns views",
    referenceAnswer: "@RestController combines @Controller and @ResponseBody",
    explanation: "@RestController annotates every method with @ResponseBody, so return values are serialized directly to JSON/XML instead of being resolved as view names.",
    likeCount: 0,
  },
  {
    id: "offline-sb-6", title: "What is the role of application.properties / application.yml?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "Java source code,External configuration for the application,Database schema,Test cases",
    referenceAnswer: "External configuration for the application",
    explanation: "These files externalize configuration (port, datasource, logging, etc.) from code. Spring Boot loads them automatically from classpath or config locations.",
    likeCount: 0,
  },
  {
    id: "offline-sb-7", title: "What does @Transactional do in Spring?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Creates a REST endpoint,Manages database transactions with automatic commit/rollback,Logs method calls,Caches results",
    referenceAnswer: "Manages database transactions with automatic commit/rollback",
    explanation: "@Transactional wraps the method in a database transaction. It auto-commits on success and rolls back on RuntimeException.",
    likeCount: 0,
  },
  {
    id: "offline-sb-8", title: "What are Spring Boot profiles used for?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "User profiles,Environment-specific configurations like dev test and prod,Security profiles,Database profiles only",
    referenceAnswer: "Environment-specific configurations like dev test and prod",
    explanation: "Profiles allow different configurations for different environments. Activate with spring.profiles.active=dev to load application-dev.properties.",
    likeCount: 0,
  },
  {
    id: "offline-sb-9", title: "What is the purpose of @Autowired?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "Creates a new object,Automatically injects dependencies by type,Makes a field static,Marks a class as configuration",
    referenceAnswer: "Automatically injects dependencies by type",
    explanation: "@Autowired tells Spring to automatically inject the required dependency. It can be used on constructors, fields, or setter methods.",
    likeCount: 0,
  },
  {
    id: "offline-sb-10", title: "What is Spring Data JPA?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "A REST framework,A module that simplifies database access by auto-implementing repository interfaces,A testing library,A build tool",
    referenceAnswer: "A module that simplifies database access by auto-implementing repository interfaces",
    explanation: "Spring Data JPA auto-generates CRUD operations and query methods from repository interface method names, eliminating boilerplate DAO code.",
    likeCount: 0,
  },
  {
    id: "offline-sb-11", title: "What is the difference between @RequestParam and @PathVariable?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "They are the same,@PathVariable extracts from URL path and @RequestParam from query string,@RequestParam is for headers,@PathVariable is for body",
    referenceAnswer: "@PathVariable extracts from URL path and @RequestParam from query string",
    explanation: "@PathVariable maps /users/{id}, while @RequestParam maps /users?id=1. Both bind URL data to method parameters.",
    likeCount: 0,
  },
  {
    id: "offline-sb-12", title: "What is a Spring Boot Starter?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "A main class,A curated set of dependencies bundled for a specific feature,A config file,An annotation",
    referenceAnswer: "A curated set of dependencies bundled for a specific feature",
    explanation: "Starters are dependency descriptors (e.g., spring-boot-starter-web) that pull in all necessary libraries for a feature, simplifying dependency management.",
    likeCount: 0,
  },
  {
    id: "offline-sb-13", title: "What is the default scope of a Spring Bean?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Prototype,Request,Singleton,Session",
    referenceAnswer: "Singleton",
    explanation: "By default, Spring creates one instance per bean definition in the container (singleton scope). Use @Scope(\"prototype\") for a new instance per request.",
    likeCount: 0,
  },
  {
    id: "offline-sb-14", title: "What does @Qualifier do in Spring?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Marks a bean as primary,Disambiguates between multiple beans of the same type for injection,Validates input,Defines bean scope",
    referenceAnswer: "Disambiguates between multiple beans of the same type for injection",
    explanation: "When multiple beans of the same type exist, @Qualifier specifies which exact bean to inject, resolving ambiguity.",
    likeCount: 0,
  },
  {
    id: "offline-sb-15", title: "What is the CommandLineRunner interface used for?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Running shell commands,Executing code after the application context is loaded,CLI argument parsing,Testing only",
    referenceAnswer: "Executing code after the application context is loaded",
    explanation: "CommandLineRunner's run() method is called after Spring Boot starts. It's useful for data seeding, warm-up tasks, or startup initialization.",
    likeCount: 0,
  },
  {
    id: "offline-sb-16", title: "What is Spring Security's default behavior for endpoints?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "All endpoints are public,All endpoints require authentication by default,Only POST requires auth,Only admin endpoints are secured",
    referenceAnswer: "All endpoints require authentication by default",
    explanation: "Adding spring-boot-starter-security secures all endpoints by default, requiring login credentials. You configure access rules via SecurityFilterChain.",
    likeCount: 0,
  },
  {
    id: "offline-sb-17", title: "What is the purpose of @ControllerAdvice?",
    category: "Spring Boot", difficulty: "Medium", type: "MCQ",
    options: "Configures routes,Provides global exception handling across all controllers,Creates middleware,Enables caching",
    referenceAnswer: "Provides global exception handling across all controllers",
    explanation: "@ControllerAdvice allows centralized exception handling, data binding, and model attributes across all @Controller classes using @ExceptionHandler methods.",
    likeCount: 0,
  },
  {
    id: "offline-sb-18", title: "What is the difference between @Component and @Bean?",
    category: "Spring Boot", difficulty: "Hard", type: "MCQ",
    options: "They are identical,@Component is class-level auto-detected while @Bean is method-level in @Configuration,@Bean is deprecated,@Component is for testing only",
    referenceAnswer: "@Component is class-level auto-detected while @Bean is method-level in @Configuration",
    explanation: "@Component on a class triggers auto-detection. @Bean on a method in a @Configuration class gives explicit programmatic control over bean creation.",
    likeCount: 0,
  },
  {
    id: "offline-sb-19", title: "What is Spring Boot DevTools?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "A production tool,Developer productivity tools providing auto-restart and live reload,A database tool,A security module",
    referenceAnswer: "Developer productivity tools providing auto-restart and live reload",
    explanation: "DevTools provides automatic restart on code changes, LiveReload, and development-specific defaults for faster development cycles.",
    likeCount: 0,
  },
  {
    id: "offline-sb-20", title: "What is the purpose of @Value annotation?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "Validates fields,Injects values from properties files or expressions into fields,Sets default values for variables,Creates constants",
    referenceAnswer: "Injects values from properties files or expressions into fields",
    explanation: "@Value(\"${property.name}\") injects external configuration values. It also supports SpEL expressions like @Value(\"#{systemProperties['user.name']}\").",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 6. MICROSERVICES MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-ms-1", title: "What is a microservice?",
    category: "Microservices", difficulty: "Easy", type: "MCQ",
    options: "A small database,A small independently deployable service focused on a single business capability,A frontend component,A type of API",
    referenceAnswer: "A small independently deployable service focused on a single business capability",
    explanation: "Microservices decompose an application into small, autonomous services that can be developed, deployed, and scaled independently.",
    likeCount: 0,
  },
  {
    id: "offline-ms-2", title: "What is an API Gateway in microservices?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "A database proxy,A single entry point that routes requests to appropriate microservices,A message queue,A load balancer only",
    referenceAnswer: "A single entry point that routes requests to appropriate microservices",
    explanation: "API Gateway handles cross-cutting concerns (auth, rate limiting, routing) and acts as a reverse proxy, simplifying client interactions.",
    likeCount: 0,
  },
  {
    id: "offline-ms-3", title: "What is service discovery in microservices?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "Finding bugs in services,A mechanism for services to find and communicate with each other dynamically,API documentation,Service testing",
    referenceAnswer: "A mechanism for services to find and communicate with each other dynamically",
    explanation: "Service discovery (e.g., Eureka, Consul) allows services to register themselves and discover others without hardcoded URLs, enabling dynamic scaling.",
    likeCount: 0,
  },
  {
    id: "offline-ms-4", title: "What is the Circuit Breaker pattern?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "An electrical safety device,A pattern that prevents cascading failures by stopping calls to a failing service,A retry mechanism,A load balancing algorithm",
    referenceAnswer: "A pattern that prevents cascading failures by stopping calls to a failing service",
    explanation: "Circuit Breaker (e.g., Resilience4j) has Open/Closed/Half-Open states. When failures exceed a threshold, it opens and returns fallback responses.",
    likeCount: 0,
  },
  {
    id: "offline-ms-5", title: "What is the Saga pattern?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "A storytelling framework,A pattern for managing distributed transactions across microservices using compensating actions,A logging pattern,A deployment strategy",
    referenceAnswer: "A pattern for managing distributed transactions across microservices using compensating actions",
    explanation: "Saga manages distributed transactions as a sequence of local transactions. If one fails, compensating transactions roll back previous steps.",
    likeCount: 0,
  },
  {
    id: "offline-ms-6", title: "What is the difference between synchronous and asynchronous communication?",
    category: "Microservices", difficulty: "Easy", type: "MCQ",
    options: "They are the same,Synchronous blocks until response while asynchronous uses message queues and doesn't block,Async is slower,Sync uses events",
    referenceAnswer: "Synchronous blocks until response while asynchronous uses message queues and doesn't block",
    explanation: "Sync: REST/gRPC, caller waits. Async: messaging (Kafka, RabbitMQ), caller continues immediately. Async improves resilience and decoupling.",
    likeCount: 0,
  },
  {
    id: "offline-ms-7", title: "What is an event-driven architecture?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "A UI framework,An architecture where services communicate by producing and consuming events,A database design,A testing approach",
    referenceAnswer: "An architecture where services communicate by producing and consuming events",
    explanation: "Services publish events to a broker (Kafka, RabbitMQ). Other services subscribe and react. This achieves loose coupling and scalability.",
    likeCount: 0,
  },
  {
    id: "offline-ms-8", title: "What is the Strangler Fig pattern?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "A plant biology concept,A migration strategy that incrementally replaces monolith functionality with microservices,A caching pattern,A security pattern",
    referenceAnswer: "A migration strategy that incrementally replaces monolith functionality with microservices",
    explanation: "Named after the strangler fig tree, this pattern gradually replaces parts of a monolith with microservices until the monolith is fully replaced.",
    likeCount: 0,
  },
  {
    id: "offline-ms-9", title: "What is a sidecar pattern?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "A motorcycle accessory,A helper container deployed alongside the main service container for cross-cutting concerns,A database replica,A frontend pattern",
    referenceAnswer: "A helper container deployed alongside the main service container for cross-cutting concerns",
    explanation: "A sidecar (e.g., Envoy in Istio) runs alongside each service, handling logging, monitoring, networking, and security without modifying the service code.",
    likeCount: 0,
  },
  {
    id: "offline-ms-10", title: "What is CQRS (Command Query Responsibility Segregation)?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "A SQL command,A pattern that separates read and write models for a data store,A REST convention,A testing methodology",
    referenceAnswer: "A pattern that separates read and write models for a data store",
    explanation: "CQRS uses separate models for updating and reading data. This allows independent scaling and optimization of read and write workloads.",
    likeCount: 0,
  },
  {
    id: "offline-ms-11", title: "What is a service mesh?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "A networking cable,A dedicated infrastructure layer for handling service-to-service communication,A database cluster,An API specification",
    referenceAnswer: "A dedicated infrastructure layer for handling service-to-service communication",
    explanation: "A service mesh (Istio, Linkerd) handles traffic management, security, and observability between services using sidecar proxies.",
    likeCount: 0,
  },
  {
    id: "offline-ms-12", title: "What is the Bulkhead pattern?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "A ship construction term only,A pattern that isolates failures by partitioning resources for different services,A load balancing strategy,A caching technique",
    referenceAnswer: "A pattern that isolates failures by partitioning resources for different services",
    explanation: "Like bulkheads in ships, this pattern allocates separate thread pools or resources to different services, preventing one failed service from consuming all resources.",
    likeCount: 0,
  },
  {
    id: "offline-ms-13", title: "What is distributed tracing?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "Tracing network cables,Tracking a request as it flows through multiple microservices for debugging and monitoring,Log aggregation,Error handling",
    referenceAnswer: "Tracking a request as it flows through multiple microservices for debugging and monitoring",
    explanation: "Distributed tracing (Zipkin, Jaeger) assigns a unique trace ID to each request and tracks it across service boundaries for performance analysis.",
    likeCount: 0,
  },
  {
    id: "offline-ms-14", title: "What is the difference between orchestration and choreography?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "They are the same,Orchestration has a central coordinator while choreography has services reacting to events independently,Orchestration is async only,Choreography requires a database",
    referenceAnswer: "Orchestration has a central coordinator while choreography has services reacting to events independently",
    explanation: "Orchestration: a central service directs others. Choreography: services listen for events and act independently. Choreography is more decoupled.",
    likeCount: 0,
  },
  {
    id: "offline-ms-15", title: "What is a common approach for database management in microservices?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "Shared database for all services,Database per service pattern,No database needed,Single table for all services",
    referenceAnswer: "Database per service pattern",
    explanation: "Each microservice owns its database, ensuring loose coupling and independent data evolution. This is the 'database per service' pattern.",
    likeCount: 0,
  },
  {
    id: "offline-ms-16", title: "What is the purpose of a configuration server in microservices?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "Runs tests,Centralizes and manages configuration for all microservices,Deploys services,Handles authentication",
    referenceAnswer: "Centralizes and manages configuration for all microservices",
    explanation: "Config servers (Spring Cloud Config) externalize configuration, allowing changes without redeployment and maintaining consistency across environments.",
    likeCount: 0,
  },
  {
    id: "offline-ms-17", title: "What is idempotency and why is it important in microservices?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "A mathematical concept only,Ensuring repeated identical requests produce the same result which prevents duplicate processing,A security feature,A testing method",
    referenceAnswer: "Ensuring repeated identical requests produce the same result which prevents duplicate processing",
    explanation: "Idempotent operations can be retried safely without side effects. Critical in distributed systems where network failures may cause duplicate requests.",
    likeCount: 0,
  },
  {
    id: "offline-ms-18", title: "What is the purpose of health checks in microservices?",
    category: "Microservices", difficulty: "Easy", type: "MCQ",
    options: "Medical checkups,Endpoints that report the service's operational status for monitoring and orchestration,Performance tests,Security audits",
    referenceAnswer: "Endpoints that report the service's operational status for monitoring and orchestration",
    explanation: "Health check endpoints (/health) allow load balancers and orchestrators (Kubernetes) to determine if a service is ready to receive traffic.",
    likeCount: 0,
  },
  {
    id: "offline-ms-19", title: "What is a canary deployment?",
    category: "Microservices", difficulty: "Medium", type: "MCQ",
    options: "Deploying to a bird sanctuary,Rolling out new version to a small subset of users before full deployment,Deploying at night,Deploying without testing",
    referenceAnswer: "Rolling out new version to a small subset of users before full deployment",
    explanation: "Canary deployments route a small percentage of traffic to the new version. If no issues arise, traffic is gradually shifted from the old version.",
    likeCount: 0,
  },
  {
    id: "offline-ms-20", title: "What is the Back Pressure pattern?",
    category: "Microservices", difficulty: "Hard", type: "MCQ",
    options: "Physical pressure,A mechanism where the consumer signals the producer to slow down when overwhelmed,A compression algorithm,A routing strategy",
    referenceAnswer: "A mechanism where the consumer signals the producer to slow down when overwhelmed",
    explanation: "Back pressure prevents system overload by allowing downstream services to control the rate of incoming data/requests from upstream services.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 7. SQL MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-sql-1", title: "What is the difference between WHERE and HAVING clauses?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "They are the same,WHERE filters rows before grouping while HAVING filters groups after aggregation,HAVING is faster,WHERE works only with JOIN",
    referenceAnswer: "WHERE filters rows before grouping while HAVING filters groups after aggregation",
    explanation: "WHERE filters individual rows before GROUP BY. HAVING filters aggregated results after GROUP BY. HAVING can use aggregate functions.",
    likeCount: 0,
  },
  {
    id: "offline-sql-2", title: "What is a SQL Index and why is it used?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "A table of contents,A data structure that improves query speed by allowing faster lookups,A type of JOIN,A stored procedure",
    referenceAnswer: "A data structure that improves query speed by allowing faster lookups",
    explanation: "Indexes (typically B-tree) create a sorted reference to data, enabling O(log n) lookups instead of O(n) full table scans.",
    likeCount: 0,
  },
  {
    id: "offline-sql-3", title: "What is normalization in databases?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "Making data normal,Organizing data to reduce redundancy and improve data integrity,Sorting data,Backing up data",
    referenceAnswer: "Organizing data to reduce redundancy and improve data integrity",
    explanation: "Normalization (1NF, 2NF, 3NF, BCNF) eliminates data duplication by decomposing tables and establishing relationships through foreign keys.",
    likeCount: 0,
  },
  {
    id: "offline-sql-4", title: "What is the difference between UNION and UNION ALL?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "They are identical,UNION removes duplicates while UNION ALL keeps all rows including duplicates,UNION ALL is slower,UNION only works with 2 tables",
    referenceAnswer: "UNION removes duplicates while UNION ALL keeps all rows including duplicates",
    explanation: "UNION performs a distinct operation on the result set (slower). UNION ALL includes all rows, including duplicates (faster).",
    likeCount: 0,
  },
  {
    id: "offline-sql-5", title: "What is a subquery (nested query)?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "A backup query,A query nested inside another query that provides data to the outer query,A stored procedure,A trigger",
    referenceAnswer: "A query nested inside another query that provides data to the outer query",
    explanation: "Subqueries appear in SELECT, FROM, or WHERE clauses. They execute first and pass results to the outer query.",
    likeCount: 0,
  },
  {
    id: "offline-sql-6", title: "What is the difference between DELETE and TRUNCATE?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "They are identical,DELETE removes specific rows and can be rolled back while TRUNCATE removes all rows and is faster,TRUNCATE can have WHERE,DELETE is DDL",
    referenceAnswer: "DELETE removes specific rows and can be rolled back while TRUNCATE removes all rows and is faster",
    explanation: "DELETE is DML (logged, can have WHERE, rollbackable). TRUNCATE is DDL (minimal logging, removes all rows, resets identity, faster).",
    likeCount: 0,
  },
  {
    id: "offline-sql-7", title: "What is a stored procedure?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "A saved query,A precompiled collection of SQL statements stored in the database that can be executed as a unit,A table backup,An index type",
    referenceAnswer: "A precompiled collection of SQL statements stored in the database that can be executed as a unit",
    explanation: "Stored procedures encapsulate business logic in the database. They reduce network traffic, improve security, and allow code reuse.",
    likeCount: 0,
  },
  {
    id: "offline-sql-8", title: "What is a Common Table Expression (CTE)?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "A permanent table,A temporary named result set defined within a WITH clause,A view,A stored procedure",
    referenceAnswer: "A temporary named result set defined within a WITH clause",
    explanation: "CTEs improve readability by breaking complex queries into named subqueries. They exist only for the duration of the query execution.",
    likeCount: 0,
  },
  {
    id: "offline-sql-9", title: "What is a window function in SQL?",
    category: "SQL", difficulty: "Hard", type: "MCQ",
    options: "A GUI function,A function that performs calculations across a set of rows related to the current row using OVER(),A JOIN type,A trigger function",
    referenceAnswer: "A function that performs calculations across a set of rows related to the current row using OVER()",
    explanation: "Window functions (ROW_NUMBER, RANK, SUM OVER) compute values across row sets without collapsing rows, unlike GROUP BY aggregations.",
    likeCount: 0,
  },
  {
    id: "offline-sql-10", title: "What are ACID properties in databases?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "A chemical term,Atomicity Consistency Isolation Durability - guarantees for reliable transactions,A database type,An indexing strategy",
    referenceAnswer: "Atomicity Consistency Isolation Durability - guarantees for reliable transactions",
    explanation: "ACID ensures transactions are all-or-nothing (Atomic), leave data valid (Consistent), don't interfere (Isolated), and persist (Durable).",
    likeCount: 0,
  },
  {
    id: "offline-sql-11", title: "What is the difference between a VIEW and a TABLE?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "They are the same,A view is a virtual table based on a query and does not store data physically,Views are faster,Tables cannot be queried",
    referenceAnswer: "A view is a virtual table based on a query and does not store data physically",
    explanation: "Views are saved SELECT statements that behave like tables. They simplify queries, provide security (limiting column access), and don't store data.",
    likeCount: 0,
  },
  {
    id: "offline-sql-12", title: "What is a deadlock in SQL?",
    category: "SQL", difficulty: "Hard", type: "MCQ",
    options: "A locked door,Two or more transactions waiting for each other to release locks creating a circular dependency,A table lock,A query timeout",
    referenceAnswer: "Two or more transactions waiting for each other to release locks creating a circular dependency",
    explanation: "Deadlocks occur when transactions hold locks and wait for each other. The database detects and kills one transaction to break the cycle.",
    likeCount: 0,
  },
  {
    id: "offline-sql-13", title: "What is the difference between clustered and non-clustered indexes?",
    category: "SQL", difficulty: "Hard", type: "MCQ",
    options: "They are the same,Clustered index sorts the actual data rows while non-clustered has a separate structure pointing to data,Non-clustered is faster always,Clustered are for text only",
    referenceAnswer: "Clustered index sorts the actual data rows while non-clustered has a separate structure pointing to data",
    explanation: "A table can have only one clustered index (determines physical row order). Multiple non-clustered indexes are allowed (separate lookup structure).",
    likeCount: 0,
  },
  {
    id: "offline-sql-14", title: "What does the COALESCE function do?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "Combines tables,Returns the first non-null value from a list of arguments,Counts rows,Groups results",
    referenceAnswer: "Returns the first non-null value from a list of arguments",
    explanation: "COALESCE(a, b, c) returns the first non-null value. Useful for providing default values: COALESCE(nickname, first_name, 'Unknown').",
    likeCount: 0,
  },
  {
    id: "offline-sql-15", title: "What is a self-join?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "Joining without conditions,A join where a table is joined with itself,An automatic join,A cross join",
    referenceAnswer: "A join where a table is joined with itself",
    explanation: "Self-joins are useful for hierarchical data (employees-managers) or comparing rows within the same table using table aliases.",
    likeCount: 0,
  },
  {
    id: "offline-sql-16", title: "What is the difference between CHAR and VARCHAR?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "They are identical,CHAR is fixed-length and VARCHAR is variable-length,CHAR is for numbers,VARCHAR is deprecated",
    referenceAnswer: "CHAR is fixed-length and VARCHAR is variable-length",
    explanation: "CHAR(10) always uses 10 bytes. VARCHAR(10) uses only the bytes needed plus length overhead. Use CHAR for fixed-size data like country codes.",
    likeCount: 0,
  },
  {
    id: "offline-sql-17", title: "What is a trigger in SQL?",
    category: "SQL", difficulty: "Medium", type: "MCQ",
    options: "A button,A stored procedure that automatically executes in response to certain events on a table,A constraint,An index",
    referenceAnswer: "A stored procedure that automatically executes in response to certain events on a table",
    explanation: "Triggers fire automatically on INSERT, UPDATE, or DELETE events. Used for auditing, validation, or maintaining derived data.",
    likeCount: 0,
  },
  {
    id: "offline-sql-18", title: "What is the purpose of GROUP BY?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "Sorts results,Groups rows with the same values and allows aggregate functions to be applied,Joins tables,Filters data",
    referenceAnswer: "Groups rows with the same values and allows aggregate functions to be applied",
    explanation: "GROUP BY groups rows sharing a value, enabling aggregations like COUNT, SUM, AVG on each group. Used with HAVING for filtering groups.",
    likeCount: 0,
  },
  {
    id: "offline-sql-19", title: "What is a foreign key constraint?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "A key from another country,A constraint that ensures referential integrity between two tables,A primary key alias,An index type",
    referenceAnswer: "A constraint that ensures referential integrity between two tables",
    explanation: "Foreign keys ensure that values in a column match values in a referenced table's primary key, maintaining data consistency.",
    likeCount: 0,
  },
  {
    id: "offline-sql-20", title: "What does EXPLAIN or EXPLAIN ANALYZE do?",
    category: "SQL", difficulty: "Hard", type: "MCQ",
    options: "Describes a table,Shows the query execution plan including how the database will access data,Explains SQL syntax,Analyzes table statistics",
    referenceAnswer: "Shows the query execution plan including how the database will access data",
    explanation: "EXPLAIN shows the execution plan (scan types, join order). EXPLAIN ANALYZE actually runs the query and shows real execution times for optimization.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 8. LLD (Low-Level Design) MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-lld-1", title: "Which design pattern ensures a class has only one instance and provides a global point of access?",
    category: "LLD", difficulty: "Easy", type: "MCQ",
    options: "Factory Pattern,Singleton Pattern,Observer Pattern,Builder Pattern",
    referenceAnswer: "Singleton Pattern",
    explanation: "Singleton uses a private constructor and a static method to ensure only one instance exists. Common for logging, configuration, and connection pools.",
    likeCount: 0,
  },
  {
    id: "offline-lld-2", title: "What is the Factory Method pattern?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "A manufacturing process,A pattern that defines an interface for creating objects but lets subclasses decide which class to instantiate,A constructor pattern,A deletion pattern",
    referenceAnswer: "A pattern that defines an interface for creating objects but lets subclasses decide which class to instantiate",
    explanation: "Factory Method defers object creation to subclasses. It promotes loose coupling by eliminating the need to bind application-specific classes into code.",
    likeCount: 0,
  },
  {
    id: "offline-lld-3", title: "What is the Observer pattern used for?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "Watching files,Defining a one-to-many dependency so when one object changes state all dependents are notified,Sorting algorithms,Database access",
    referenceAnswer: "Defining a one-to-many dependency so when one object changes state all dependents are notified",
    explanation: "Observer (pub-sub) decouples subjects from observers. When the subject's state changes, all registered observers are automatically notified.",
    likeCount: 0,
  },
  {
    id: "offline-lld-4", title: "What is the Strategy pattern?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "A game strategy,A pattern that defines a family of algorithms encapsulates each one and makes them interchangeable,A sorting algorithm,A caching strategy",
    referenceAnswer: "A pattern that defines a family of algorithms encapsulates each one and makes them interchangeable",
    explanation: "Strategy lets you swap algorithms at runtime. For example, different payment methods (CreditCard, PayPal) implementing a PaymentStrategy interface.",
    likeCount: 0,
  },
  {
    id: "offline-lld-5", title: "What is the Builder pattern used for?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "Building houses,Constructing complex objects step by step allowing different representations,Creating singletons,Observing objects",
    referenceAnswer: "Constructing complex objects step by step allowing different representations",
    explanation: "Builder separates construction from representation. Useful for objects with many optional parameters: new User.Builder().name(n).email(e).build().",
    likeCount: 0,
  },
  {
    id: "offline-lld-6", title: "What is the Decorator pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "Home decoration,A pattern that dynamically adds responsibilities to objects without modifying their class,A logging pattern,A testing pattern",
    referenceAnswer: "A pattern that dynamically adds responsibilities to objects without modifying their class",
    explanation: "Decorator wraps objects to add behavior. Java I/O uses this: new BufferedReader(new InputStreamReader(new FileInputStream(file))).",
    likeCount: 0,
  },
  {
    id: "offline-lld-7", title: "What is the Adapter pattern?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "A power adapter,A pattern that converts the interface of a class into another interface clients expect,A network adapter,A security pattern",
    referenceAnswer: "A pattern that converts the interface of a class into another interface clients expect",
    explanation: "Adapter acts as a bridge between incompatible interfaces. It wraps an existing class with a new interface without changing its source code.",
    likeCount: 0,
  },
  {
    id: "offline-lld-8", title: "What is the Template Method pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "An HTML template,A pattern that defines the skeleton of an algorithm and lets subclasses override specific steps,A document template,A CSS framework",
    referenceAnswer: "A pattern that defines the skeleton of an algorithm and lets subclasses override specific steps",
    explanation: "Template Method defines the algorithm structure in a base class but delegates specific steps to subclasses. Used in frameworks for hooks/callbacks.",
    likeCount: 0,
  },
  {
    id: "offline-lld-9", title: "What is the Proxy pattern?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "A network proxy only,A pattern that provides a surrogate or placeholder for another object to control access,A firewall,A router",
    referenceAnswer: "A pattern that provides a surrogate or placeholder for another object to control access",
    explanation: "Proxy controls access to the real object. Types: Virtual (lazy loading), Protection (access control), Remote (network calls), Caching.",
    likeCount: 0,
  },
  {
    id: "offline-lld-10", title: "What is the Command pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "A CLI command,A pattern that encapsulates a request as an object allowing parameterization and queuing,A shell script,A SQL command",
    referenceAnswer: "A pattern that encapsulates a request as an object allowing parameterization and queuing",
    explanation: "Command turns requests into objects with execute/undo methods. Enables queuing, logging, and undoable operations.",
    likeCount: 0,
  },
  {
    id: "offline-lld-11", title: "What is the difference between composition and inheritance in design?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "They are the same,Composition uses has-a relationship and is more flexible while inheritance uses is-a,Inheritance is always better,Composition is slower",
    referenceAnswer: "Composition uses has-a relationship and is more flexible while inheritance uses is-a",
    explanation: "\"Favor composition over inheritance\" (GoF). Composition is more flexible, avoids tight coupling, and doesn't break encapsulation like inheritance can.",
    likeCount: 0,
  },
  {
    id: "offline-lld-12", title: "What is the Chain of Responsibility pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "A management hierarchy,A pattern where a request is passed along a chain of handlers until one processes it,A linked list,A callback chain",
    referenceAnswer: "A pattern where a request is passed along a chain of handlers until one processes it",
    explanation: "Each handler decides to process the request or pass it to the next handler. Used in middleware, logging frameworks, and event handling.",
    likeCount: 0,
  },
  {
    id: "offline-lld-13", title: "What is the State pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "A US state,A pattern that allows an object to alter its behavior when its internal state changes,A variable state,A database state",
    referenceAnswer: "A pattern that allows an object to alter its behavior when its internal state changes",
    explanation: "State encapsulates state-specific behavior in separate classes. The object delegates behavior to the current state object, appearing to change its class.",
    likeCount: 0,
  },
  {
    id: "offline-lld-14", title: "When designing a parking lot system, which pattern best models different vehicle types?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "Singleton,Strategy pattern with vehicle type hierarchy,Observer,Builder",
    referenceAnswer: "Strategy pattern with vehicle type hierarchy",
    explanation: "Different vehicle types (Car, Truck, Motorcycle) implement a Vehicle interface. Strategy allows different parking/pricing algorithms per type.",
    likeCount: 0,
  },
  {
    id: "offline-lld-15", title: "What is the Flyweight pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "A lightweight framework,A pattern that reduces memory usage by sharing common parts of state between multiple objects,A compression algorithm,A lazy loading technique",
    referenceAnswer: "A pattern that reduces memory usage by sharing common parts of state between multiple objects",
    explanation: "Flyweight separates intrinsic (shared) state from extrinsic (unique) state. Used when creating many similar objects (game characters, text rendering).",
    likeCount: 0,
  },
  {
    id: "offline-lld-16", title: "What is the Abstract Factory pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "An abstract class,A pattern that provides an interface for creating families of related objects without specifying concrete classes,A factory tour,A code generator",
    referenceAnswer: "A pattern that provides an interface for creating families of related objects without specifying concrete classes",
    explanation: "Abstract Factory creates families of related objects (e.g., DarkThemeFactory creates DarkButton + DarkPanel). Client uses factory interface only.",
    likeCount: 0,
  },
  {
    id: "offline-lld-17", title: "In designing an elevator system, what is a key class relationship?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "Only one Elevator class needed,ElevatorController manages multiple Elevator objects and schedules using a Strategy,Database stores elevator state,No patterns needed",
    referenceAnswer: "ElevatorController manages multiple Elevator objects and schedules using a Strategy",
    explanation: "An ElevatorController orchestrates multiple Elevators. Scheduling algorithms (nearest car, FCFS) can be swapped via Strategy pattern.",
    likeCount: 0,
  },
  {
    id: "offline-lld-18", title: "What is the Mediator pattern?",
    category: "LLD", difficulty: "Hard", type: "MCQ",
    options: "A legal mediator,A pattern that defines an object that encapsulates how objects interact reducing direct coupling,A middleware,A proxy",
    referenceAnswer: "A pattern that defines an object that encapsulates how objects interact reducing direct coupling",
    explanation: "Mediator centralizes communication between objects. Instead of direct references, objects communicate through the mediator, reducing dependencies.",
    likeCount: 0,
  },
  {
    id: "offline-lld-19", title: "What is the Iterator pattern?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "A for loop,A pattern that provides a way to access elements of a collection sequentially without exposing its internal structure,A sorting algorithm,A search method",
    referenceAnswer: "A pattern that provides a way to access elements of a collection sequentially without exposing its internal structure",
    explanation: "Iterator decouples traversal from collection. Java's Iterator interface (hasNext, next) is the classic implementation of this pattern.",
    likeCount: 0,
  },
  {
    id: "offline-lld-20", title: "What principle says 'program to an interface, not an implementation'?",
    category: "LLD", difficulty: "Medium", type: "MCQ",
    options: "KISS,Dependency Inversion and coding to abstractions for flexibility,YAGNI,DRY",
    referenceAnswer: "Dependency Inversion and coding to abstractions for flexibility",
    explanation: "Programming to interfaces allows swapping implementations without changing client code. This is fundamental to dependency inversion and loose coupling.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 9. FRONTEND MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-fe-1", title: "What is the Virtual DOM in React?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "The actual browser DOM,A lightweight JavaScript representation of the real DOM for efficient updates,A CSS framework,A testing tool",
    referenceAnswer: "A lightweight JavaScript representation of the real DOM for efficient updates",
    explanation: "React maintains a virtual DOM in memory. On state changes, it diffs the virtual DOM with the previous version and applies minimal real DOM updates.",
    likeCount: 0,
  },
  {
    id: "offline-fe-2", title: "What is the difference between let, var, and const in JavaScript?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "They are identical,var is function-scoped while let and const are block-scoped and const cannot be reassigned,let is deprecated,const allows reassignment",
    referenceAnswer: "var is function-scoped while let and const are block-scoped and const cannot be reassigned",
    explanation: "var has function scope and hoisting issues. let and const (ES6) are block-scoped. const prevents reassignment but doesn't make objects immutable.",
    likeCount: 0,
  },
  {
    id: "offline-fe-3", title: "What is a closure in JavaScript?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Closing a browser tab,A function that retains access to its outer scope variables even after the outer function has returned,A type of loop,An error handler",
    referenceAnswer: "A function that retains access to its outer scope variables even after the outer function has returned",
    explanation: "Closures allow inner functions to access outer function variables even after execution. This enables data privacy and factory functions.",
    likeCount: 0,
  },
  {
    id: "offline-fe-4", title: "What is the purpose of useEffect in React?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "Creating visual effects,Performing side effects like API calls and subscriptions in functional components,Styling components,Handling forms",
    referenceAnswer: "Performing side effects like API calls and subscriptions in functional components",
    explanation: "useEffect runs after render. It replaces componentDidMount/componentDidUpdate/componentWillUnmount lifecycle methods in class components.",
    likeCount: 0,
  },
  {
    id: "offline-fe-5", title: "What is event bubbling in JavaScript?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Creating bubbles on screen,When an event on a child element propagates up through parent elements,Event cancellation,Async event handling",
    referenceAnswer: "When an event on a child element propagates up through parent elements",
    explanation: "Events bubble from the target element up through ancestors. Use event.stopPropagation() to prevent bubbling. Event delegation leverages this.",
    likeCount: 0,
  },
  {
    id: "offline-fe-6", title: "What is the difference between == and === in JavaScript?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "They are identical,== performs type coercion while === checks type and value strictly,=== is slower,== is deprecated",
    referenceAnswer: "== performs type coercion while === checks type and value strictly",
    explanation: "== converts types before comparing (1 == '1' is true). === requires same type and value (1 === '1' is false). Always prefer ===.",
    likeCount: 0,
  },
  {
    id: "offline-fe-7", title: "What is CSS Flexbox primarily used for?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "3D animations,One-dimensional layout alignment and distribution of space among items,Database queries,Server-side rendering",
    referenceAnswer: "One-dimensional layout alignment and distribution of space among items",
    explanation: "Flexbox handles layout in one direction (row or column). Use CSS Grid for two-dimensional layouts. Flexbox excels at centering and distributing space.",
    likeCount: 0,
  },
  {
    id: "offline-fe-8", title: "What are Promises in JavaScript?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Marriage vows,Objects representing the eventual completion or failure of an async operation,A data type,A design pattern",
    referenceAnswer: "Objects representing the eventual completion or failure of an async operation",
    explanation: "Promises have three states: pending, fulfilled, rejected. They provide .then(), .catch(), .finally() for handling async results, replacing callback hell.",
    likeCount: 0,
  },
  {
    id: "offline-fe-9", title: "What is the purpose of React.memo?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Writing notes,A higher-order component that memoizes a component to prevent unnecessary re-renders,Creating memos,Storing data",
    referenceAnswer: "A higher-order component that memoizes a component to prevent unnecessary re-renders",
    explanation: "React.memo does a shallow comparison of props. If props haven't changed, the component skips re-rendering, improving performance.",
    likeCount: 0,
  },
  {
    id: "offline-fe-10", title: "What is the difference between localStorage and sessionStorage?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "They are identical,localStorage persists until cleared while sessionStorage is cleared when the tab closes,sessionStorage is faster,localStorage is deprecated",
    referenceAnswer: "localStorage persists until cleared while sessionStorage is cleared when the tab closes",
    explanation: "Both store key-value pairs (5-10MB). localStorage persists across browser sessions. sessionStorage is cleared when the browsing session ends.",
    likeCount: 0,
  },
  {
    id: "offline-fe-11", title: "What is the purpose of the key prop in React lists?",
    category: "Frontend", difficulty: "Easy", type: "MCQ",
    options: "Styling,Helps React identify which items changed for efficient re-rendering,Security,Sorting",
    referenceAnswer: "Helps React identify which items changed for efficient re-rendering",
    explanation: "Keys give React a stable identity for each element in a list. Without keys, React may re-render all items instead of only changed ones.",
    likeCount: 0,
  },
  {
    id: "offline-fe-12", title: "What is CORS (Cross-Origin Resource Sharing)?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "A CSS property,A security mechanism that allows or restricts web page requests to different domains,A JavaScript library,A build tool",
    referenceAnswer: "A security mechanism that allows or restricts web page requests to different domains",
    explanation: "CORS uses HTTP headers (Access-Control-Allow-Origin) to control cross-origin requests. Browsers block cross-origin requests unless the server explicitly allows them.",
    likeCount: 0,
  },
  {
    id: "offline-fe-13", title: "What is the difference between useCallback and useMemo in React?",
    category: "Frontend", difficulty: "Hard", type: "MCQ",
    options: "They are the same,useCallback memoizes functions while useMemo memoizes computed values,useMemo is for callbacks,useCallback is deprecated",
    referenceAnswer: "useCallback memoizes functions while useMemo memoizes computed values",
    explanation: "useCallback returns a memoized function reference. useMemo returns a memoized value from a computation. Both prevent unnecessary recalculations.",
    likeCount: 0,
  },
  {
    id: "offline-fe-14", title: "What is the purpose of a Service Worker?",
    category: "Frontend", difficulty: "Hard", type: "MCQ",
    options: "A customer service agent,A script that runs in the background enabling offline support and push notifications,A server process,A database worker",
    referenceAnswer: "A script that runs in the background enabling offline support and push notifications",
    explanation: "Service Workers intercept network requests, cache assets for offline use, and handle push notifications. They are the backbone of PWAs.",
    likeCount: 0,
  },
  {
    id: "offline-fe-15", title: "What is debouncing in JavaScript?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Removing bouncing animations,Delaying function execution until after a specified time has passed since the last call,Error handling,Event binding",
    referenceAnswer: "Delaying function execution until after a specified time has passed since the last call",
    explanation: "Debouncing delays a function call until the user stops triggering it. Common for search input: only search after the user stops typing.",
    likeCount: 0,
  },
  {
    id: "offline-fe-16", title: "What is the Context API in React?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "A REST API,A way to share state across components without prop drilling,A routing library,A testing framework",
    referenceAnswer: "A way to share state across components without prop drilling",
    explanation: "Context provides a way to pass data through the component tree without having to pass props manually at every level. Common for themes, auth, locale.",
    likeCount: 0,
  },
  {
    id: "offline-fe-17", title: "What is the difference between controlled and uncontrolled components in React?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "They are the same,Controlled components have their state managed by React while uncontrolled use DOM refs,Uncontrolled are better,Controlled are deprecated",
    referenceAnswer: "Controlled components have their state managed by React while uncontrolled use DOM refs",
    explanation: "Controlled: value comes from React state (value + onChange). Uncontrolled: value lives in the DOM (ref.current.value). Controlled is preferred.",
    likeCount: 0,
  },
  {
    id: "offline-fe-18", title: "What is tree shaking in JavaScript bundling?",
    category: "Frontend", difficulty: "Hard", type: "MCQ",
    options: "Removing trees from code,Dead code elimination by removing unused exports from the final bundle,Sorting imports,Minification",
    referenceAnswer: "Dead code elimination by removing unused exports from the final bundle",
    explanation: "Tree shaking analyzes import/export statements to eliminate unused code. It relies on ES Module static structure. Reduces bundle size significantly.",
    likeCount: 0,
  },
  {
    id: "offline-fe-19", title: "What is the purpose of the useRef hook in React?",
    category: "Frontend", difficulty: "Medium", type: "MCQ",
    options: "Creating references to other components,Persisting a mutable value across renders without causing re-renders,Styling elements,Routing",
    referenceAnswer: "Persisting a mutable value across renders without causing re-renders",
    explanation: "useRef returns a mutable ref object whose .current property persists across renders. Unlike state, changing ref.current doesn't trigger a re-render.",
    likeCount: 0,
  },
  {
    id: "offline-fe-20", title: "What is the difference between SSR (Server-Side Rendering) and CSR (Client-Side Rendering)?",
    category: "Frontend", difficulty: "Hard", type: "MCQ",
    options: "They are the same,SSR renders HTML on the server for faster first paint while CSR renders in the browser using JavaScript,SSR is slower always,CSR is better for SEO",
    referenceAnswer: "SSR renders HTML on the server for faster first paint while CSR renders in the browser using JavaScript",
    explanation: "SSR (Next.js) improves SEO and initial load speed by sending pre-rendered HTML. CSR (CRA) loads a blank page and renders via JS, offering rich interactivity.",
    likeCount: 0,
  },

  // ══════════════════════════════════════════════════════════════════════
  // 10. AWS MCQ (20)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "offline-aws-1", title: "What is Amazon EC2?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "A database service,A service that provides resizable compute capacity in the cloud,A storage service,A networking service",
    referenceAnswer: "A service that provides resizable compute capacity in the cloud",
    explanation: "EC2 (Elastic Compute Cloud) provides virtual servers (instances) with various CPU, memory, and storage configurations that can be scaled up or down.",
    likeCount: 0,
  },
  {
    id: "offline-aws-2", title: "What is Amazon S3?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "A compute service,An object storage service for storing and retrieving any amount of data,A database,A message queue",
    referenceAnswer: "An object storage service for storing and retrieving any amount of data",
    explanation: "S3 (Simple Storage Service) stores objects in buckets. It provides 99.999999999% (11 nines) durability and supports versioning, encryption, and lifecycle policies.",
    likeCount: 0,
  },
  {
    id: "offline-aws-3", title: "What is the difference between S3 Standard and S3 Glacier?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "They are identical,S3 Standard is for frequent access while Glacier is for archival with lower cost but higher retrieval time,Glacier is faster,Standard is cheaper",
    referenceAnswer: "S3 Standard is for frequent access while Glacier is for archival with lower cost but higher retrieval time",
    explanation: "S3 Standard provides millisecond access for frequent data. Glacier is for archival (minutes to hours retrieval) at ~1/5 the cost.",
    likeCount: 0,
  },
  {
    id: "offline-aws-4", title: "What is AWS Lambda?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "A virtual machine,A serverless compute service that runs code in response to events without managing servers,A container service,A database service",
    referenceAnswer: "A serverless compute service that runs code in response to events without managing servers",
    explanation: "Lambda executes code in response to triggers (API Gateway, S3 events, etc.). You pay only for compute time consumed. No server management needed.",
    likeCount: 0,
  },
  {
    id: "offline-aws-5", title: "What is Amazon RDS?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "A NoSQL database,A managed relational database service supporting MySQL PostgreSQL Oracle and more,A file storage,A compute service",
    referenceAnswer: "A managed relational database service supporting MySQL PostgreSQL Oracle and more",
    explanation: "RDS handles database provisioning, patching, backups, and failover. Multi-AZ deployments provide high availability with automatic failover.",
    likeCount: 0,
  },
  {
    id: "offline-aws-6", title: "What is an AWS VPC?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "Virtual Private Cloud - an isolated virtual network you define in AWS,A virtual PC,A VPN service,A video processing service",
    referenceAnswer: "Virtual Private Cloud - an isolated virtual network you define in AWS",
    explanation: "VPC lets you create a logically isolated section of AWS with your own IP ranges, subnets, route tables, and network gateways.",
    likeCount: 0,
  },
  {
    id: "offline-aws-7", title: "What is Amazon DynamoDB?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "A relational database,A fully managed NoSQL key-value and document database with single-digit millisecond performance,A cache service,A message queue",
    referenceAnswer: "A fully managed NoSQL key-value and document database with single-digit millisecond performance",
    explanation: "DynamoDB is serverless, supports auto-scaling, and provides consistent single-digit millisecond response. Uses partition key + optional sort key.",
    likeCount: 0,
  },
  {
    id: "offline-aws-8", title: "What is AWS IAM?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "I Am Module,Identity and Access Management - controls who can access what AWS resources,An AI service,An integration service",
    referenceAnswer: "Identity and Access Management - controls who can access what AWS resources",
    explanation: "IAM manages users, groups, roles, and policies. It follows the principle of least privilege, granting only necessary permissions.",
    likeCount: 0,
  },
  {
    id: "offline-aws-9", title: "What is an Availability Zone (AZ) in AWS?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "A time zone,One or more discrete data centers with redundant power and networking within a region,A security zone,A pricing tier",
    referenceAnswer: "One or more discrete data centers with redundant power and networking within a region",
    explanation: "Each AWS Region has multiple AZs (typically 3). AZs are physically separated, connected by low-latency links, enabling high availability architectures.",
    likeCount: 0,
  },
  {
    id: "offline-aws-10", title: "What is Amazon CloudFront?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "A weather service,A Content Delivery Network (CDN) that distributes content globally with low latency,A cloud IDE,A DNS service",
    referenceAnswer: "A Content Delivery Network (CDN) that distributes content globally with low latency",
    explanation: "CloudFront caches content at edge locations worldwide. It reduces latency for static/dynamic content by serving from the nearest edge to the user.",
    likeCount: 0,
  },
  {
    id: "offline-aws-11", title: "What is Amazon SQS?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "SQL Service,A fully managed message queuing service for decoupling distributed systems,A search service,A storage service",
    referenceAnswer: "A fully managed message queuing service for decoupling distributed systems",
    explanation: "SQS provides Standard (at-least-once, best-effort ordering) and FIFO (exactly-once, ordered) queues for asynchronous service communication.",
    likeCount: 0,
  },
  {
    id: "offline-aws-12", title: "What is the difference between horizontal and vertical scaling in AWS?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "They are the same,Horizontal adds more instances while vertical increases the size of existing instances,Vertical is always better,Horizontal is cheaper always",
    referenceAnswer: "Horizontal adds more instances while vertical increases the size of existing instances",
    explanation: "Horizontal scaling (scale out): add more EC2 instances behind a load balancer. Vertical scaling (scale up): upgrade to a larger instance type.",
    likeCount: 0,
  },
  {
    id: "offline-aws-13", title: "What is AWS Auto Scaling?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "Automatic code deployment,A service that automatically adjusts the number of EC2 instances based on demand,Database scaling,Storage expansion",
    referenceAnswer: "A service that automatically adjusts the number of EC2 instances based on demand",
    explanation: "Auto Scaling monitors metrics (CPU, requests) and adds/removes instances. It ensures high availability and cost optimization.",
    likeCount: 0,
  },
  {
    id: "offline-aws-14", title: "What is Amazon ECS?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "Elastic Cache Service,A fully managed container orchestration service for running Docker containers,An email service,An encryption service",
    referenceAnswer: "A fully managed container orchestration service for running Docker containers",
    explanation: "ECS manages the deployment, scheduling, and scaling of containerized applications. It integrates with Fargate for serverless container execution.",
    likeCount: 0,
  },
  {
    id: "offline-aws-15", title: "What is AWS CloudWatch?",
    category: "AWS", difficulty: "Easy", type: "MCQ",
    options: "A clock service,A monitoring and observability service for AWS resources and applications,A video streaming service,A security tool",
    referenceAnswer: "A monitoring and observability service for AWS resources and applications",
    explanation: "CloudWatch collects metrics, logs, and events. It provides dashboards, alarms, and can trigger Auto Scaling actions based on thresholds.",
    likeCount: 0,
  },
  {
    id: "offline-aws-16", title: "What is the AWS Shared Responsibility Model?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "Sharing AWS accounts,AWS is responsible for security OF the cloud while customers are responsible for security IN the cloud,AWS handles all security,Customers handle all security",
    referenceAnswer: "AWS is responsible for security OF the cloud while customers are responsible for security IN the cloud",
    explanation: "AWS secures infrastructure (hardware, networking, facilities). Customers secure their data, applications, IAM, encryption, and network configuration.",
    likeCount: 0,
  },
  {
    id: "offline-aws-17", title: "What is Amazon Route 53?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "A highway route,A scalable DNS web service for domain registration and routing,A VPN service,A CDN",
    referenceAnswer: "A scalable DNS web service for domain registration and routing",
    explanation: "Route 53 provides DNS, domain registration, and health checking. It supports routing policies: simple, weighted, latency-based, failover, geolocation.",
    likeCount: 0,
  },
  {
    id: "offline-aws-18", title: "What is Amazon ElastiCache?",
    category: "AWS", difficulty: "Medium", type: "MCQ",
    options: "Elastic storage,A managed in-memory caching service supporting Redis and Memcached,A CDN,A database backup service",
    referenceAnswer: "A managed in-memory caching service supporting Redis and Memcached",
    explanation: "ElastiCache provides microsecond-latency caching. Redis supports richer data structures and persistence. Memcached is simpler for basic caching.",
    likeCount: 0,
  },
  {
    id: "offline-aws-19", title: "What is AWS CloudFormation?",
    category: "AWS", difficulty: "Hard", type: "MCQ",
    options: "Cloud storage,An Infrastructure as Code service that provisions AWS resources using templates,A CI/CD tool,A monitoring tool",
    referenceAnswer: "An Infrastructure as Code service that provisions AWS resources using templates",
    explanation: "CloudFormation uses JSON/YAML templates to define and provision AWS infrastructure. It manages dependencies, rollbacks, and stack updates automatically.",
    likeCount: 0,
  },
  {
    id: "offline-aws-20", title: "What is the difference between Amazon SNS and Amazon SQS?",
    category: "AWS", difficulty: "Hard", type: "MCQ",
    options: "They are the same,SNS is pub/sub for push-based fan-out while SQS is a pull-based message queue,SNS is for email only,SQS is for SMS only",
    referenceAnswer: "SNS is pub/sub for push-based fan-out while SQS is a pull-based message queue",
    explanation: "SNS pushes messages to multiple subscribers simultaneously (fan-out). SQS stores messages for consumers to poll. They're often used together.",
    likeCount: 0,
  },
];

const initialResult = { score: null, feedback: "", referenceAnswer: "", originalQuestion: "" };

function App() {
  const [showAdmin, setShowAdmin] = useState(() => window.location.hash === "#admin");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(initialResult);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Phase 2 New State
  const [showDaily, setShowDaily] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeCompany, setActiveCompany] = useState("All");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitMode, setSubmitMode] = useState("question");
  const [feedMode, setFeedMode] = useState("foryou");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [mistakes, setMistakes] = useState(() => JSON.parse(localStorage.getItem("interview_mistakes") || "[]"));
  const [likedIds, setLikedIds] = useState(() => new Set(JSON.parse(localStorage.getItem("interview_liked_ids") || "[]")));
  const [likedQuestions, setLikedQuestions] = useState(() => JSON.parse(localStorage.getItem("interview_liked_questions") || "[]"));
  const [rechallengeQuestion, setRechallengeQuestion] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bonus, setBonus] = useState(null);
  const [isSpeedMode, setIsSpeedMode] = useState(() => localStorage.getItem("interview_speed_mode") === "true");
  const [timerValue, setTimerValue] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [confidence, setConfidence] = useState(null);
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [rankFlash, setRankFlash] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0, total: 0, xp: parseInt(localStorage.getItem("interview_xp") || "0")
  });
  const [isBoss, setIsBoss] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [slideDir, setSlideDir] = useState(null);
  const touchStartY = useRef(null);

  const textareaRef = useRef(null);

  const levelInfo = (xp) => {
    if (xp < 100) return { name: "Beginner", lvl: 1 };
    if (xp < 300) return { name: "Rising Star", lvl: 2 };
    if (xp < 1000) return { name: "Intermediate", lvl: 5 };
    return { name: "Interview Master", lvl: 10 };
  };

  const playSound = (name) => {
    try {
      const audio = SOUNDS[name];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
          // Silent catch for autoplay policies or broken sources
          console.warn(`Audio play failed for ${name}:`, err.message);
        });
      }
    } catch(e) {}
  };

  const triggerHaptic = (pattern = 50) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  const loadFeed = async (reset = false) => {
    if (isFetchingMore) return;
    if (reset) { setIsLoading(true); setPage(0); setQuestions([]); }
    else setIsFetchingMore(true);

    try {
      let data;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      if (activeCompany !== "All") {
        data = await Promise.race([
          fetchByCompany(activeCompany),
          timeoutPromise
        ]);
        setHasMore(false);
      } else {
        data = await Promise.race([
          fetchQuestions(reset ? 0 : page + 1),
          timeoutPromise
        ]);
        setPage(prev => reset ? 0 : prev + 1);
        setHasMore(data.length === 20);
      }

      setQuestions(prev => reset ? data : [...prev, ...data]);
      setBackendReady(true);
      setOfflineMode(false);
    } catch (e) {
      if (reset) {
        setOfflineMode(true);
        setQuestions(OFFLINE_QUESTIONS);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => { loadFeed(true); }, [activeCompany]);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // Visitor Tracking Ping
  useEffect(() => {
    const platform = window.innerWidth <= 768 ? "MOBILE" : "DESKTOP";
    pingVisitor(platform, 0);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Infinite Scroll Observer
  useEffect(() => {
    if (currentIndex >= questions.length - 3 && hasMore && !isFetchingMore && activeCompany === "All") {
      loadFeed();
    }
  }, [currentIndex, questions.length]);

  const activeQuestions = searchResults || (feedMode === "following" ? [...mistakes, ...likedQuestions] : questions);
  
  const currentQuestion = rechallengeQuestion || 
    (activeQuestions.length === 0 ? null : activeQuestions[currentIndex % activeQuestions.length]);

  // Visual Timer Logic
  useEffect(() => {
    if (!timerActive || result.score !== null) return;
    const interval = setInterval(() => {
      setTimerValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true); // Auto-reveal on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, result.score, currentQuestion]);
  const handleSubmit = async (forceReveal = false) => {
    if (!currentQuestion || (!answer.trim() && !forceReveal && !showOptions) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      let res;
      
      if (offlineMode || String(currentQuestion.id).startsWith("offline-")) {
        await new Promise(r => setTimeout(r, 400));
        const isCorrect = !forceReveal && answer.toLowerCase().trim() === (currentQuestion.referenceAnswer || "").toLowerCase().trim();
        res = {
          score: isCorrect ? 10 : 1,
          feedback: isCorrect ? "Awesome job!" : "Incorrect. See the reference answer.",
          referenceAnswer: currentQuestion.referenceAnswer || "Offline fallback completed.",
        };
      } else {
        res = await submitAnswer({ questionId: currentQuestion.id, userAnswer: forceReveal ? "Reveal" : answer.trim() });
      }

      setResult({ ...res, originalQuestion: currentQuestion.title });
      
      if (res.score >= 7) {
        playSound("ding");
        triggerHaptic([50, 30, 50]);
        setStreak(s => s + 1);
        updateLeaderboardProgress(res.score);
      } else {
        playSound("error");
        setStreak(0);
        // Add to mistakes if not already there
        if (!mistakes.find(m => m.id === currentQuestion.id)) {
          const newMistakes = [currentQuestion, ...mistakes].slice(0, 50);
          setMistakes(newMistakes);
          localStorage.setItem("interview_mistakes", JSON.stringify(newMistakes));
        }
      }
      
      setSessionStats(prev => ({ ...prev, total: prev.total + 1, xp: prev.xp + res.score }));
      localStorage.setItem("interview_xp", (sessionStats.xp + res.score).toString());
    } catch (e) {
      setError("Connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    playSound("whoosh");
    triggerHaptic(20);
    setSlideDir("up");
    setTimeout(() => {
      setSlideDir(null);
      setCurrentIndex(prev => (prev + 1) % activeQuestions.length);
      setAnswer("");
      setResult(initialResult);
      setConfidence(null);
      setTimerValue(60);
      setTimerActive(true);
    }, 400);
  };

  const handleSkip = () => {
    if (currentQuestion?.id) skipQuestion(currentQuestion.id);
    handleNext();
  };

  const handleLike = async () => {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const isLiked = likedIds.has(qid);
    
    // Toggle locally for instant feedback
    const newLikedIds = new Set(likedIds);
    if (isLiked) {
      newLikedIds.delete(qid);
      setLikedQuestions(prev => prev.filter(q => q.id !== qid));
    } else {
      newLikedIds.add(qid);
      setLikedQuestions(prev => [...prev, currentQuestion]);
      likeQuestion(qid); // Only call API on like, not unlike (simplified)
    }
    setLikedIds(newLikedIds);
    localStorage.setItem("interview_liked_ids", JSON.stringify([...newLikedIds]));
  };

  // TOUCH GESTURE HANDLING
  const handleTouchStart = (e) => {
    // Ignore if swiping inside interactive elements
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.closest('.mcq-container')) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    // threshold of 70px for swipe up
    if (deltaY > 70) {
      handleSkip();
    }
    touchStartY.current = null;
  };

  if (showAdmin) return <AdminPanel onExit={() => setShowAdmin(false)} />;

  return (
    <div 
      className={`tiktok-container ${isBoss ? "boss-mode" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isLoading && <ShimmerCard />}
      
      {!isLoading && (
        <main className={`feed-item ${slideDir ? `slide-${slideDir}` : ""}`}>
          <nav className="top-nav">
            <div className="top-left-profile" onClick={() => setShowLeaderboard(true)}>
              <div className="boss-avatar" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{getVisitorId().substring(0, 4)}</div>
              <div className="level-badge">Lvl {levelInfo(sessionStats.xp).lvl}</div>
            </div>

            <div className="nav-buttons">
              <button className={feedMode === "following" ? "active" : ""} onClick={() => setFeedMode("following")}>
                Mistakes {mistakes.length > 0 && <span className="mistake-count-badge">{mistakes.length}</span>}
              </button>
              <button className={feedMode === "foryou" ? "active" : ""} onClick={() => setFeedMode("foryou")}>For You</button>
            </div>

            <div className="top-right-actions">
              {deferredPrompt && (
                <button className="install-btn" onClick={handleInstallClick}>📲 App</button>
              )}
              <button className="icon-vibe" onClick={() => setShowAdmin(true)}>🛡️</button>
              <button className="icon-vibe" onClick={() => setShowSearch(true)}>🔍</button>
            </div>
          </nav>

          <div className="timer-bar-container">
            <div 
              className="timer-bar-fill" 
              style={{ width: `${(timerValue / 60) * 100}%` }}
            ></div>
          </div>

          <CompanyFilter activeCompany={activeCompany} onSelect={setActiveCompany} />

          <section className="content-area">
            {bonus && <div className="bonus-toast"><h3>🎉 {bonus.message}</h3></div>}

            {result.score === null ? (
              <div className="question-text-wrapper">
                <h1>{currentQuestion?.title}</h1>
                <div className="hashtags">
                  <span>{currentQuestion?.category}</span>
                  <span>{currentQuestion?.difficulty}</span>
                  {currentQuestion?.company && <span className="company-tag">🏢 {currentQuestion.company}</span>}
                  {offlineMode && <span className="offline-tag">OFFLINE</span>}
                </div>

                {currentQuestion?.type === "CODE" && (
                  <CodeSandbox 
                    initialCode={currentQuestion.options} 
                    onAnswerChange={setAnswer} 
                  />
                )}

                {currentQuestion?.type === "MCQ" && currentQuestion?.options && (
                  <div className="mcq-container" style={{ marginTop: '15px' }}>
                    {(typeof currentQuestion.options === "string" 
                      ? currentQuestion.options.split(",") 
                      : currentQuestion.options
                    ).map((opt, i) => (
                      <button 
                        key={i} 
                        className={`choice-chip ${answer === opt ? "active glow-cyan" : ""}`}
                        onClick={() => {
                          setAnswer(opt);
                          triggerHaptic(15);
                          playSound("ding");
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="result-overlay glass-card fade-in">
                <div className="question-recap">
                  <div className="recap-header">
                    <h3>Question Recap</h3>
                  </div>
                  <p>{currentQuestion?.title}</p>
                </div>

                <div className="score-ring">
                  <span className="score-num">{result.score}</span>
                </div>
                <p className="feedback-text">{result.feedback}</p>
                
                <div className="comp-minimal">
                  <div className="comp-row"><b>YOU:</b> <p>{answer || "Revealed"}</p></div>
                  <div className="comp-row"><b>IDEAL:</b> <p>{result.referenceAnswer}</p></div>
                </div>

                {currentQuestion?.explanation && (
                  <div className="explanation-box fade-in">
                    <p className="explanation-tag">💡 WHY THIS IS CORRECT:</p>
                    <p className="explanation-content">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                <div className="result-controls">
                  <button className="retry-btn-inline" onClick={() => { 
                    setResult(initialResult); 
                    setTimerValue(60); 
                    setTimerActive(true); 
                  }}>Retry</button>
                  <button className="pause-btn" onClick={handleNext}>Next Question</button>
                </div>
              </div>
            )}

            <div className="input-section">
              {result.score === null && currentQuestion?.type !== "CODE" && currentQuestion?.type !== "MCQ" && (
                confidence === null ? (
                  <div className="confidence-selector">
                    <p>Ready to swipe? 🤔</p>
                    <div className="icons">
                      <button onClick={() => setConfidence(0)}>😐</button>
                      <button onClick={() => setConfidence(1)}>🙂</button>
                      <button onClick={() => setConfidence(2)}>😎</button>
                    </div>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    className="tiktok-answer-box glass-neo"
                    placeholder="Type your elite answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    autoFocus
                  />
                )
              )}
            </div>
          </section>

          <aside className="side-bar">
            <div className="action-item" onClick={() => setShowLeaderboard(true)}>
              <div className="icon-btn leader">🏆</div>
              <span>Rank</span>
            </div>
            <div className="action-item" onClick={() => setShowDaily(true)}>
              <div className="icon-btn daily">🌟</div>
              <span>Daily</span>
            </div>
            <div className="action-item" onClick={handleLike}>
              <div className={`icon-btn heart ${likedIds.has(currentQuestion?.id) ? "active" : ""}`}>❤️</div>
              <span>{likedIds.has(currentQuestion?.id) ? "Liked" : "Like"}</span>
            </div>
            <div className="action-item" onClick={() => { setSubmitMode("comment"); setShowSubmit(true); }}>
              <div className="icon-btn comment">💬</div>
              <span>Comment</span>
            </div>
            <div className="action-item" onClick={() => handleSubmit(false)}>
              <div className="icon-btn submit">🚀</div>
              <span>{isSubmitting ? "..." : "Send"}</span>
            </div>
            <div className="action-item" onClick={handleSkip}>
              <div className="icon-btn next">⏭️</div>
              <span>Skip</span>
            </div>
            <div className="music-disc-wrapper">
              <div className="music-disc rotating">🔥{streak}</div>
            </div>
          </aside>
        </main>
      )}

      {/* MODALS */}
      {showDaily && <DailyChallenge onClose={() => setShowDaily(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showSearch && (
        <div className="search-overlay">
          <SearchBar onResults={setSearchResults} onClose={() => { setShowSearch(false); setSearchResults(null); }} />
        </div>
      )}
      {showSubmit && <UserSubmit questionId={currentQuestion?.id} defaultMode={submitMode} onClose={() => setShowSubmit(false)} />}
    </div>
  );
}

export default App;
