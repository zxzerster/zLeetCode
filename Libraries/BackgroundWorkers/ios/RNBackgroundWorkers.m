
#import "RNBackgroundWorkers.h"

#import <Foundation/Foundation.h>

#import <React/RCTLog.h>
#import <React/RCTAssert.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

#define FILTER_BY_KEYWORD 0x100
#define FILTER_BY_DIFFICULTY 0x101
#define FILTER_BY_TAG 0x102

@implementation RNBackgroundWorkers

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(BackgroundWorkers)

- (void)filterByKeyword:(NSString *)keyword withData:(NSArray *)data completionHandler:(void(^)(NSArray *))handler{
    NSMutableArray* result = [NSMutableArray new];
    
    // Let's do it in background thread
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [data enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL* stop) {
            if ([obj[@"title"] containsString: keyword]) {
                [result addObject:obj];
            }
        }];

        handler([result copy]);
    });
}

- (void)filterByDifficulty:(NSString *)difficulty widthData:(NSArray *)data completionHandler:(void(^)(NSArray *))handler {
    NSMutableArray* result = [NSMutableArray new];

    // Let's do it in background thread
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [data enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL* stop) {
            NSString* qd = obj[@"difficulty"];
            if ([qd isEqual:difficulty]) {
                [result addObject:obj];
            }
        }];

        handler([result copy]);
    });
}

- (void)filterByTag:(NSArray *)tagIds withData:(NSArray *)data completionHandler:(void(^)(NSArray *))handler {
    NSMutableArray* result = [NSMutableArray new];

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [data enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL* stop) {
            NSString* questionId = obj[@"questionId"];
            for (id tagId in tagIds) {
                NSString* aId = [tagId stringValue];
                if ([aId isEqualToString:questionId]) {
                    [result addObject:obj];
                }
            }
        }];

        handler([result copy]);
    });
}

RCT_EXPORT_METHOD(doInNativeWithAction:(NSUInteger)action info:(NSDictionary *)info withResolver:(RCTPromiseResolveBlock)resolveToJS rejecter:(RCTPromiseRejectBlock)rejectToJS) {
    NSString* key = info[@"keyword"];
    NSString* difficulty = info[@"difficulty"];
    NSArray* tagIds = info[@"tags"];
    NSArray* data = info[@"data"];
    switch(action) {
        case FILTER_BY_KEYWORD: {
            [self filterByKeyword:key withData:data completionHandler:^(NSArray* result) {
                resolveToJS(result);
            }];
            break;
        }
        case FILTER_BY_DIFFICULTY: {
            [self filterByDifficulty:difficulty widthData:data completionHandler:^(NSArray* result) {
                resolveToJS(result);
            }];
            break;
        }
        case FILTER_BY_TAG: {
            [self filterByTag:tagIds withData:data completionHandler:^(NSArray* result) {
                resolveToJS(result);
            }];
            break;
        }
        default:
            return;
    }
}

@end
