/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  Network, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Lock, 
  Unlock, 
  Eye, 
  Download, 
  Sparkles, 
  Check, 
  Copy, 
  Printer, 
  CheckCircle, 
  FileQuestion,
  HelpCircle,
  Code,
  BookOpen
} from "lucide-react";

// Types
interface MaterialItem {
  id: string;
  title: string;
  category: string;
  isLocked: boolean;
  contentSummary: string;
  cheatSheet: string[];
  codeSnippet?: string;
  quizQuestions?: string[];
}

interface SubjectClassData {
  title: string;
  subjectCode: string;
  description: string;
  notes: MaterialItem[];
  secondaryTabName: "Projects" | "Syllabus";
  secondaryTabItems: MaterialItem[];
  papers: MaterialItem[];
}

// Full Educational Dataset representing accurate CBSE CS (083) and IP (065) curricula
const EDUCATIONAL_DATA: Record<string, SubjectClassData> = {
  "cs-12": {
    title: "Class 12 Computer Science",
    subjectCode: "083",
    description: "Computational thinking, functions, advanced file handling (Text/Binary/CSV), Stack data structures, computer networks, and MySQL relational databases.",
    secondaryTabName: "Projects",
    notes: [
      {
        id: "cs12-n1",
        title: "Exception Handling",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Master error resolution, syntax vs. runtime errors, and the try-except-finally block sequence in Python.",
        cheatSheet: [
          "Syntax Error: Raised by Python parser due to invalid grammar (e.g., missing colons).",
          "Runtime Error / Exception: Occurs during execution (e.g., ZeroDivisionError, FileNotFoundError).",
          "Try Block: Place code that might throw an exception inside the try block.",
          "Except Block: Catches and handles specific exceptions without crashing the program.",
          "Finally Block: Contains clean-up actions that run regardless of whether an exception occurred."
        ],
        codeSnippet: `try:
    num1 = int(input("Enter numerator: "))
    num2 = int(input("Enter denominator: "))
    result = num1 / num2
    print(f"Result: {result}")
except ZeroDivisionError:
    print("Error: Denominator cannot be zero!")
except ValueError:
    print("Error: Please enter valid integer numbers.")
finally:
    print("Calculation attempt finished.")`,
        quizQuestions: [
          "What exception is raised when trying to open a non-existent file in read mode? (Answer: FileNotFoundError)",
          "Can we write an except block without specifying an exception type? (Answer: Yes, it acts as a catch-all block)"
        ]
      },
      {
        id: "cs12-n2",
        title: "Python SQL Connectivity",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Establish connections between Python scripts and MySQL databases. Execute cursors, fetch records, and commit transactions.",
        cheatSheet: [
          "Import mysql.connector: The official library used to bind Python with MySQL databases.",
          "connect() method: Accepts host, user, password, and database parameters to yield a connection object.",
          "cursor() method: Spawns a cursor instance to buffer and transmit SQL statements.",
          "execute() method: Dispatches a SQL query to the database server.",
          "commit() method: Essential for transactional queries (INSERT, UPDATE, DELETE) to finalize modifications."
        ],
        codeSnippet: `import mysql.connector

# 1. Establish connection
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="password123",
  database="school_db"
)

# 2. Spawning active cursor
cursor = mydb.cursor()

# 3. Running select statement
cursor.execute("SELECT * FROM STUDENT WHERE MARKS >= 90")
records = cursor.fetchall()

for student in records:
    print(f"Roll No: {student[0]} | Name: {student[1]} | Marks: {student[2]}")

cursor.close()
mydb.close()`,
        quizQuestions: [
          "Why is mydb.commit() required after inserting records? (Answer: To save the transaction changes permanently)",
          "What is the difference between fetchone() and fetchall()? (Answer: fetchone fetches a single tuple, while fetchall returns a list of all matching rows)"
        ]
      },
      {
        id: "cs12-n3",
        title: "SQL Joins",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Combine related tuples across multiple relations. Master Equi-Join, Natural Join, and Cross Product queries.",
        cheatSheet: [
          "Cross Join: Produces Cartesian Product (multiplies total rows of Table A by total rows of Table B).",
          "Equi-Join: Combines tables based on equality of common columns (uses explicit operator like S.customer_id = O.customer_id).",
          "Natural Join: Merges tables automatically based on identical column names and types, removing duplicate join columns.",
          "Degree after Join: Sum of columns of both tables (minus duplicate columns for Natural Join).",
          "Cardinality after Join: Varies depending on row combinations matching the equality criteria."
        ],
        codeSnippet: `-- Equi-join Query across CUSTOMERS and ORDERS
SELECT C.CUSTOMER_ID, C.FIRST_NAME, O.ITEM, O.AMOUNT
FROM CUSTOMERS C
JOIN ORDERS O ON C.CUSTOMER_ID = O.CUSTOMER_ID
WHERE O.AMOUNT > 500;

-- Natural Join example
SELECT * FROM EMPLOYEES NATURAL JOIN DEPARTMENTS;`,
        quizQuestions: [
          "If Table A has 4 rows and Table B has 5 rows, how many rows are in their Cartesian Product? (Answer: 20 rows)",
          "Does Natural Join display duplicate join columns in the result? (Answer: No, it automatically eliminates duplicate columns)"
        ]
      },
      {
        id: "cs12-n4",
        title: "SQL Grouping",
        category: "Study Material",
        isLocked: true,
        contentSummary: "Structure relational results into groups based on matching criteria using GROUP BY and group filters with HAVING.",
        cheatSheet: [
          "GROUP BY Clause: Collects raw database rows together based on one or more identical column values.",
          "Aggregate Functions: Mandatory when summarizing grouped outputs (COUNT, SUM, AVG, MAX, MIN).",
          "WHERE Clause: Filters rows *before* groups are formulated.",
          "HAVING Clause: Filters formulated groups *after* GROUP BY has completed.",
          "Rule: GROUP BY columns can appear directly in SELECT, other columns must use aggregate functions."
        ],
        codeSnippet: `-- Calculate average salary inside each department having more than 2 employees
SELECT DEPT, COUNT(*) AS TotalEmployees, AVG(SALARY) AS AvgSalary
FROM EMPLOYEE
GROUP BY DEPT
HAVING COUNT(*) >= 2;`,
        quizQuestions: [
          "Can we use the HAVING clause without a GROUP BY statement? (Answer: Yes, but it acts on the entire table as a single group)",
          "What is the key difference between WHERE and HAVING? (Answer: WHERE filters individual tuples, HAVING filters grouped sets)"
        ]
      },
      {
        id: "cs12-n5",
        title: "SQL Select Command",
        category: "Study Material",
        isLocked: true,
        contentSummary: "The foundation of data query language. Learn SELECT, DISTINCT, arithmetic operators, and string matching using LIKE.",
        cheatSheet: [
          "SELECT statement: Used to retrieve rows and columns from one or more database tables.",
          "DISTINCT keyword: Removes redundant duplicate rows from output listings.",
          "WHERE clause: Restricts results based on relational evaluation conditions.",
          "LIKE Operator: Performs pattern matching. Uses '%' (any string of characters) and '_' (a single character).",
          "ORDER BY: Sorts records in ascending (default) or descending (DESC) order."
        ],
        codeSnippet: `-- Select distinct cities of employees whose names start with 'R'
SELECT DISTINCT CITY
FROM EMPLOYEE
WHERE NAME LIKE 'R%'
ORDER BY CITY DESC;`,
        quizQuestions: [
          "Which wildcard character represents exactly one character in a SQL LIKE pattern? (Answer: The underscore '_')",
          "How do we sort records in descending order in SQL? (Answer: Append the DESC keyword in the ORDER BY clause)"
        ]
      },
      {
        id: "cs12-n6",
        title: "SQL DML Commands",
        category: "Study Material",
        isLocked: true,
        contentSummary: "Perform data modifications within your relations. Master INSERT INTO, UPDATE, and DELETE FROM statements.",
        cheatSheet: [
          "DML: Data Manipulation Language commands that mutate table rows.",
          "INSERT INTO: Appends new tuples/rows into the table schema.",
          "UPDATE: Alters existing attribute values inside targeted records.",
          "DELETE FROM: Removes rows matching a condition. If WHERE is omitted, it clears all table rows.",
          "Safe Transaction: DML operations can be rolled back before a permanent COMMIT is called."
        ],
        codeSnippet: `-- 1. Insert a new employee
INSERT INTO EMPLOYEE (EMP_ID, NAME, SALARY, DEPT, CITY)
VALUES (207, 'Amit Patel', 62000, 'Marketing', 'Bhopal');

-- 2. Update department salary
UPDATE EMPLOYEE
SET SALARY = SALARY * 1.10
WHERE DEPT = 'IT';

-- 3. Delete specific records
DELETE FROM EMPLOYEE
WHERE CITY = 'Indore' AND SALARY < 50000;`,
        quizQuestions: [
          "What happens if you run 'DELETE FROM EMPLOYEE' without a WHERE clause? (Answer: It deletes all rows from the table, leaving an empty schema)",
          "Are CREATE and ALTER classified as DML? (Answer: No, they are DDL - Data Definition Language commands)"
        ]
      }
    ],
    secondaryTabItems: [
      {
        id: "cs12-p1",
        title: "Library Management System",
        category: "Project Guide",
        isLocked: false,
        contentSummary: "Complete Python-MySQL system for issuing books, returning books, tracking inventories, and managing user fines.",
        cheatSheet: [
          "Python Interface: Built using standard CLI with multi-tiered choice lists.",
          "Primary Tables: BOOKS, MEMBERS, and TRANSACTIONS.",
          "Primary Key constraints: book_id and member_id to keep relationships integral.",
          "Logical validation: Prevents issuing books with 0 available copies.",
          "Calculation: Fines are compiled automatically if return date exceeds issue dates."
        ],
        codeSnippet: `def return_book(tx_id):
    conn = connect_db()
    cursor = conn.cursor()
    # Fetch transaction issue date
    cursor.execute("SELECT BookID, IssueDate FROM TRANSACTIONS WHERE TxID = %s", (tx_id,))
    res = cursor.fetchone()
    if res:
        book_id, issue_date = res
        return_date = datetime.now()
        # Increment book copies back in inventory
        cursor.execute("UPDATE BOOKS SET Copies = Copies + 1 WHERE BookID = %s", (book_id,))
        cursor.execute("UPDATE TRANSACTIONS SET ReturnDate = %s WHERE TxID = %s", (return_date.strftime('%Y-%m-%d'), tx_id))
        conn.commit()
        print("Book returned and inventory updated.")
    cursor.close()
    conn.close()`,
        quizQuestions: [
          "Which Python library binds MySQL connectivity? (Answer: mysql.connector)",
          "How is a database connection established? (Answer: Using mysql.connector.connect())"
        ]
      },
      {
        id: "cs12-p2",
        title: "Hospital Operations Database",
        category: "Project Guide",
        isLocked: false,
        contentSummary: "Manage doctor appointments, patient medical history, billing systems, and general ward allotment trackers.",
        cheatSheet: [
          "Core Tables: PATIENTS, DOCTORS, APPOINTMENTS.",
          "Integrity Rules: Patient ID must exist before an appointment is successfully scheduled.",
          "Data Analysis: Generates weekly revenue reports grouped by department using Matplotlib plots."
        ],
        codeSnippet: `def get_dept_revenue():
    conn = connect_db()
    cursor = conn.cursor()
    query = """
    SELECT D.Department, SUM(A.FeePaid) 
    FROM APPOINTMENTS A 
    JOIN DOCTORS D ON A.DoctorID = D.DoctorID 
    GROUP BY D.Department
    """
    cursor.execute(query)
    results = cursor.fetchall()
    for row in results:
        print(f"Department: {row[0]} | Revenue: Rs.{row[1]}")
    cursor.close()
    conn.close()`,
        quizQuestions: [
          "How is a foreign key represented in APPOINTMENTS? (Answer: PatientID and DoctorID refer to PATIENTS and DOCTORS tables)",
          "Which SQL function tallies total revenue? (Answer: SUM(FeePaid))"
        ]
      },
      {
        id: "cs12-p3",
        title: "Student Progress Report Card Generator",
        category: "Project Guide",
        isLocked: false,
        contentSummary: "Store term marks, calculate subject percentages, auto-assign grades, and export formatted Excel sheets.",
        cheatSheet: [
          "Core Tables: STUDENTS, MARKS.",
          "Libraries: mysql.connector, pandas, openpyxl.",
          "Math Formula: Percentage = (Sum of all marks / 500) * 100."
        ],
        codeSnippet: `def export_to_excel():
    import pandas as pd
    conn = connect_db()
    df = pd.read_sql("SELECT S.Name, S.Class, M.* FROM STUDENTS S JOIN MARKS M ON S.RollNo = M.RollNo", conn)
    df['Total'] = df[['English', 'Math', 'Physics', 'Chemistry', 'CS']].sum(axis=1)
    df['Percentage'] = (df['Total'] / 500) * 100
    df.to_excel("cbse_student_reports.xlsx", index=False)
    print("Exported successfully!")
    conn.close()`,
        quizQuestions: [
          "What pandas function reads a SQL query into a DataFrame? (Answer: pd.read_sql())",
          "How do we save a pandas DataFrame to an Excel sheet? (Answer: df.to_excel())"
        ]
      },
      {
        id: "cs12-p4",
        title: "Hotel Booking Database System",
        category: "Project Guide",
        isLocked: true,
        contentSummary: "Manage suite allotments, check-in schedules, customer directories, and customized room billing generators.",
        cheatSheet: [
          "Tables: CUSTOMERS, ROOMS, BOOKINGS.",
          "Status tracker: ROOMS table contains 'Status' (0 = Available, 1 = Occupied).",
          "Calculated Cost: Rooms have a fixed DailyRate which is multiplied by the checkout stay duration."
        ],
        codeSnippet: `def book_room(room_no, customer_id, days):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT Status, DailyRate FROM ROOMS WHERE RoomNo = %s", (room_no,))
    status, rate = cursor.fetchone()
    if status == 0:
        total_bill = rate * days
        cursor.execute("INSERT INTO BOOKINGS (RoomNo, CustID, StayDays, TotalBill) VALUES (%s, %s, %s, %s)", (room_no, customer_id, days, total_bill))
        cursor.execute("UPDATE ROOMS SET Status = 1 WHERE RoomNo = %s", (room_no,))
        conn.commit()
        print("Booking confirmed!")
    else:
        print("Room is occupied.")
    cursor.close()
    conn.close()`,
        quizQuestions: [
          "How do we handle decimal values for currency in MySQL? (Answer: Use the DECIMAL(10,2) column type)",
          "What condition updates a room availability on booking? (Answer: SET Status = 1)"
        ]
      }
    ],
    papers: [
      {
        id: "cs12-q1",
        title: "CBSE CS Sample Question Paper 2025",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Fully modeled mock paper adhering precisely to the latest CBSE Class 12 blueprint with detailed solutions.",
        cheatSheet: [
          "Section A: 18 MCQ questions covering basic concepts (1 mark each).",
          "Section B: 7 short answer questions focusing on Python debugging (2 marks each).",
          "Section C: 5 short programming questions targeting stack, files (3 marks each).",
          "Section D: 3 long questions, including Network case study and SQL joins (5 marks each).",
          "Section E: 2 case-based questions from SQL and CSV files (4 marks each)."
        ],
        codeSnippet: `# Sample MCQ Question
# What is the output of: print("CBSE" * 2) ?
# A) CBSECBSE  B) CBSE 2  C) Error
# Correct Answer: A`,
        quizQuestions: [
          "How many theory marks does the CBSE 12 CS exam carry? (Answer: 70 Marks)",
          "What is the duration of the official written exam? (Answer: 3 Hours)"
        ]
      },
      {
        id: "cs12-q2",
        title: "Class XII CS Pre-Board Paper 2024",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Comprehensive board rehearsal paper focusing on code tracing, output predictions, and system diagnostics.",
        cheatSheet: [
          "Tricky Trace: Evaluating nested list variables and string mutations.",
          "File trace: Analyzing cursor seek() and tell() byte offset queries.",
          "Networking Case: Proposing a LAN setup for an institution across 4 distinct blocks."
        ],
        codeSnippet: `def trace_mystery():
    S = "BoardExam2024"
    R = ""
    for char in S:
        if char.isupper():
            R += char.lower()
        elif char.isdigit():
            R += "*"
        else:
            R += char.upper()
    print(R)
# Output trace: bOARDeXAM****`,
        quizQuestions: [
          "What value does the tell() function return in Python file handling? (Answer: The current cursor position in bytes)",
          "Which networking topology is easiest to scale? (Answer: Star Topology)"
        ]
      },
      {
        id: "cs12-q3",
        title: "Database & SQL Chapter Practice Paper",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Dedicated sheet carrying 30+ actual board queries on joins, grouping, and sub-queries.",
        cheatSheet: [
          "Contains 10 direct query construction questions.",
          "Includes 10 table output prediction problems.",
          "Tests primary key, candidate key, and referential integrity concepts."
        ],
        codeSnippet: `-- Sample Question: Predict output
SELECT DEPT, MAX(SALARY) - MIN(SALARY) AS SalaryGap
FROM EMPLOYEE
GROUP BY DEPT;`,
        quizQuestions: [
          "Can there be more than one Candidate Key in a database relation? (Answer: Yes, but only one is selected as the Primary Key)",
          "What is a Foreign Key? (Answer: A column in one table that links to a Primary Key in another table)"
        ]
      },
      {
        id: "cs12-q4",
        title: "Past 5 Years Solved Board Papers",
        category: "Question Paper",
        isLocked: true,
        contentSummary: "Ultimate revision catalog featuring solved papers from 2020, 2021, 2022, 2023, and 2024 board seasons.",
        cheatSheet: [
          "Complete solution key following direct CBSE marking rules.",
          "Highlights recurring questions in binary file operations.",
          "Includes detailed guidelines on writing error-free stack operations."
        ],
        codeSnippet: `# Sample solved Stack push code
def push_stack(stk, item):
    stk.append(item)
    print("Item pushed successfully.")`,
        quizQuestions: [
          "How is an Underflow condition prevented in custom Python stacks? (Answer: Checking if the list is empty before pop() is executed)",
          "What does LIFO stand for? (Answer: Last In, First Out)"
        ]
      }
    ]
  },
  "cs-11": {
    title: "Class 11 Computer Science",
    subjectCode: "083",
    description: "Introductory Python scripting, variables, data representations, conditional constructs, iterative loops, lists, tuples, and dictionaries.",
    secondaryTabName: "Syllabus",
    notes: [
      {
        id: "cs11-n1",
        title: "Python Programming Basics & Variables",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Introduction to Python keywords, literal types, variables, type casting, and standard I/O commands.",
        cheatSheet: [
          "Variables: Symbolic names referencing objects stored in memory. Dynamic typing allowed.",
          "Data Types: int, float, complex, str, bool, list, tuple, dict.",
          "Type Casting: Converting data types explicitly using int(), float(), or str() functions.",
          "Input: input() always returns values as a String. Explicit casting is mandatory for numbers."
        ],
        codeSnippet: `# Python basic variables & inputs
name = input("Enter student name: ")
age = int(input("Enter student age: "))
marks = float(input("Enter marks: "))

print(f"Name type: {type(name)}")
print(f"Age in 5 years: {age + 5}")
print(f"Formatted Marks: {marks:.2f}")`,
        quizQuestions: [
          "Can we use keywords as variable names in Python? (Answer: No, keywords are reserved identifiers)",
          "What is the output of print(3 * 'A')? (Answer: AAA)"
        ]
      },
      {
        id: "cs11-n2",
        title: "Conditional Statements & Loops",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Control program flow with if-elif-else statements. Repeat processes with while and for loops.",
        cheatSheet: [
          "If Statement: Executes a block of code only if the condition evaluates to True.",
          "For Loop: Iterates over sequences (lists, strings, tuples, or ranges).",
          "While Loop: Continues looping as long as a condition remains True.",
          "Range function: range(start, stop, step) generates numerical sequences, excluding the stop value."
        ],
        codeSnippet: `# Loop and Condition Practice
num = int(input("Enter a limit: "))
print("Even numbers:")
for i in range(1, num + 1):
    if i % 2 == 0:
        print(i, end=" ")`,
        quizQuestions: [
          "What is the output of range(1, 5)? (Answer: 1, 2, 3, 4)",
          "Does Python support a switch-case statement natively? (Answer: Only match-case in Python 3.10+, previously only if-elif-else was used)"
        ]
      },
      {
        id: "cs11-n3",
        title: "String Operations & Slicing",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Master immutable sequence structures. Access substrings using start:stop:step slicing operators.",
        cheatSheet: [
          "Strings: Immutable sequences of Unicode characters.",
          "Slicing: S[start:stop:step] extracts a portion of a string.",
          "Negative Slicing: S[-1] accesses the last character, S[::-1] reverses the string.",
          "String Methods: upper(), lower(), split(), join(), find(), isdigit()."
        ],
        codeSnippet: `S = "ComputerScience"
# Slicing Examples
print(S[0:8])   # Output: Computer
print(S[::-1])  # Output: ecneicSretupmo
print(S[-7:])   # Output: Science`,
        quizQuestions: [
          "Are strings mutable in Python? (Answer: No, they cannot be modified in-place)",
          "What is the result of '123'.isdigit()? (Answer: True)"
        ]
      },
      {
        id: "cs11-n4",
        title: "List and Tuple Manipulations",
        category: "Study Material",
        isLocked: true,
        contentSummary: "Understand mutable Lists versus immutable Tuples. Access, nest, and iterate through sequence lists.",
        cheatSheet: [
          "Lists: Mutable ordered elements declared inside brackets [].",
          "Tuples: Immutable ordered elements enclosed in parentheses ().",
          "List Operations: append(), extend(), insert(), pop(), remove().",
          "Safety: Use tuples for static configuration records to safeguard against accidental mutations."
        ],
        codeSnippet: `L = [10, 20, 30]
L.append(40)
L.insert(1, 15)
print(L) # Output: [10, 15, 20, 30, 40]

T = (1, 2, 3)
# T[0] = 5  # Raises TypeError (Immutable!)`,
        quizQuestions: [
          "What is the key difference between Lists and Tuples? (Answer: Lists are mutable, Tuples are immutable)",
          "What is the output of [1, 2] * 2? (Answer: [1, 2, 1, 2])"
        ]
      }
    ],
    secondaryTabItems: [
      {
        id: "cs11-s1",
        title: "Class 11 CS Curriculum Blueprint",
        category: "Syllabus Guide",
        isLocked: false,
        contentSummary: "Official CBSE outline for computer science fundamentals, distribution of marks, and practical exam setup.",
        cheatSheet: [
          "Unit 1: Computer Systems and Organization (10 Marks).",
          "Unit 2: Computational Thinking and Programming - I (45 Marks).",
          "Unit 3: Society, Law and Ethics (15 Marks).",
          "Practical Assessment: 30 Marks (Lab test, file, and viva)."
        ],
        codeSnippet: `# Marking Distribution Schema
theory_marks = 70
practical_marks = 30
total = theory_marks + practical_marks`,
        quizQuestions: [
          "What is the weightage of the programming unit in Class 11 CS? (Answer: 45 Marks out of 70 theory marks)",
          "How many marks are allotted for the class practical record file? (Answer: 7 Marks)"
        ]
      },
      {
        id: "cs11-s2",
        title: "Unit-wise Marks Weightage",
        category: "Syllabus Guide",
        isLocked: false,
        contentSummary: "Detailed layout of easy, medium, and difficult chapters to help structure board preparations.",
        cheatSheet: [
          "Focus 1: Focus 70% of study time on programming and logical flow structures.",
          "Focus 2: Memorize number conversions (binary, octal, hex) for quick scoring in Unit 1."
        ],
        codeSnippet: `# Unit Wise Target list
units = {
    "Computer Systems": 10,
    "Python Programming": 45,
    "Ethics & Society": 15
}`,
        quizQuestions: [
          "Are binary-to-decimal conversions tested in Unit 1? (Answer: Yes, conversions between binary, octal, hexadecimal, and decimal are core topics)"
        ]
      }
    ],
    papers: [
      {
        id: "cs11-q1",
        title: "Class XI CS Final Exam Practice Set",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Comprehensive question catalog mimicking annual final term examinations.",
        cheatSheet: [
          "Contains 15 MCQs on Python keywords and binary conversion.",
          "Features 10 dry-run loop problems to predict the output of nested counters."
        ],
        codeSnippet: `# Predict the output
count = 1
while count < 10:
    if count % 3 == 0:
        print(count, end=" ")
    count += 1
# Output: 3 6 9`,
        quizQuestions: [
          "What is the base of hexadecimal numbers? (Answer: Base 16)",
          "Which operator returns the remainder of division in Python? (Answer: The modulo operator '%')"
        ]
      }
    ]
  },
  "ip-12": {
    title: "Class 12 Informatics Practices",
    subjectCode: "065",
    description: "Data handling using Pandas, Series, DataFrames, data visualization using Matplotlib, SQL aggregate commands, and societal digital footprints.",
    secondaryTabName: "Projects",
    notes: [
      {
        id: "ip12-n1",
        title: "Pandas Series & DataFrames Intro",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Understand 1D Series and 2D tabular DataFrames in Pandas. Create, align, and index datasets.",
        cheatSheet: [
          "Pandas: Fast, robust data structures used for data analytics in Python.",
          "Series: 1D homogeneous array with custom label indexes.",
          "DataFrame: 2D size-mutable, heterogeneous tabular dataset with both row and column labels.",
          "Creation: Can load series and DataFrames from dictionaries, lists, scalar values, or CSV files."
        ],
        codeSnippet: `import pandas as pd

# Creating a Series
data = [100, 200, 300]
labels = ['Day1', 'Day2', 'Day3']
S = pd.Series(data, index=labels)
print(S)

# Creating a DataFrame
student_dict = {
    'Name': ['Aryan', 'Sneha', 'Kabir'],
    'IP_Marks': [95, 98, 92]
}
df = pd.DataFrame(student_dict)
print(df)`,
        quizQuestions: [
          "What is the difference in dimensions between a Pandas Series and a DataFrame? (Answer: Series is 1D, DataFrame is 2D)",
          "How can we view the first 3 rows of a DataFrame? (Answer: Use df.head(3))"
        ]
      },
      {
        id: "ip12-n2",
        title: "DataFrame Operations & Statistics",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Mutate DataFrames. Perform row/column additions, row filters, boolean masking, and standard descriptive statistical queries.",
        cheatSheet: [
          "Adding Column: df['NewCol'] = values append columns dynamically.",
          "Access: loc[] uses labeled indexing, iloc[] uses integer-positional indexing.",
          "Statistics: sum(), mean(), max(), min(), count() run summaries over rows or columns.",
          "Axis logic: axis=0 operates vertically down rows (default), axis=1 runs horizontally across columns."
        ],
        codeSnippet: `import pandas as pd
df = pd.DataFrame({
    'ProdA': [120, 150, 90],
    'ProdB': [80, 210, 140]
})

# Add a total column
df['TotalRevenue'] = df['ProdA'] + df['ProdB']

# Calculate averages
print("Average revenue of ProdA:", df['ProdA'].mean())
print("Maximum sales reached:\\n", df.max())`,
        quizQuestions: [
          "What positional indexing attribute is used in Pandas DataFrames? (Answer: iloc)",
          "Does axis=1 operate on columns or rows? (Answer: It operates on columns horizontally)"
        ]
      },
      {
        id: "ip12-n3",
        title: "Data Visualization using Matplotlib",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Represent dataset numbers visually. Plot line charts, bar plots, and customized histograms.",
        cheatSheet: [
          "matplotlib.pyplot: The target visualization pipeline module.",
          "Line Plot: plt.plot() for linear data trends.",
          "Bar Plot: plt.bar() or plt.barh() for categorical data comparisons.",
          "Customization: plt.title(), plt.xlabel(), plt.ylabel() to tag headings and axes.",
          "Display: plt.show() renders and prints the visual graph chart."
        ],
        codeSnippet: `import matplotlib.pyplot as plt

subjects = ['English', 'Maths', 'IP', 'Physics']
averages = [85, 78, 94, 81]

plt.bar(subjects, averages, color='teal')
plt.title("Class XII Average Performance")
plt.xlabel("Subjects")
plt.ylabel("Average Score")
plt.grid(axis='y', linestyle='--')
plt.show()`,
        quizQuestions: [
          "Which matplotlib function plots a standard vertical bar chart? (Answer: plt.bar())",
          "How can we change the line color to red in plt.plot()? (Answer: Pass the parameter color='red' or 'r')"
        ]
      },
      {
        id: "ip12-n4",
        title: "SQL Joins & Grouping in IP",
        category: "Study Material",
        isLocked: true,
        contentSummary: "Learn multi-table queries, joins, and summary groupings required specifically for Informatics Practices theory.",
        cheatSheet: [
          "In IP, Joins are heavily tested in written theory papers.",
          "Integrity: Joining primary key columns with corresponding foreign keys.",
          "GROUP BY: Merges rows on matching key values to compute counts and averages."
        ],
        codeSnippet: `-- Join SALES and EMPLOYEES to tally agent bookings
SELECT E.Name, SUM(S.BookingAmount) AS TotalSales
FROM EMPLOYEES E
JOIN SALES S ON E.EmpID = S.AgentID
GROUP BY E.Name
HAVING SUM(S.BookingAmount) > 100000;`,
        quizQuestions: [
          "Can we filter groups using WHERE in SQL? (Answer: No, group filtering must be done with HAVING)"
        ]
      }
    ],
    secondaryTabItems: [
      {
        id: "ip12-p1",
        title: "Informatics Practices Student Portal",
        category: "Project Guide",
        isLocked: false,
        contentSummary: "Build a Python Tkinter/Pandas application to search and update class grades visually.",
        cheatSheet: [
          "Backend: Pandas DataFrame saved to raw student_grades.csv.",
          "GUI: Simple TK interface displaying students, average marks, and grade distributions."
        ],
        codeSnippet: `import pandas as pd
def search_student(roll_no):
    df = pd.read_csv("student_grades.csv")
    match = df[df['RollNo'] == roll_no]
    if not match.empty:
        print(match.to_string())
    else:
        print("Roll number not found.")`,
        quizQuestions: [
          "What function loads CSV records into a Pandas DataFrame? (Answer: pd.read_csv())"
        ]
      }
    ],
    papers: [
      {
        id: "ip12-q1",
        title: "CBSE IP Sample Paper 2025",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Sample boards preparation paper designed for IP students.",
        cheatSheet: [
          "Covers Series/DataFrame operations, bar chart plotting, and MySQL grouping queries."
        ],
        codeSnippet: `# Sample IP Problem
# Find the code output:
# import pandas as pd
# S = pd.Series([1,2,3], index=['a','b','c'])
# print(S['b'])
# Output: 2`,
        quizQuestions: [
          "What is the total theory marks in Class 12 IP? (Answer: 70 Marks)"
        ]
      }
    ]
  },
  "ip-11": {
    title: "Class 11 Informatics Practices",
    subjectCode: "065",
    description: "Hardware systems, system software, binary conversions, basic Python scripting, relational query models, and simple data tables.",
    secondaryTabName: "Syllabus",
    notes: [
      {
        id: "ip11-n1",
        title: "Introduction to Computer Systems",
        category: "Study Material",
        isLocked: false,
        contentSummary: "CPU blocks, primary memory models (RAM, ROM), secondary storage devices, system utility software, and basic operating systems.",
        cheatSheet: [
          "CPU: Comprises ALU (Arithmetic Logic Unit) and CU (Control Unit).",
          "Memory: RAM (Volatile, fast workspace), ROM (Non-volatile, contains boot/BIOS instructions).",
          "Software types: System Software (OS, compilers) versus Application Software (MS Office, web browsers)."
        ],
        codeSnippet: `# Block diagram represents logic pipeline:
# Input Device -> CPU (ALU/CU) <-> Primary Memory -> Output Device`,
        quizQuestions: [
          "Is flash memory volatile or non-volatile? (Answer: Non-volatile)",
          "What does ALU stand for? (Answer: Arithmetic Logic Unit)"
        ]
      },
      {
        id: "ip11-n2",
        title: "Data Representation & Binary Arithmetic",
        category: "Study Material",
        isLocked: false,
        contentSummary: "Convert numbers across number bases. Master simple binary additions and ASCII character encodings.",
        cheatSheet: [
          "Binary: Base 2. Contains digits 0 and 1.",
          "Decimal to Binary conversion: Repeated division by 2, recording remainders from bottom to top.",
          "ASCII: American Standard Code for Information Interchange. (e.g., 'A' is 65)."
        ],
        codeSnippet: `# Convert decimal 13 to binary:
# 13 / 2 = 6, remainder 1
# 6 / 2 = 3, remainder 0
# 3 / 2 = 1, remainder 1
# 1 / 2 = 0, remainder 1
# Result from bottom: 1101`,
        quizQuestions: [
          "What is the decimal equivalent of binary 1010? (Answer: 10)",
          "Which encoding standard is larger: ASCII or Unicode? (Answer: Unicode, it covers all global languages)"
        ]
      }
    ],
    secondaryTabItems: [
      {
        id: "ip11-s1",
        title: "Class 11 IP Official Syllabus",
        category: "Syllabus Guide",
        isLocked: false,
        contentSummary: "Curriculum breakdown comprising Python basics, data statistics, database models, and SQL querying.",
        cheatSheet: [
          "Unit 1: Introduction to Computer System (10 Marks).",
          "Unit 2: Introduction to Python (25 Marks).",
          "Unit 3: Database Concepts and SQL (30 Marks).",
          "Unit 4: Introduction to Emerging Trends (5 Marks)."
        ],
        codeSnippet: `# Syllabus marks list
unit_weights = [10, 25, 30, 5]`,
        quizQuestions: [
          "Which unit carries the highest weightage in Class 11 IP? (Answer: Database Concepts and SQL with 30 Marks)"
        ]
      }
    ],
    papers: [
      {
        id: "ip11-q1",
        title: "Class XI IP Term 1 Exam Paper",
        category: "Question Paper",
        isLocked: false,
        contentSummary: "Practice set focusing on binary math, Python variables, and basic command executions.",
        cheatSheet: [
          "Includes 20 questions on number system conversions and variable declarations."
        ],
        codeSnippet: `# Python print check
val = 5 + 10 * 2
print(val) # Output: 25 (multiplication precedence first)`,
        quizQuestions: [
          "What does RAM stand for? (Answer: Random Access Memory)"
        ]
      }
    ]
  }
};

