/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Stub of MarkdownViewer for Android.
 *
 * @format
 * @flow strict-local
 */

'use strict';

const NativeMarkdownViewer = require('NativeModules').MarkdownViewer;

/**
 * High-level docs for the MarkdownViewer iOS API can be written here.
 */

const MarkdownViewer = {
  test: function() {
    NativeMarkdownViewer.test();
  },
};

module.exports = MarkdownViewer;
