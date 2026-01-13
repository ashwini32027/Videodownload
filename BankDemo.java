class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

interface BankingOperation {
    int deposit(int value);
    int withdraw(int val) throws InsufficientBalanceException;
    int checkBalance();
    int transfer(int val) throws InsufficientBalanceException;
}

interface CustomerOperation {
    String addCustomer(String name, int balance);
    String updateCustomer(String name, int balance);
    String displayCustomer();
}

class BankApp implements BankingOperation, CustomerOperation {
    private String customerName;
    private int balance;
    private int secBalance;
    private String accNumber;
    private final String secAccount = "405100";

    @Override
    public int deposit(int amount) {
        this.balance += amount;
        return balance;
    }

    @Override
    public int withdraw(int val) throws InsufficientBalanceException {
        if (balance <= 0 || val > balance) {
            throw new InsufficientBalanceException("Insufficient balance. Current balance: " + balance);
        }
        balance -= val;
        return balance;
    }

    @Override
    public int checkBalance() {
        return balance;
    }

    @Override
    public int transfer(int val) throws InsufficientBalanceException {
        if (balance <= 0 || val > balance) {
            throw new InsufficientBalanceException("Insufficient balance. Current balance: " + balance);
        }
        secBalance += val;
        balance -= val;
        System.out.println("Balance transferred successfully to second account " + secAccount);
        return balance;
    }

    @Override
    public String addCustomer(String name, int bal) {
        this.accNumber = "4051002";
        this.balance = bal;
        this.customerName = name;
        return "Customer added successfully: Account=" + accNumber + 
               ", Balance=" + balance + ", Name=" + customerName;
    }

    @Override
    public String updateCustomer(String name, int bal) {
        this.accNumber = "4051002";
        this.balance = bal;
        this.customerName = name;
        return "Customer updated successfully: Account=" + accNumber + 
               ", Balance=" + balance + ", Name=" + customerName;
    }

    @Override
    public String displayCustomer() {
        return "Customer: " + customerName + ", Account=" + accNumber + ", Balance=" + balance;
    }
}

public class BankDemo {
    public static void main(String[] args) {
        BankApp bank = new BankApp();

        // Add customer
        System.out.println(bank.addCustomer("Ashwini Kumar", 5000));

        // Deposit
        System.out.println("After deposit: Balance = " + bank.deposit(2000));

        // Withdraw with exception handling
        try {
            System.out.println("After withdrawal: Balance = " + bank.withdraw(3000));
        } catch (InsufficientBalanceException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // Transfer with exception handling
        try {
            System.out.println("After transfer: Balance = " + bank.transfer(2000));
        } catch (InsufficientBalanceException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // Display customer details
        System.out.println(bank.displayCustomer());
    }
}
