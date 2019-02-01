//
//  MarkdownView.swift
//  ZLC
//
//  Created by 周向真 on 2019/2/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import Down

class MarkdownView: UIView {
  
  var downView: DownView!

  @objc var markdown: NSString = "" {
    didSet {
      do {
        try downView.update(markdownString: markdown as String)
      } catch {
        // nothing we can do for now.
      }
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    
    downView = try! DownView(frame: .zero, markdownString: "")
    downView.translatesAutoresizingMaskIntoConstraints = false
    addSubview(downView)
    
    addConstraints([
      NSLayoutConstraint(item: downView, attribute: .width, relatedBy: .equal, toItem: self, attribute: .width, multiplier: 1, constant: 0),
      NSLayoutConstraint(item: downView, attribute: .height, relatedBy: .equal, toItem: self, attribute: .height, multiplier: 1, constant: 0),
      NSLayoutConstraint(item: downView, attribute: .centerX, relatedBy: .equal, toItem: self, attribute: .centerX, multiplier: 1, constant: 0),
      NSLayoutConstraint(item: downView, attribute: .centerY, relatedBy: .equal, toItem: self, attribute: .centerY, multiplier: 1, constant: 0)
    ])
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
}
