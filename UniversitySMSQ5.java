import java.util.*;
import java.util.regex.*;

// Student class
class Student {
    String id;
    String name;
    String course;
    int marks;

    Student(String id, String name, String course, int marks) {
        this.id = id;
        this.name = name;
        this.course = course;
        this.marks = marks;
    }

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name + ", Course: " + course + ", Marks: " + marks;
    }
}

// Interface
interface StudentOperation {
    void addStudent(String id, String name, String course, int marks);
    void displayStudents();
    void removeStudent(String id);
    void searchStudent(String id);
    void sortByMarks();
    void convertHashMapToTreeMap();
    void countCourseWise();
    void displayCourses();
}

// Implementation
class StudentManager implements StudentOperation {
    private ArrayList<Student> students = new ArrayList<>();
    private Vector<Student> vector = new Vector<>();
    private Stack<Student> stack = new Stack<>();
    private HashMap<String, Student> hashMap = new HashMap<>();
    private Hashtable<String, Student> hashTable = new Hashtable<>();
    private TreeMap<String, Student> treeMap = new TreeMap<>();
    private Set<String> courses = new HashSet<>();

    // Regex patterns
    private static final String ID_REGEX = "^[0-9]{3,5}$";
    private static final String NAME_REGEX = "^[A-Za-z]{2,20}$";
    private static final String COURSE_REGEX = "^[A-Za-z]{2,15}$";
    private static final String MARKS_REGEX = "^[0-9]{1,3}$";

    private boolean validate(String input, String regex) {
        return Pattern.matches(regex, input);
    }

    @Override
    public void addStudent(String id, String name, String course, int marks) {
        try {
            if (!validate(id, ID_REGEX)) throw new IllegalArgumentException("Invalid ID!");
            if (!validate(name, NAME_REGEX)) throw new IllegalArgumentException("Invalid Name!");
            if (!validate(course, COURSE_REGEX)) throw new IllegalArgumentException("Invalid Course!");
            if (!validate(String.valueOf(marks), MARKS_REGEX)) throw new IllegalArgumentException("Invalid Marks!");

            if (hashMap.containsKey(id)) {
                throw new IllegalArgumentException("Duplicate ID not allowed!");
            }

            Student s = new Student(id, name, course, marks);
            students.add(s);
            vector.add(s);
            hashMap.put(id, s);
            hashTable.put(id, s);
            courses.add(course);

            System.out.println("✅ Student added successfully!");
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
        }
    }

    @Override
    public void displayStudents() {
        if (students.isEmpty()) {
            System.out.println("❌ No students found!");
            return;
        }
        System.out.println("\n--- Student Records ---");
        for (Student s : students) {
            System.out.println(s);
        }
    }

    @Override
    public void removeStudent(String id) {
        Student s = hashMap.remove(id);
        if (s != null) {
            students.remove(s);
            vector.remove(s);
            hashTable.remove(id);
            treeMap.remove(id);
            stack.push(s); // store in stack for undo
            System.out.println("✅ Student removed successfully!");
        } else {
            System.out.println("❌ Student not found!");
        }
    }

    @Override
    public void searchStudent(String id) {
        Student s = hashMap.get(id);
        if (s != null) {
            System.out.println("✅ Student Found: " + s);
        } else {
            System.out.println("❌ Student not found!");
        }
    }

    @Override
    public void sortByMarks() {
        students.sort(Comparator.comparingInt(st -> st.marks));
        System.out.println("\n--- Students Sorted by Marks ---");
        for (Student s : students) {
            System.out.println(s);
        }
    }

    @Override
    public void convertHashMapToTreeMap() {
        treeMap.putAll(hashMap);
        System.out.println("\n--- HashMap Converted to TreeMap ---");
        treeMap.forEach((k, v) -> System.out.println(v));
    }

    @Override
    public void countCourseWise() {
        Map<String, Integer> courseCount = new HashMap<>();
        for (Student s : students) {
            courseCount.put(s.course, courseCount.getOrDefault(s.course, 0) + 1);
        }
        System.out.println("\n--- Course-wise Student Count ---");
        courseCount.forEach((course, count) -> System.out.println(course + ": " + count));
    }

    @Override
    public void displayCourses() {
        System.out.println("\n--- Unique Courses ---");
        for (String c : courses) {
            System.out.println(c);
        }
    }
}

public class UniversitySMSQ5 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StudentManager manager = new StudentManager();

        while (true) {
            System.out.println("\n--- University Student Management System ---");
            System.out.println("1. Add Student");
            System.out.println("2. Display All Students");
            System.out.println("3. Remove Student by ID");
            System.out.println("4. Search Student by ID");
            System.out.println("5. Sort Students by Marks");
            System.out.println("6. Convert HashMap to TreeMap");
            System.out.println("7. Count Students Course-wise");
            System.out.println("8. Display All Courses");
            System.out.println("9. Exit");
            System.out.print("Enter choice: ");

            int choice = sc.nextInt();
            sc.nextLine(); // consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter ID: ");
                    String id = sc.nextLine();
                    System.out.print("Enter Name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter Course: ");
                    String course = sc.nextLine();
                    System.out.print("Enter Marks: ");
                    int marks = sc.nextInt();
                    manager.addStudent(id, name, course, marks);
                    break;
                case 2: manager.displayStudents(); break;
                case 3:
                    System.out.print("Enter ID to remove: ");
                    String removeId = sc.nextLine();
                    manager.removeStudent(removeId);
                    break;
                case 4:
                    System.out.print("Enter ID to search: ");
                    String searchId = sc.nextLine();
                    manager.searchStudent(searchId);
                    break;
                case 5: manager.sortByMarks(); break;
                case 6: manager.convertHashMapToTreeMap(); break;
                case 7: manager.countCourseWise(); break;
                case 8: manager.displayCourses(); break;
                case 9:
                    System.out.println("👋 Exiting... Goodbye!");
                    sc.close();
                    return;
                default: System.out.println("❌ Invalid choice!");
            }
        }
    }
}
