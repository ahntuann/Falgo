const defaultCodes = {
    'C#': `using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

    Go: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,

    Java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

    Python: `print("Hello, World!")`,

    JavaScript: `console.log("Hello, World!");`,

    TypeScript: `console.log("Hello, World!");`,

    'C++': `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`,

    PHP: `<?php
echo "Hello, World!";
?>`,

    Swift: `import Swift
print("Hello, World!")`,

    Kotlin: `fun main() {
    println("Hello, World!")
}`,
};

export default defaultCodes;
