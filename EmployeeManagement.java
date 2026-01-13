import java.util.*;
import java.util.regex.*;

// Employee class
class Employee {
    String id;
    String name;
    String email;

    Employee(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name + ", Email: " + email;
    }
}

// Interface for Employee Operations
interface EmployeeOperation {
    void addEmployee(String id, String name, String email);
    void displayEmployees();
    void searchEmployee(String id);
    void removeEmployee(String id);
    void demonstrateNullSupport();
}

// Implementation using HashMap, Hashtable, TreeMap
class EmployeeManager implements EmployeeOperation {
    private Map<String, Employee> hashMap = new HashMap<>();
    private Map<String, Employee> hashTable = new Hashtable<>();
    private Map<String, Employee> treeMap = new TreeMap<>();

    // Regex patterns
    private static final String ID_REGEX = "^[0-9]{3,5}$"; // 3–5 digit ID
    private static final String NAME_REGEX = "^[A-Za-z]{2,20}$";
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

    private boolean validate(String input, String regex) {
        return Pattern.matches(regex, input);
    }

    @Override
    public void addEmployee(String id, String name, String email) {
        try {
            if (!validate(id, ID_REGEX)) throw new IllegalArgumentException("Invalid Employee ID!");
            if (!validate(name, NAME_REGEX)) throw new IllegalArgumentException("Invalid Name!");
            if (!validate(email, EMAIL_REGEX)) throw new IllegalArgumentException("Invalid Email!");

            Employee emp = new Employee(id, name, email);
            hashMap.put(id, emp);
            hashTable.put(id, emp);
            treeMap.put(id, emp);

            System.out.println("✅ Employee added successfully!");
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
        }
    }

    @Override
    public void displayEmployees() {
        System.out.println("\n--- HashMap Employees ---");
        hashMap.forEach((k, v) -> System.out.println(v));

        System.out.println("\n--- Hashtable Employees ---");
        hashTable.forEach((k, v) -> System.out.println(v));

        System.out.println("\n--- TreeMap Employees ---");
        treeMap.forEach((k, v) -> System.out.println(v));
    }

    @Override
    public void searchEmployee(String id) {
        if (hashMap.containsKey(id))
            System.out.println("Found in HashMap: " + hashMap.get(id));
        else
            System.out.println("Not found in HashMap.");

        if (hashTable.containsKey(id))
            System.out.println("Found in Hashtable: " + hashTable.get(id));
        else
            System.out.println("Not found in Hashtable.");

        if (treeMap.containsKey(id))
            System.out.println("Found in TreeMap: " + treeMap.get(id));
        else
            System.out.println("Not found in TreeMap.");
    }

    @Override
    public void removeEmployee(String id) {
        hashMap.remove(id);
        hashTable.remove(id);
        treeMap.remove(id);
        System.out.println("✅ Employee removed successfully!");
    }

    @Override
    public void demonstrateNullSupport() {
        System.out.println("\n--- Null Key/Value Demonstration ---");

        // HashMap allows one null key and multiple null values
        hashMap.put(null, new Employee("000", "NullKey", "null@demo.com"));
        hashMap.put("111", null);
        hashMap.put("222", null);
        System.out.println("HashMap with null key/value: " + hashMap);

        // Hashtable does not allow null key or value
        try {
            hashTable.put(null, new Employee("000", "NullKey", "null@demo.com"));
        } catch (Exception e) {
            System.out.println("Hashtable null key not allowed: " + e);
        }
        try {
            hashTable.put("111", null);
        } catch (Exception e) {
            System.out.println("Hashtable null value not allowed: " + e);
        }

        // TreeMap does not allow null key but allows null values
        try {
            treeMap.put(null, new Employee("000", "NullKey", "null@demo.com"));
        } catch (Exception e) {
            System.out.println("TreeMap null key not allowed: " + e);
        }
        treeMap.put("333", null);
        System.out.println("TreeMap with null value: " + treeMap);
    }
}

// Driver Program
public class EmployeeManagement {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        EmployeeManager manager = new EmployeeManager();

        while (true) {
            System.out.println("\n--- Employee Management Menu ---");
            System.out.println("1. Add Employee");
            System.out.println("2. Display All Employees");
            System.out.println("3. Search Employee by ID");
            System.out.println("4. Remove Employee by ID");
            System.out.println("5. Demonstrate Null Key/Value Support");
            System.out.println("6. Exit");
            System.out.print("Enter choice: ");

            int choice = sc.nextInt();
            sc.nextLine(); // consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter Employee ID: ");
                    String id = sc.nextLine();
                    System.out.print("Enter Employee Name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter Employee Email: ");
                    String email = sc.nextLine();
                    manager.addEmployee(id, name, email);
                    break;
                case 2:
                    manager.displayEmployees();
                    break;
                case 3:
                    System.out.print("Enter Employee ID to search: ");
                    String searchId = sc.nextLine();
                    manager.searchEmployee(searchId);
                    break;
                case 4:
                    System.out.print("Enter Employee ID to remove: ");
                    String removeId = sc.nextLine();
                    manager.removeEmployee(removeId);
                    break;
                case 5:
                    manager.demonstrateNullSupport();
                    break;
                case 6:
                    System.out.println("👋 Exiting... Goodbye!");
                    sc.close();
                    return;
                default:
                    System.out.println("❌ Invalid choice!");
            }
        }
    }
}
