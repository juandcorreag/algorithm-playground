export const caseActivities = {
  'linear-search': {
    prediction: 'Which case do you predict will use the most element comparisons?',
    predictionChoices: ['BEST', 'AVERAGE', 'WORST', 'All are equal'],
    observation: 'Compare the target position with the number of comparisons.',
    conjecture: 'Do the three cases have the same asymptotic classification?',
    derivation: [
      { caseId: 'best', expression: 'C_best(n) = 1', theta: 'Θ(1)' },
      { caseId: 'average', expression: 'E[C(n)] = (1/n) Σᵢ₌₁ⁿ i = (n+1)/2', theta: 'Θ(n)' },
      { caseId: 'worst', expression: 'C_worst(n) = n', theta: 'Θ(n)' }
    ],
    explain: 'Explain why the best case of Linear Search is Θ(1), while its average and worst cases are Θ(n).'
  },
  'find-max': {
    prediction: 'Will changing the position of the maximum change the number of element comparisons?',
    predictionChoices: ['Yes', 'No', 'Only on random inputs', 'I am not sure'],
    observation: 'Comparisons stay fixed; assignments change when a new record maximum appears.',
    conjecture: 'Do the three cases have the same asymptotic classification?',
    derivation: [
      { caseId: 'best', expression: 'C_best(n) = n − 1', theta: 'Θ(n)' },
      { caseId: 'average', expression: 'C_average(n) = n − 1', theta: 'Θ(n)' },
      { caseId: 'worst', expression: 'C_worst(n) = n − 1', theta: 'Θ(n)' }
    ],
    explain: 'Explain why Find Maximum is Θ(n) in its best, average, and worst cases even though assignments can change.'
  }
};
