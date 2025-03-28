export const HELLO_DEVELOPER = `I am Mark = <web developer>;
In love with coding = true;
Constantly committing (!);`
export const CATEGORIES = [
    {
        name: "Basic Programs",
        items: ["Hello World", "Variables", "Loops", "Conditionals"]
    },
    {
        name: "Algorithms",
        items: ["Bubble Sort", "Quick Sort", "Binary Search", "Linear Search"]
    },
    {
        name: "Data Structures",
        items: ["Arrays", "Linked Lists", "Stack", "Queue"]
    }
];
export interface Contributor {
    name: string;
    contributions: string;
    country: string;
}

export interface Recruiter {
    company: string;
    openings: string;
    country: string;
}

export interface ProfileCardProps {
    image?: string;
    title: string;
    subtitle: string;
    country: string;
}
export const CONTRIBUTORS: Contributor[] = [
    { name: "John Smith", contributions: "150 contributions", country: "US" },
    { name: "Sarah Johnson", contributions: "120 contributions", country: "UK" },
    { name: "Michael Chen", contributions: "200 contributions", country: "CA" },
    { name: "Emma Wilson", contributions: "180 contributions", country: "AU" },
    { name: "David Brown", contributions: "160 contributions", country: "US" },
    { name: "Sophie Martin", contributions: "140 contributions", country: "Europe" },
    { name: "James Wilson", contributions: "190 contributions", country: "UK" },
    { name: "Lisa Anderson", contributions: "170 contributions", country: "CA" },
    { name: "Thomas Lee", contributions: "130 contributions", country: "AU" },
    { name: "Maria Garcia", contributions: "110 contributions", country: "Europe" },
];

export const RECRUITERS: Recruiter[] = [
    { company: "TechCorp US", openings: "25 open positions", country: "US" },
    { company: "Global Solutions UK", openings: "15 open positions", country: "UK" },
    { company: "Innovation Labs CA", openings: "20 open positions", country: "CA" },
    { company: "Digital Dynamics AU", openings: "18 open positions", country: "AU" },
    { company: "Future Systems US", openings: "30 open positions", country: "US" },
    { company: "European Tech Hub", openings: "22 open positions", country: "Europe" },
    { company: "British Innovations", openings: "16 open positions", country: "UK" },
    { company: "Canadian Tech Solutions", openings: "19 open positions", country: "CA" },
    { company: "Australian Digital", openings: "17 open positions", country: "AU" },
    { company: "EuroTech Solutions", openings: "21 open positions", country: "Europe" },
];


export const ARTICLES = [
    "Senior Developer at Google",
    "Frontend Dev at Meta",
    "Backend Engineer at Amazon"
];

