export type Question = {
  question: string;
  options: string[];
  answer: number;
};

export const QUESTIONS: Question[] = [
  {
    question: 'Apa output dari kode berikut?\n\nprint(type(5))',
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
    answer: 0,
  },
  {
    question: "Simbol apa yang digunakan untuk menulis komentar satu baris di Python?",
    options: ["//", "#", "/* */", "--"],
    answer: 1,
  },
  {
    question: 'Bagaimana cara mendeklarasikan sebuah list kosong di Python?',
    options: ["list = ()", "list = {}", "list = []", "list = <>"],
    answer: 2,
  },
  {
    question: 'Apa output dari:\n\nprint(3 + 2 * 2)',
    options: ["10", "7", "12", "9"],
    answer: 1,
  },
  {
    question: "Keyword apa yang digunakan untuk membuat fungsi di Python?",
    options: ["function", "def", "func", "define"],
    answer: 1,
  },
  {
    question: 'Apa hasil dari:\n\nlen("Python")',
    options: ["5", "6", "7", "Error"],
    answer: 1,
  },
  {
    question: "Struktur data apa yang bersifat immutable (tidak bisa diubah) di Python?",
    options: ["List", "Dictionary", "Set", "Tuple"],
    answer: 3,
  },
  {
    question: 'Operator apa yang digunakan untuk pembagian bilangan bulat (floor division)?',
    options: ["/", "//", "%", "**"],
    answer: 1,
  },
  {
    question: "Bagaimana cara yang benar untuk mengimpor modul math di Python?",
    options: ["#include math", "import math", "using math", "require('math')"],
    answer: 1,
  },
  {
    question: 'Apa output dari:\n\nfor i in range(3):\n    print(i)',
    options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"],
    answer: 1,
  },
];
