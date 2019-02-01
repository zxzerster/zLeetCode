//
//  MarkdownViewManager.swift
//  ZLC
//
//  Created by 周向真 on 2019/2/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import Down

@objc(MarkdownViewManager)
class MarkdownViewManager: RCTViewManager {
  
  override func view() -> UIView! {
    return MarkdownView();
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