export const LANGUAGES = [
    { id: "c", name: "Java", icon: "WandSparkles" },
    { id: "python", name: "Python", icon: "WandSparkles" },
    { id: "html", name: "HTML", icon: "WandSparkles" }
];
type SampleCode = {
    [key: string]: {
        [key: string]: {
            java: string;
            python: string;
            html: string;
        };
    };
}
export const SAMPLE_CODES: SampleCode = {
    "Basic Programs": {
        "Hello World": {
            java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
            python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`
        },
        "Variables": {
            java: `public class Variables {
    public static void main(String[] args) {
        int number = 42;
        String text = "Hello";
        boolean isTrue = true;
        double price = 19.99;
        
        System.out.println("Number: " + number);
        System.out.println("Text: " + text);
        System.out.println("Boolean: " + isTrue);
        System.out.println("Price: " + price);
    }
}`,
            python: `# Variable declarations
number = 42
text = "Hello"
is_true = True
price = 19.99

print(f"Number: {number}")
print(f"Text: {text}")
print(f"Boolean: {is_true}")
print(f"Price: {price}")`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Variables</title>
</head>
<body>
    <script>
        let number = 42;
        let text = "Hello";
        let isTrue = true;
        let price = 19.99;
        
        document.write(\`
            Number: \${number}<br>
            Text: \${text}<br>
            Boolean: \${isTrue}<br>
            Price: \${price}
        \`);
    </script>
</body>
</html>`
        },
        "Loops": {
            java: `public class Loops {
    public static void main(String[] args) {
        // For loop
        for(int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
        
        // While loop
        int j = 0;
        while(j < 5) {
            System.out.println("While: " + j);
            j++;
        }
    }
}`,
            python: `# For loop
for i in range(5):
    print(f"Count: {i}")

# While loop
j = 0
while j < 5:
    print(f"While: {j}")
    j += 1`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Loops</title>
</head>
<body>
    <script>
        // For loop
        for(let i = 0; i < 5; i++) {
            document.write(\`Count: \${i}<br>\`);
        }
        
        // While loop
        let j = 0;
        while(j < 5) {
            document.write(\`While: \${j}<br>\`);
            j++;
        }
    </script>
</body>
</html>`
        },
        "Conditionals": {
            java: `public class Conditionals {
    public static void main(String[] args) {
        int number = 42;
        
        if(number > 50) {
            System.out.println("Number is greater than 50");
        } else if(number == 42) {
            System.out.println("Number is 42");
        } else {
            System.out.println("Number is less than 42");
        }
    }
}`,
            python: `number = 42

if number > 50:
    print("Number is greater than 50")
elif number == 42:
    print("Number is 42")
else:
    print("Number is less than 42")`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Conditionals</title>
</head>
<body>
    <script>
        const number = 42;
        
        if(number > 50) {
            document.write("Number is greater than 50");
        } else if(number === 42) {
            document.write("Number is 42");
        } else {
            document.write("Number is less than 42");
        }
    </script>
</body>
</html>`
        }
    },
    "Algorithms": {
        "Bubble Sort": {
            java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for(int i = 0; i < n-1; i++) {
            for(int j = 0; j < n-i-1; j++) {
                if(arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
}`,
            python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Bubble Sort</title>
</head>
<body>
    <script>
        function bubbleSort(arr) {
            const n = arr.length;
            for(let i = 0; i < n-1; i++) {
                for(let j = 0; j < n-i-1; j++) {
                    if(arr[j] > arr[j+1]) {
                        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    }
                }
            }
            return arr;
        }
    </script>
</body>
</html>`
        },
        "Quick Sort": {
            java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
}`,
            python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Quick Sort</title>
</head>
<body>
    <script>
        function quickSort(arr) {
            if (arr.length <= 1) return arr;
            
            const pivot = arr[Math.floor(arr.length / 2)];
            const left = arr.filter(x => x < pivot);
            const middle = arr.filter(x => x === pivot);
            const right = arr.filter(x => x > pivot);
            
            return [...quickSort(left), ...middle, ...quickSort(right)];
        }
    </script>
</body>
</html>`
        },
        "Binary Search": {
            java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
}`,
            python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Binary Search</title>
</head>
<body>
    <script>
        function binarySearch(arr, target) {
            let left = 0;
            let right = arr.length - 1;
            
            while (left <= right) {
                const mid = Math.floor(left + (right - left) / 2);
                
                if (arr[mid] === target) return mid;
                if (arr[mid] < target) left = mid + 1;
                else right = mid - 1;
            }
            
            return -1;
        }
    </script>
</body>
</html>`
        },
        "Linear Search": {
            java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
            python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Linear Search</title>
</head>
<body>
    <script>
        function linearSearch(arr, target) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === target) {
                    return i;
                }
            }
            return -1;
        }
    </script>
</body>
</html>`
        }
    },
    "Data Structures": {
        "Linked Lists": {
            java: `public class LinkedList {
    class Node {
        int data;
        Node next;
        
        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }
    
    Node head;
    
    public void add(int data) {
        Node newNode = new Node(data);
        if(head == null) {
            head = newNode;
            return;
        }
        
        Node current = head;
        while(current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
}`,
            python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def add(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
            
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Linked List</title>
</head>
<body>
    <script>
        class Node {
            constructor(data) {
                this.data = data;
                this.next = null;
            }
        }
        
        class LinkedList {
            constructor() {
                this.head = null;
            }
            
            add(data) {
                const newNode = new Node(data);
                if(!this.head) {
                    this.head = newNode;
                    return;
                }
                
                let current = this.head;
                while(current.next) {
                    current = current.next;
                }
                current.next = newNode;
            }
        }
    </script>
</body>
</html>`
        },
        "Arrays": {
            java: `public class ArrayOperations {
    public static void arrayOperations() {
        // Declaration and initialization
        int[] numbers = new int[5];
        int[] initialized = {1, 2, 3, 4, 5};
        
        // Adding elements
        numbers[0] = 10;
        numbers[1] = 20;
        
        // Accessing elements
        System.out.println(numbers[0]); // 10
        
        // Array traversal
        for (int num : initialized) {
            System.out.println(num);
        }
    }
}`,
            python: `# Array operations in Python (using lists)
numbers = []  # Empty array
initialized = [1, 2, 3, 4, 5]  # Initialized array

# Adding elements
numbers.append(10)
numbers.append(20)

# Accessing elements
print(numbers[0])  # 10

# Array traversal
for num in initialized:
    print(num)`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Array Operations</title>
</head>
<body>
    <script>
        // Array operations
        const numbers = [];  // Empty array
        const initialized = [1, 2, 3, 4, 5];  // Initialized array
        
        // Adding elements
        numbers.push(10);
        numbers.push(20);
        
        // Accessing elements
        console.log(numbers[0]);  // 10
        
        // Array traversal
        initialized.forEach(num => {
            console.log(num);
        });
    </script>
</body>
</html>`
        },
        "Stack": {
            java: `public class Stack {
    private int maxSize;
    private int[] stackArray;
    private int top;
    
    public Stack(int size) {
        maxSize = size;
        stackArray = new int[maxSize];
        top = -1;
    }
    
    public void push(int value) {
        if (top < maxSize - 1) {
            stackArray[++top] = value;
        }
    }
    
    public int pop() {
        if (top >= 0) {
            return stackArray[top--];
        }
        throw new RuntimeException("Stack is empty");
    }
    
    public int peek() {
        if (top >= 0) {
            return stackArray[top];
        }
        throw new RuntimeException("Stack is empty");
    }
}`,
            python: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise Exception("Stack is empty")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        raise Exception("Stack is empty")
    
    def is_empty(self):
        return len(self.items) == 0`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Stack Implementation</title>
</head>
<body>
    <script>
        class Stack {
            constructor() {
                this.items = [];
            }
            
            push(element) {
                this.items.push(element);
            }
            
            pop() {
                if (!this.isEmpty()) {
                    return this.items.pop();
                }
                throw new Error("Stack is empty");
            }
            
            peek() {
                if (!this.isEmpty()) {
                    return this.items[this.items.length - 1];
                }
                throw new Error("Stack is empty");
            }
            
            isEmpty() {
                return this.items.length === 0;
            }
        }
    </script>
</body>
</html>`
        },
        "Queue": {
            java: `public class Queue {
    private int maxSize;
    private int[] queueArray;
    private int front;
    private int rear;
    private int currentSize;
    
    public Queue(int size) {
        maxSize = size;
        queueArray = new int[maxSize];
        front = 0;
        rear = -1;
        currentSize = 0;
    }
    
    public void enqueue(int value) {
        if (currentSize < maxSize) {
            if (rear == maxSize - 1) {
                rear = -1;
            }
            queueArray[++rear] = value;
            currentSize++;
        }
    }
    
    public int dequeue() {
        if (currentSize > 0) {
            int temp = queueArray[front++];
            if (front == maxSize) {
                front = 0;
            }
            currentSize--;
            return temp;
        }
        throw new RuntimeException("Queue is empty");
    }
}`,
            python: `class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)
        raise Exception("Queue is empty")
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        raise Exception("Queue is empty")
    
    def is_empty(self):
        return len(self.items) == 0`,
            html: `<!DOCTYPE html>
<html>
<head>
    <title>Queue Implementation</title>
</head>
<body>
    <script>
        class Queue {
            constructor() {
                this.items = [];
            }
            
            enqueue(element) {
                this.items.push(element);
            }
            
            dequeue() {
                if (!this.isEmpty()) {
                    return this.items.shift();
                }
                throw new Error("Queue is empty");
            }
            
            front() {
                if (!this.isEmpty()) {
                    return this.items[0];
                }
                throw new Error("Queue is empty");
            }
            
            isEmpty() {
                return this.items.length === 0;
            }
        }
    </script>
</body>
</html>`
        }
    }
}; 