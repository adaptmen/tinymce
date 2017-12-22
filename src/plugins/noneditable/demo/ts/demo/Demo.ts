/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import NonEditablePlugin from 'tinymce/plugins/noneditable/Plugin';

/*eslint no-console:0 */

declare let tinymce: any;

NonEditablePlugin();

var button = document.querySelector('button.clicky');
button.addEventListener('click', function () {
  tinymce.activeEditor.insertContent(content);
});
var content = '<span class="mceNonEditable">[NONEDITABLE]</span>';
var button2 = document.querySelector('button.boldy');
button2.addEventListener('click', function () {
  tinymce.activeEditor.execCommand('bold');
});


tinymce.init({
  selector: "div.tinymce",
  theme: "modern",
  inline: true,
  skin_url: "../../../../../js/tinymce/skins/lightgray",
  plugins: "noneditable code",
  toolbar: "code",
  height: 600
});

tinymce.init({
  selector: "textarea.tinymce",
  theme: "modern",
  skin_url: "../../../../../js/tinymce/skins/lightgray",
  plugins: "noneditable code",
  toolbar: "code",
  height: 600
});
