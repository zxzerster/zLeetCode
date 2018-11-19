export const UserStatus = {
    query: [
        '{',
        '   userStatus {',
        '       isSignedIn',
        '       username',
        '       realName',
        '   }',
        '}',
    ].join('\n'),
    variables: {},
};
