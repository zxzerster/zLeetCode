
#import "RNBackgroundWorkers.h"

#import <Foundation/Foundation.h>

#import <React/RCTLog.h>
#import <React/RCTAssert.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

#define FILTER_BY_KEYWORD 0x100

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

RCT_EXPORT_METHOD(doInNativeWithAction:(NSUInteger)action info:(NSDictionary *)info withResolver:(RCTPromiseResolveBlock)resolveToJS rejecter:(RCTPromiseRejectBlock)rejectToJS) {
    NSString* key = info[@"keyword"];
    NSDictionary* data = info[@"data"];
    // switch(action) {
    //     case FILTER_BY_KEYWORD: {
    //         RCTLogInfo(@"==========   callback 1");
    //         [filterByKeyword:key withData:data completionHandler:nil];
    //         break;
    //     }
    //     default:
    //         RCTLogInfo(@"==========   callback 2");
    //         return;
    // }
    if (action == 0x100) {
        [self filterByKeyword:key withData:data completionHandler:^(NSArray* result) {
            resolveToJS(result);
        }];
    }
}

@end
  
