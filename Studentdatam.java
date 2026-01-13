import java.util.ArrayList;
import java.util.Scanner;
class App
{
    ArrayList<String>names= new ArrayList<>();
    ArrayList<String>rolls= new ArrayList<>();
    Scanner sc;
    public App(Scanner sc)
    {
       this.sc=sc;
    }

   public void addstudent()
   {
	   System.out.println("Please Enter Name of Student");
	   String name=sc.nextLine();
	   System.out.println("Please Enter Student roll number");
	   String roll=sc.next();
	   names.add(name);
	   rolls.add(roll);
	   System.out.println("Student Added succesfully");
   }
   public void deletestud()
   {
	   System.out.println("Please ENter roll of Student which You want to delte");
	   String roll=sc.next();
	   int index=rolls.indexOf(roll);
	   if(index!=-1)
	   {
		   String name=names.remove(index);
		   String rol=rolls.remove(index);
		   System.out.println("Student Deleted Succesfully");
		   
	   }
	   else
	   {
		   System.out.println("Student Not found in List");
	   }
   }
   public void displaystu() {
	   System.out.println("Name of Student are as follow");
	   if (names.isEmpty())
	   {
		   System.out.println("❌ No Students Found!");
	        return;
		}
	   for(int i=0;i<names.size();i++)
	   {
		   String name=names.get(i);
		   String roll=rolls.get(i);
		   System.out.println("|| "+name+" || "+ roll +" ");
	   }
   }
   public void searchstu()
   {
	   System.out.println("Please Enter roll");
	   String roll=sc.next();
	   if(names.isEmpty() || rolls.isEmpty())
	   {
		   System.out.println("Student record is Blanks")
	   }
	   int index=rolls.indexOf(roll);
	   if(index!=-1)
	   {
		   System.out.println("Student is name ="+names.get(index)+" roll "+rolls.get(index));
	   }
	   else
	   {
		   System.out.print("No Student Found");
	   }
   }
}
public class Studentdatam {
    public static void main(String[]args)
    {
        Scanner sc= new Scanner(System.in);
        App app=new App(sc);
        while(true)
        {
            System.out.println("Welcome Student Mangement Software");
            System.out.println("Click 1 Add Student");
            System.out.println("Click 2 Delete Student");
            System.out.println("Click 3 Display All Student");
            System.out.println("Click 4 Search Student");
            int choice=sc.nextInt();
            switch(choice)
            {
            case 1:app.addstudent();
            break;
            case 2:app.deletestud();
            break;
            case 3:app.displaystu();
            break;
            case 4:app.searchstu();
            break;
            default:System.out.print("Please choose valid option");
            
            }
        }

    }
}
