export default {
    Url: {
        base:                   'https://leetcode.com/',
        login:                  'https://leetcode.com/accounts/login/',
        logout:                 'https://leetcode.com/accounts/logout/',
        graphql:                'https://leetcode.com/graphql/',
        runCode:                titleSlug => `https://leetcode.com/problems/${titleSlug}/interpret_solution/`,
        runCodeRefer:           titleSlug => `https://leetcode.com/problems/${titleSlug}`,
        runCodeResult:          interpretId => `https://leetcode.com/submissions/detail/${interpretId}/check/`,
        runCodeExpectedResult:  expectedInterpretId => `https://leetcode.com/submissions/detail/${expectedInterpretId}/check/`,
        submitCode:             titleSlug => `https://leetcode.com/problems/${titleSlug}/submit/`,
        submitCodeResult:       submissionId => `https://leetcode.com/submissions/detail/${submissionId}/check/`
    },
};

export const FontScheme = {
    
};

export const ColorScheme = {
    separateLineGray: 'rgb(198, 204, 212)',
    lightGrayBackground: 'rgb(245, 245, 245)',
    lightGray: 'rgb(201, 201, 206)',
    textGray: 'rgb(154, 163, 171)',
    textDarkGray: 'rgb(77, 81, 85)',
    textDarkerGray: 'rgb(38, 50, 56)',
    white: 'white',
    buttonBlue: 'rgb(47, 124, 246)',
    easyGreen: 'rgb(116,181, 102)',
    mediumYellow: 'rgb(231, 175, 95)',
    hardRed: 'rgb(202, 92, 84)',
};
