export default {
    Url: {
        base:                   'https://leetcode.com/',
        login:                  'https://leetcode.com/accounts/login/',
        logout:                 'https://leetcode.com/accounts/logout/',
        graphql:                'https://leetcode.com/graphql/',
        runCode:                titleSlug => `https://leetcode.com/problems/${titleSlug}/interpret_solution/`,
        runCodeRefer:           titleSlug => `https://leetcode.com/problems/${titleSlug}`,
        runCodeResult:          interpretId => `https://leetcode.com/submissions/detail/${interpretId}/check/`,
        runCodeExpectedResult:  expectedInterpretId => `https://leetcode.com/submissions/detail/${expectedInterpretId}/check/`
    }
};