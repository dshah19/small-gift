/**
 * Puzzle Data
 * 
 * Contains all puzzle definitions for the game.
 * Includes F1, football, Office, and personal memory puzzles.
 */

export const puzzleData = [
    {
        id: 'f1-1',
        type: 'trivia',
        theme: 'f1',
        question: 'How many F1 World Championships has Lewis Hamilton won?',
        options: ['6', '7', '8', '5'],
        correctAnswerIndex: 1,
        explanation: 'Lewis Hamilton has won 7 F1 World Championships (as of 2024)',
        difficulty: 'medium'
    },
    {
        id: 'f1-2',
        type: 'trivia',
        theme: 'f1',
        question: 'Which team does Lewis Hamilton currently drive for?',
        options: ['Red Bull', 'Ferrari', 'Mercedes', 'McLaren'],
        correctAnswerIndex: 2,
        explanation: 'Lewis Hamilton drives for Mercedes F1 Team',
        difficulty: 'easy'
    },
    {
        id: 'football-1',
        type: 'trivia',
        theme: 'football',
        question: 'How many Ballon d\'Or awards has Lionel Messi won?',
        options: ['7', '8', '6', '9'],
        correctAnswerIndex: 1,
        explanation: 'Lionel Messi has won 8 Ballon d\'Or awards',
        difficulty: 'medium'
    },
    {
        id: 'football-2',
        type: 'trivia',
        theme: 'football',
        question: 'In which year did Messi win the FIFA World Cup?',
        options: ['2020', '2022', '2021', '2023'],
        correctAnswerIndex: 1,
        explanation: 'Messi won the FIFA World Cup in 2022 with Argentina',
        difficulty: 'medium'
    },
    {
        id: 'office-1',
        type: 'trivia',
        theme: 'office',
        question: 'What is Michael Scott\'s famous catchphrase?',
        options: ['That\'s what she said', 'Dunder Mifflin', 'Bears, Beets, Battlestar Galactica', 'The Office'],
        correctAnswerIndex: 0,
        explanation: 'Michael Scott is famous for saying "That\'s what she said"',
        difficulty: 'easy'
    },
    {
        id: 'office-2',
        type: 'trivia',
        theme: 'office',
        question: 'What is the name of the paper company in The Office?',
        options: ['Sabre', 'Dunder Mifflin', 'Wernham Hogg', 'Staples'],
        correctAnswerIndex: 1,
        explanation: 'The paper company is called Dunder Mifflin',
        difficulty: 'easy'
    },
    {
        id: 'personal-1',
        type: 'trivia',
        theme: 'personal',
        personalMemory: 'combined',
        question: 'Which of these is NOT one of our special memories together?',
        options: ['Bike trips', 'Spending 5-6 hours together at our office', 'Being whiskey buddies', 'Skydiving in Dubai'],
        correctAnswerIndex: 3,
        explanation: 'All of these are special memories we share! We\'ve had amazing bike trips, spent countless hours together at the office, and we\'re definitely whiskey buddies. We\'re also each other\'s work wife and work husband!',
        difficulty: 'medium'
    },
    {
        id: 'personal-2',
        type: 'trivia',
        theme: 'personal',
        personalMemory: 'bike-trips',
        question: 'What\'s one of our favorite weekend activities?',
        options: ['Chili parties', 'Watching paint dry', 'Competitive knitting', 'Collecting bottle caps'],
        correctAnswerIndex: 0,
        explanation: 'Our bike trips are some of my favorite memories with you. The freedom, the fresh air, and the conversations we have on those rides mean everything to me.',
        difficulty: 'easy'
    },
    {
        id: 'personal-3',
        type: 'trivia',
        theme: 'personal',
        personalMemory: 'office-time',
        question: 'How much time do we typically spend together at our office?',
        options: ['1-2 hours', '3-4 hours', '5-6 hours', 'We don\'t work together'],
        correctAnswerIndex: 2,
        explanation: 'Those 5-6 hours we spend together at the office are precious to me. From coffee breaks to lunch, to just working side by side, every moment counts.',
        difficulty: 'easy'
    },
    {
        id: 'personal-4',
        type: 'trivia',
        theme: 'personal',
        personalMemory: 'whiskey-buddies',
        question: 'What\'s our special inside joke about?',
        options: ['Okay buddy, mate, how are you?', 'Our secret recipe', 'The great pizza debate', 'Our matching socks'],
        correctAnswerIndex: 0,
        explanation: 'Being whiskey buddies is our thing! Those moments sharing a drink and good conversation are some of the best times we\'ve had together.',
        difficulty: 'easy'
    },
    {
        id: 'personal-5',
        type: 'trivia',
        theme: 'personal',
        personalMemory: 'work-wife-husband',
        question: 'What are we to each other at work?',
        options: ['Just colleagues', 'Work wife and work husband', 'Competitors', 'Strangers'],
        correctAnswerIndex: 1,
        explanation: 'You\'re my work wife/husband, and I\'m yours. That bond we share at work, the support, the inside jokes, the way we have each other\'s backs - it\'s irreplaceable.',
        difficulty: 'easy'
    }
];
