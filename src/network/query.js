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
            '           difficulty',
            '           likes',
            '           dislikes',
            '           categoryTitle',
            '           stats',
            '           similarQuestions',
            '           topicTags {',
            '               name',
            '           }',
            '       }',
            '   }',
        ].join('\n'),
    };
};

export const CodeDefinition = titleSlug => {
    return {
        operationName: 'codeDefinition',
        variables: { titleSlug },
        query: [
            '   query codeDefinition($titleSlug: String) {',
            '       question(titleSlug: $titleSlug) {',
            '           codeSnippets {',
            '               langSlug',
            '               lang',
            '               code',
            '           }',
            '       }',
            '   }',
        ].join('\n'),
    };
};

export const UserProfile = {
    query: [
        '{',
        '   user {',
        '       isCurrentUserPremium',
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
        '           ranking {',
        '               rating',
        '               ranking',
        '               currentGlobalRanking',
        '               currentRating',
        '               ratingProgress',
        '           }',
        '       }',
        '   }',
        '}',
    ].join('\n'),
    variables: {},
};

export const Submissions = (offset, key) => {
    return {
        operationName: 'submissions',
        variables: { offset, key },
        query: [
            '   query submissions($offset: Int, $key: String) {',
            '       submissionList(offset: $offset, limit: 20, lastKey: $key, questionSlug: "") {',
            '           hasNext',
            '           lastKey',
            '           submissions {',
            '               title',
            '               time',
            '               statusDisplay',
            '               lang',
            '               timestamp',
            '           }',
            '       }',
            '   }',
        ].join('\n'),
    };
};