export default function EducationalResources() {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"notes" | "secondary" | "papers">("notes");
  const [customLockedState, setCustomLockedState] = useState<Record<string, boolean>>({});
  
  // Interactive PDF Reader states
  const [readingItem, setReadingItem] = useState<MaterialItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, boolean>>({});

  // Simulation states
  const [downloadingItemName, setDownloadingItemName] = useState<string | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const handleUnlock = (itemId: string, title: string) => {
    setCustomLockedState(prev => ({
      ...prev,
      [itemId]: false
    }));
    // Instantly alert success
    setDownloadSuccessMsg(`🔓 Great choice! "${title}" is now permanently unlocked!`);
    setTimeout(() => setDownloadSuccessMsg(null), 4000);
  };

  const triggerDownloadSimulation = (title: string) => {
    setDownloadingItemName(title);
    setTimeout(() => {
      setDownloadingItemName(null);
      setDownloadSuccessMsg(`📥 PDF Document "${title}" downloaded successfully! Saved to offline CBSE Storage.`);
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    }, 1500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!selectedSubjectKey) {
    // --- DASHBOARD SUBJECT VIEW (Image 1) ---
    return (
      <div className="space-y-10 py-4 font-sans animate-fadeIn">
        {/* Visual Header Banner */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-extrabold uppercase bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full tracking-wider">
            CBSE Academic Hub
          </span>
          <h3 className="font-sans font-extrabold text-2xl text-slate-800 dark:text-white leading-tight">
            Curriculum Study Materials &amp; Projects
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Select a textbook core course code to instantly access revision sheets, past paper bundles, and syllabus guides.
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* 1. COMPUTER SCIENCE (083) SUBJECT CONTAINER CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            {/* Subject Label and Icon */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-[#4f46e5] text-white rounded-2xl shadow-md shadow-[#4f46e5]/10 shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    Computer Science
                  </h4>
                  <span className="text-[10px] font-bold text-[#4f46e5] bg-[#4f46e5]/5 border border-[#4f46e5]/10 px-2.5 py-0.5 rounded-full uppercase font-mono">
                    083
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Python, SQL, Networking, computational thinking and more
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60" />

            {/* Inner Grid with Class 12 and Class 11 cards (matching visual reference) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class 12 CS Button */}
              <button
                onClick={() => {
                  setSelectedSubjectKey("cs-12");
                  setActiveSubTab("notes");
                }}
                className="text-left bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-[#4f46e5] dark:hover:border-[#4f46e5] hover:shadow-md rounded-2xl p-4.5 transition-all duration-300 flex items-center justify-between w-full group relative overflow-hidden"
              >
                {/* Accent vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4f46e5]/80" />
                
                <div className="flex items-center gap-3.5 pl-2">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex flex-col items-center justify-center text-[#4f46e5] font-mono shrink-0 select-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-indigo-400">Class</span>
                    <span className="text-base font-extrabold leading-none mt-0.5">12</span>
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm group-hover:text-[#4f46e5] transition-colors">
                      Class 12 CS
                    </h5>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">
                      Notes · Papers · Projects
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4f46e5] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Class 11 CS Button */}
              <button
                onClick={() => {
                  setSelectedSubjectKey("cs-11");
                  setActiveSubTab("notes");
                }}
                className="text-left bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-[#4f46e5] dark:hover:border-[#4f46e5] hover:shadow-md rounded-2xl p-4.5 transition-all duration-300 flex items-center justify-between w-full group relative overflow-hidden"
              >
                {/* Accent vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4f46e5]/80" />

                <div className="flex items-center gap-3.5 pl-2">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex flex-col items-center justify-center text-[#4f46e5] font-mono shrink-0 select-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-indigo-400">Class</span>
                    <span className="text-base font-extrabold leading-none mt-0.5">11</span>
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm group-hover:text-[#4f46e5] transition-colors">
                      Class 11 CS
                    </h5>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">
                      Notes · Papers · Syllabus
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4f46e5] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* 2. INFORMATICS PRACTICES (065) SUBJECT CONTAINER CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            {/* Subject Label and Icon */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-[#0d9488] text-white rounded-2xl shadow-md shadow-[#0d9488]/10 shrink-0">
                <Network className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    Informatics Practices
                  </h4>
                  <span className="text-[10px] font-bold text-[#0d9488] bg-[#0d9488]/5 border border-[#0d9488]/10 px-2.5 py-0.5 rounded-full uppercase font-mono">
                    065
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Data handling, Pandas, Web development &amp; more
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60" />

            {/* Inner Grid with Class 12 and Class 11 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class 12 IP Button */}
              <button
                onClick={() => {
                  setSelectedSubjectKey("ip-12");
                  setActiveSubTab("notes");
                }}
                className="text-left bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-[#0d9488] dark:hover:border-[#0d9488] hover:shadow-md rounded-2xl p-4.5 transition-all duration-300 flex items-center justify-between w-full group relative overflow-hidden"
              >
                {/* Accent vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0d9488]/80" />

                <div className="flex items-center gap-3.5 pl-2">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 rounded-xl flex flex-col items-center justify-center text-[#0d9488] font-mono shrink-0 select-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-teal-400">Class</span>
                    <span className="text-base font-extrabold leading-none mt-0.5">12</span>
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm group-hover:text-[#0d9488] transition-colors">
                      Class 12 IP
                    </h5>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">
                      Notes · Papers · Projects
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0d9488] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Class 11 IP Button */}
              <button
                onClick={() => {
                  setSelectedSubjectKey("ip-11");
                  setActiveSubTab("notes");
                }}
                className="text-left bg-slate-50/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-[#0d9488] dark:hover:border-[#0d9488] hover:shadow-md rounded-2xl p-4.5 transition-all duration-300 flex items-center justify-between w-full group relative overflow-hidden"
              >
                {/* Accent vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0d9488]/80" />

                <div className="flex items-center gap-3.5 pl-2">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 rounded-xl flex flex-col items-center justify-center text-[#0d9488] font-mono shrink-0 select-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-teal-400">Class</span>
                    <span className="text-base font-extrabold leading-none mt-0.5">11</span>
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm group-hover:text-[#0d9488] transition-colors">
                      Class 11 IP
                    </h5>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">
                      Notes · Papers · Syllabus
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0d9488] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EXPLORER CORE DETAILS VIEW (Image 2) ---
  const currentSubject = EDUCATIONAL_DATA[selectedSubjectKey];
  const isCSTheme = selectedSubjectKey.startsWith("cs");
  const themeColor = isCSTheme ? "indigo" : "teal";
  const themeClass = isCSTheme ? "bg-[#3b82f6]" : "bg-[#0d9488]";
  const textThemeClass = isCSTheme ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400";
  const hoverBorderThemeClass = isCSTheme ? "hover:border-indigo-500/50" : "hover:border-teal-500/50";

  // Select target active array based on tab selected
  let currentList: MaterialItem[] = [];
  if (activeSubTab === "notes") {
    currentList = currentSubject.notes;
  } else if (activeSubTab === "secondary") {
    currentList = currentSubject.secondaryTabItems;
  } else {
    currentList = currentSubject.papers;
  }

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12 select-none">
      
      {/* 1. Header Banner matching Image 2 Title & "Change Subject" Layout */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 text-center border border-slate-800 shadow-xl space-y-3.5">
        {/* Subtle glowing spheres */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <h2 className="font-sans font-extrabold text-2xl tracking-tight text-white md:text-3xl">
            {currentSubject.title} Study Material
          </h2>
          
          <button
            onClick={() => setSelectedSubjectKey(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider underline underline-offset-4 decoration-indigo-500/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change Subject
          </button>
        </div>

        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed relative z-10 font-sans">
          {currentSubject.description}
        </p>
      </div>

      {/* Downloading/Unlocking Alert Notification */}
      {downloadingItemName && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300 max-w-2xl mx-auto animate-pulse">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Generating secured PDF download compilation for <strong>{downloadingItemName}</strong>... Please wait.</span>
        </div>
      )}

      {downloadSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* 2. TAB CONTROL PILL SWITCHER matching Image 2 capsule shape centered bar */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1.5 rounded-full shadow-lg flex items-center gap-1.5 select-none max-w-md w-full sm:w-auto">
          {/* Notes Tab */}
          <button
            onClick={() => {
              setActiveSubTab("notes");
              setSelectedAnswers({});
            }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeSubTab === "notes"
                ? isCSTheme
                  ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-600/10"
                  : "bg-[#0d9488] text-white shadow-md shadow-teal-600/10"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 bg-transparent"
            }`}
          >
            Study Notes
          </button>

          {/* Secondary Tab (Projects or Syllabus) */}
          <button
            onClick={() => {
              setActiveSubTab("secondary");
              setSelectedAnswers({});
            }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeSubTab === "secondary"
                ? isCSTheme
                  ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-600/10"
                  : "bg-[#0d9488] text-white shadow-md shadow-teal-600/10"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 bg-transparent"
            }`}
          >
            {currentSubject.secondaryTabName}
          </button>

          {/* Question Papers Tab */}
          <button
            onClick={() => {
              setActiveSubTab("papers");
              setSelectedAnswers({});
            }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeSubTab === "papers"
                ? isCSTheme
                  ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-600/10"
                  : "bg-[#0d9488] text-white shadow-md shadow-teal-600/10"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 bg-transparent"
            }`}
          >
            Question Papers
          </button>
        </div>
      </div>

      {/* 3. MATERIAL LIST CARDS matching Image 2 visual lists */}
      <div className="max-w-3xl mx-auto space-y-4">
        {currentList.map((item) => {
          // Check if custom override has unlocked this item
          const isItemLocked = customLockedState[item.id] !== undefined 
            ? customLockedState[item.id] 
            : item.isLocked;

          return (
            <div 
              key={item.id} 
              className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative overflow-hidden group ${hoverBorderThemeClass}`}
            >
              <div className="flex items-start gap-4">
                {/* Visual Classy PDF File Icon on left (image 2 has styled purple/blue pdf rectangle) */}
                <div className={`p-3 rounded-xl shrink-0 ${
                  isItemLocked
                    ? "bg-slate-100 dark:bg-slate-800/60 text-slate-400"
                    : isCSTheme
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                      : "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400"
                }`}>
                  <FileText className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-sans font-extrabold text-sm text-slate-850 dark:text-white leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.title}
                    </h4>

                    {/* Status Badge (UNLOCKED / LOCKED) matching screenshot */}
                    {isItemLocked ? (
                      <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 text-[9px] font-bold uppercase rounded tracking-wider border border-rose-100/40 dark:border-rose-900/10">
                        LOCKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase rounded tracking-wider border border-emerald-100/40 dark:border-emerald-900/10">
                        UNLOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-md">
                    {item.contentSummary}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider select-none">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons matching screenshot */}
              <div className="flex items-center gap-2.5 shrink-0 select-none">
                {isItemLocked ? (
                  // Locked Action Button (Orange solid unlock style)
                  <button
                    onClick={() => handleUnlock(item.id, item.title)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold transition-all duration-300 shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center uppercase tracking-wider"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Unlock
                  </button>
                ) : (
                  // Unlocked Action Buttons: Read PDF (outline) + Download (solid theme)
                  <>
                    <button
                      onClick={() => setReadingItem(item)}
                      className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 w-full sm:w-auto justify-center bg-transparent ${
                        isCSTheme 
                          ? "border-indigo-200 hover:border-indigo-600 text-indigo-600 dark:border-indigo-850 dark:hover:border-indigo-400 dark:text-indigo-400"
                          : "border-teal-200 hover:border-teal-600 text-teal-600 dark:border-teal-850 dark:hover:border-teal-400 dark:text-teal-400"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Read PDF
                    </button>

                    <button
                      onClick={() => triggerDownloadSimulation(item.title)}
                      className={`px-3.5 py-2 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center ${
                        isCSTheme
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-teal-600 hover:bg-teal-700"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. INTERACTIVE DOCUMENT READER MODAL DRAWER */}
      {readingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn">
            
            {/* Modal Header bar */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${isCSTheme ? "bg-indigo-600" : "bg-teal-600"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-sm text-slate-900 dark:text-white">
                    {readingItem.title} - CBSE Study Reference
                  </h3>
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">
                    {readingItem.category} • Revision Sheet
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setReadingItem(null);
                  setSelectedAnswers({});
                }}
                className="p-1.5 bg-slate-200/50 hover:bg-rose-500 hover:text-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs transition-all uppercase font-bold px-3 select-none"
              >
                Close [X]
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 select-text">
              
              {/* Revision Summaries */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  📖 Core Curriculum cheat-sheet guidelines
                </span>
                <div className="space-y-2.5">
                  {readingItem.cheatSheet.map((sheet, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{sheet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Sandbox Sample Snippet (if available) */}
              {readingItem.codeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      💻 Interactive Source Snippet
                    </span>
                    <button
                      onClick={() => handleCopyCode(readingItem.codeSnippet!)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded text-[10px] text-slate-500 dark:text-slate-300 font-bold transition-all flex items-center gap-1"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Snippet
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 overflow-x-auto font-mono text-[11px] text-slate-300">
                    <pre className="font-mono">{readingItem.codeSnippet}</pre>
                  </div>
                </div>
              )}

              {/* Quick Knowledge Quiz */}
              {readingItem.quizQuestions && readingItem.quizQuestions.length > 0 && (
                <div className="bg-amber-50/45 dark:bg-amber-950/15 border border-amber-100/60 dark:border-amber-900/35 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    Quick Exam Diagnostic Check
                  </div>

                  <div className="space-y-4">
                    {readingItem.quizQuestions.map((quiz, idx) => {
                      const showAns = !!selectedAnswers[idx];
                      return (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            Q{idx + 1}: {quiz.split("? (Answer:")[0]}?
                          </p>
                          {showAns ? (
                            <p className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/10 font-bold">
                              ✓ Solution: {quiz.split("? (Answer:")[1].replace(")", "")}
                            </p>
                          ) : (
                            <button
                              onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: true }))}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-[10px] font-extrabold uppercase transition-all"
                            >
                              Show Board Solution
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Cheatsheet
              </button>

              <button
                onClick={() => {
                  setReadingItem(null);
                  setSelectedAnswers({});
                  triggerDownloadSimulation(readingItem.title);
                }}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  isCSTheme ? "bg-indigo-600 hover:bg-indigo-700" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Download Offline PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
