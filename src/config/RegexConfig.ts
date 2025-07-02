// This regular expression enforces the following password rules:
// - At least one lowercase letter: (?=.*[a-z])
// - At least one uppercase letter: (?=.*[A-Z])
// - At least one digit: (?=.*\d)
// - At least one special character from @$!%*?&: (?=.*[@$!%*?&])
// - Only allows letters, digits, and the specified special characters: [A-Za-z\d@$!%*?&]
// - Minimum length of 8 characters: {8,}
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
