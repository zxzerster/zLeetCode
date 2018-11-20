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

export const Problems = {
    query: [
        '{',
        '   allQuestions {',
        '       title',
        '       titleSlug',
        '       questionId',
        '       difficulty',
        '       status',
        '       likes',
        '       dislikes',
        '   }',
        '}',
    ].join('\n'),
    variables: {},
};

export const ProblemDetails = titleSlug => {
    return {
        operationName: 'problemDetails',
        variables: { titleSlug },
        query: [
            '   query problemDetails($titleSlug: String) {',
            '       question(titleSlug: $titleSlug) {',
            '           titleSlug',
            '           title',
            '           content',
            '           questionId',
            '           judgeType',
            '       }',
            '   }',
        ].join('\n'),
    };
};

export const UserProfile = {
    query: [
        '{',
        '   user {',
        '       profile {',
        '           userSlug',
        '           realName',
        '           birthday',
        '           aboutMe',
        '           reputation',
        '           occupation',
        '           country',
        '           school',
        '           company',
        '           lastModified',
        '           countryName',
        '           userAvatar',
        '           location',
        '           gender',
        '           privacyContact',
        '           websites',
        '           rewardStats',
        '           skillTags',
        '           age',
        '           education',
        '           yearsOfExperience',
        '           globalRanking',
        '           contestCount',
        '           acStats {',
        '               acQuestionCount',
        '               acSubmissionCount',
        '               totalSubmissionCount',
        '               acRate',
        '           }',
        '       }',
        '   }',
        '}',
    ].join('\n'),
    variables: {},
};
