
#import "RNUserAgentHandler.h"
#import <React/RCTLog.h>

@implementation RNUserAgentHandler

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(UserAgentHandler)

-(void)setUserAgentString:(NSString *)agent {
    NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:agent, @"UserAgent", nil];
    [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];
}

RCT_EXPORT_METHOD(setUserAgentForGoogleOnly) {
    [self setUserAgentString: @"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"];
}

RCT_EXPORT_METHOD(setDefaultUserAgent:(NSString*)defaultAgent) {
    [self setUserAgentString: defaultAgent];
}

@end
  
