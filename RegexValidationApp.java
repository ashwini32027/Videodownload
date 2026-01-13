import java.util.Scanner;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexValidationApp {

    // Regex patterns
    private static final String MOBILE_REGEX = "^[6-9]\\d{9}$"; 
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String USERNAME_REGEX = "^[A-Za-z]\\w{4,14}$"; // starts with letter, 5-15 chars
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$";

    // Validation method
    public static boolean validateInput(String input, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);
        return matcher.matches();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = 0;

        while (true) {
            try {
                System.out.println("\n--- Input Validation Menu ---");
                System.out.println("1. Validate Mobile Number");
                System.out.println("2. Validate Email ID");
                System.out.println("3. Validate Username");
                System.out.println("4. Validate Password");
                System.out.println("5. Exit");
                System.out.print("Enter your choice: ");
                choice = sc.nextInt();
                sc.nextLine(); 

                switch (choice) {
                    case 1:
                        System.out.print("Enter Mobile Number: ");
                        String mobile = sc.nextLine();
                        if (validateInput(mobile, MOBILE_REGEX))
                            System.out.println("✅ Welcome! Mobile number is valid.");
                        else
                            System.out.println("❌ Invalid Mobile Number.");
                        break;

                    case 2:
                        System.out.print("Enter Email ID: ");
                        String email = sc.nextLine();
                        if (validateInput(email, EMAIL_REGEX))
                            System.out.println("✅ Welcome! Email ID is valid.");
                        else
                            System.out.println("❌ Invalid Email ID.");
                        break;

                    case 3:
                        System.out.print("Enter Username: ");
                        String username = sc.nextLine();
                        if (validateInput(username, USERNAME_REGEX))
                            System.out.println("✅ Welcome! Username is valid.");
                        else
                            System.out.println("❌ Invalid Username. Must be 5–15 chars, start with a letter.");
                        break;

                    case 4:
                        System.out.print("Enter Password: ");
                        String password = sc.nextLine();
                        if (validateInput(password, PASSWORD_REGEX))
                            System.out.println("✅ Welcome! Password is valid.");
                        else
                            System.out.println("❌ Invalid Password. Must contain uppercase, lowercase, digit, special char, min 8 chars.");
                        break;

                    case 5:
                        System.out.println("Exiting program. Goodbye!");
                        sc.close();
                        return;

                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            } catch (Exception e) {
                System.out.println("⚠️ Error: " + e.getMessage());
                sc.nextLine(); // clear buffer
            }
        }
    }
}
