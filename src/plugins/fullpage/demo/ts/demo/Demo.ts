/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import FullPagePlugin from 'tinymce/plugins/fullpage/Plugin';

/*eslint no-console:0 */

declare let tinymce: any;

FullPagePlugin();

tinymce.init({
  selector: "textarea.tinymce",
  theme: "modern",
  skin_url: "../../../../../js/tinymce/skins/lightgray",
  plugins: "fullpage code",
  toolbar: "fullpage code",
  height: 600
});