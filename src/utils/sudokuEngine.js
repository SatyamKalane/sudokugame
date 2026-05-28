// Validates if num can be placed at board[row][col]
export function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i][col] === num && i !== row) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + i % 3;
    if (board[boxRow][boxCol] === num && (boxRow !== row || boxCol !== col)) return false;
  }
  return true;
}

// Backtracking solver to fill board
function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (let num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generates an interactive solution and initial puzzle board
export function generateSudoku(difficulty) {
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));
  solve(solution);
  
  // Clone array
  const initial = solution.map(row => [...row]);
  
  // Map difficulty level to cells removed
  const difficulties = { easy: 30, medium: 42, hard: 52, expert: 58, evil: 64 };
  const attempts = difficulties[difficulty] || 40;
  
  let count = attempts;
  while (count > 0) {
    const cell = Math.floor(Math.random() * 81);
    const r = Math.floor(cell / 9);
    const c = cell % 9;
    if (initial[r][c] !== 0) {
      initial[r][c] = 0;
      count--;
    }
  }
  
  return { solution, initial };
}
