class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

class Student extends Person {
  constructor(name, age, major) {
    super(name, age); // Calls the constructor of the Person class
    this.major = major;
  }
  
  study() {
    console.log(`${this.name} is studying ${this.major}.`);
  }
}

class Professor extends Person {
  constructor(name, age, department) {
    super(name, age); // Calls the constructor of the Person class
    this.department = department;
  }
  
  teach() {
    console.log(`Professor ${this.name} is teaching in the ${this.department} department.`);
  }
}

const student1 = new Student('Alice', 20, 'Computer Science');
const professor1 = new Professor('Dr. Bob', 50, 'Mathematics');

student1.greet(); // Output: Hello, my name is Alice.
student1.study(); // Output: Alice is studying Computer Science.

professor1.greet(); // Output: Hello, my name is Dr. Bob.
professor1.teach(); // Output: Professor Dr. Bob is teaching in the Mathematics department.
