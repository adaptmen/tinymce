import { Assertions, Log, Pipeline, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader, TinyUi } from '@ephox/mcagar';
import { SugarElement, SugarNode } from '@ephox/sugar';
import Editor from 'tinymce/core/api/Editor';
import { EditorEvent } from 'tinymce/core/api/util/EventDispatcher';
import { TableEventData } from 'tinymce/plugins/table/api/Events';
import Plugin from 'tinymce/plugins/table/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';
import * as TableTestUtils from '../../module/test/TableTestUtils';

UnitTest.asynctest('browser.tinymce.plugins.table.TableCellDialogTest', (success, failure) => {
  Plugin();
  SilverTheme();

  const generalSelectors = {
    width: 'label.tox-label:contains(Width) + input.tox-textfield',
    height: 'label.tox-label:contains(Height) + input.tox-textfield',
    celltype: 'label.tox-label:contains(Cell type) + div.tox-listboxfield > .tox-listbox',
    scope: 'label.tox-label:contains(Scope) + div.tox-listboxfield > .tox-listbox',
    halign: 'label.tox-label:contains(H Align) + div.tox-listboxfield > .tox-listbox',
    valign: 'label.tox-label:contains(V Align) + div.tox-listboxfield > .tox-listbox'
  };

  let events = [];
  const logEventTypes = (event: EditorEvent<{}>) => {
    events.push(event.type);
  };

  let tableModifiedEvents = [];
  const logTableModified = (event: EditorEvent<TableEventData>) => {
    tableModifiedEvents.push(event);
  };

  const sClearEvents = Step.sync(() => {
    events = [];
    tableModifiedEvents = [];
  });

  const defaultEvents = [ 'tablemodified' ];
  const sAssertEventsOrder = (expectedEvents: string[] = defaultEvents) => Step.sync(() => {
    Assertions.assertEq('Expected events should have been fired in order', expectedEvents, events);
  });

  const sAssertTableModifiedEvent = (expectedEvent: TableEventData) => Step.sync(() => {
    Assertions.assertEq('Should only be one table modified event', 1, tableModifiedEvents.length);

    const event = tableModifiedEvents[0];
    const tableElm = SugarElement.fromDom(event.table);
    Assertions.assertEq('Should contain reference to table', true, SugarNode.isTag('table')(tableElm));
    Assertions.assertEq('Should match expected structure', expectedEvent.structure, event.structure);
    Assertions.assertEq('Should match expected style', expectedEvent.style, event.style);
  });

  TinyLoader.setupLight((editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);
    const tinyUi = TinyUi(editor);

    const baseHtml = '<table>' +
      '<tbody>' +
      '<tr>' +
      '<td data-mce-selected="1">a</td>' +
      '<td>b</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>';

    // tinyApis.sAssertContent uses editor.getContent() which strips out data-mce-selected
    const noSelectBaseHtml = '<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>';

    const baseData = {
      width: '',
      height: '',
      celltype: 'td',
      halign: '',
      valign: '',
      scope: ''
    };

    const baseAdvData = {
      width: '',
      height: '',
      celltype: 'td',
      halign: '',
      valign: '',
      scope: '',
      backgroundcolor: '',
      bordercolor: '',
      borderstyle: '',
      border: ''
    };

    const baseGetTest = () => Log.stepsAsStep('TBA', 'Table: Table cell properties dialog (get data from basic cell)', [
      sAssertEventsOrder([]),
      tinyApis.sSetSetting('table_cell_advtab', false),
      tinyApis.sSetContent(baseHtml),
      tinyApis.sSelect('td', [ 0 ]),
      TableTestUtils.sOpenTableDialog(tinyUi),
      TableTestUtils.sAssertDialogValues(baseData, false, generalSelectors),
      TableTestUtils.sClickDialogButton('close dialog', false),
      sAssertEventsOrder([])
    ]);

    const baseGetSetTest = () => Log.stepsAsStep('TBA', 'Table: Table cell properties dialog (get/set data from/to basic cell)', [
      sAssertEventsOrder([]),
      tinyApis.sSetSetting('table_cell_advtab', false),
      tinyApis.sSetContent(baseHtml),
      tinyApis.sSelect('td', [ 0 ]),
      TableTestUtils.sOpenTableDialog(tinyUi),
      TableTestUtils.sAssertDialogValues(baseData, false, generalSelectors),
      TableTestUtils.sSetDialogValues({
        width: '100',
        height: '101',
        celltype: 'td',
        scope: '',
        halign: '',
        valign: ''
      }, false, generalSelectors),
      TableTestUtils.sClickDialogButton('close dialog', true),
      tinyApis.sAssertContent('<table><tbody><tr><td style="width: 100px; height: 101px;">a</td><td>b</td></tr></tbody></table>'),
      sAssertEventsOrder(),
      sClearEvents
    ]);

    const advGetTest = () => {
      const complexHtml = '<table><tr><th style="text-align: right; vertical-align: top; width: 10px; height: 11px; ' +
      'border-width: 2px; border-color: red; background-color: blue; border-style: dashed;" scope="row">X</th></tr></table>';

      const complexData = {
        width: '10px',
        height: '11px',
        celltype: 'th',
        scope: 'row',
        halign: 'right',
        valign: 'top',
        borderstyle: 'dashed',
        bordercolor: 'red',
        backgroundcolor: 'blue',
        border: '2px'
      };

      return Log.stepsAsStep('TBA', 'Table: Table cell properties dialog (get data from advanced cell)', [
        tinyApis.sSetSetting('table_cell_advtab', true),
        tinyApis.sSetContent(complexHtml),
        tinyApis.sSelect('th', [ 0 ]),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(complexData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('close dialog', false),
        sAssertEventsOrder([])
      ]);
    };

    const advGetSetTest = () => {
      const advData = {
        width: '10',
        height: '11',
        scope: 'row',
        celltype: 'th',
        halign: 'right',
        valign: 'top',
        backgroundcolor: 'blue',
        bordercolor: 'red',
        borderstyle: 'dashed',
        border: ''
      };

      const advHtml = '<table><tbody><tr><th style="width: 10px; height: 11px; vertical-align: top; text-align: right; ' +
      'border-color: red; border-style: dashed; background-color: blue;" scope="row">X</th></tr></tbody></table>';

      return Log.stepsAsStep('TBA', 'Table: Table cell properties dialog (update all, including advanced)', [
        sAssertEventsOrder([]),
        tinyApis.sSetSetting('table_cell_advtab', true),
        tinyApis.sSetContent('<table><tr><td>X</td></tr></table>'),
        tinyApis.sSelect('td', [ 0 ]),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sSetDialogValues(advData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('submit dialog', true),
        tinyApis.sAssertContent(advHtml),
        sAssertEventsOrder([ 'newcell', 'tablemodified' ]),
        sAssertTableModifiedEvent({ structure: true, style: true }),
        sClearEvents
      ]);
    };

    const multiUpdate = () => {
      const initialHtml = '<table>' +
        '<tbody>' +
        '<tr>' +
        '<td data-mce-selected="1">a</td>' +
        '<td data-mce-selected="1">b</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      const newHtml = '<table>' +
          '<tbody>' +
            '<tr>' +
              '<td style="height: 20px; vertical-align: bottom; border-style: dashed; background-color: red;">a</td>' +
              '<td style="height: 20px; vertical-align: bottom; border-style: dashed; background-color: red;">b</td>' +
            '</tr>' +
          '</tbody>' +
        '</table>';

      const newData = {
        width: '',
        height: '20',
        celltype: 'td',
        scope: '',
        valign: 'bottom',
        halign: '',
        borderstyle: 'dashed',
        bordercolor: '',
        backgroundcolor: 'red',
        border: ''
      };

      return Log.stepsAsStep('TBA', 'Table: Table cell properties dialog update multiple cells', [
        sAssertEventsOrder([]),
        tinyApis.sSetContent(initialHtml),
        tinyApis.sSelect('td:nth-child(2)', [ 0 ]),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(baseAdvData, true, generalSelectors),
        TableTestUtils.sSetDialogValues(newData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('submit', true),
        tinyApis.sAssertContent(newHtml),
        sAssertEventsOrder(),
        sClearEvents
      ]);
    };

    const removeAllTest = () => {
      const advHtml = '<table><tbody><tr><th style="width: 10px; height: 11px; vertical-align: top; text-align: right; ' +
      'border-color: red; border-style: dashed; background-color: blue;" scope="row">X</th></tr></tbody></table>';

      const advData = {
        width: '10px',
        height: '11px',
        celltype: 'th',
        scope: 'row',
        halign: 'right',
        valign: 'top',
        backgroundcolor: 'blue',
        bordercolor: 'red',
        borderstyle: 'dashed',
        border: ''
      };

      const emptyTable = '<table><tbody><tr><th>X</th></tr></tbody></table>';

      const emptyData = {
        width: '',
        height: '',
        scope: '',
        celltype: 'th', // is never empty
        halign: '',
        valign: '',
        backgroundcolor: '',
        bordercolor: '',
        borderstyle: '',
        border: ''
      };

      return Log.stepsAsStep('TBA', 'Table: Remove all styles', [
        sAssertEventsOrder([]),
        tinyApis.sSetContent(advHtml),
        tinyApis.sSelect('th', [ 0 ]),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(advData, true, generalSelectors),
        TableTestUtils.sSetDialogValues(emptyData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('submit dialog', true),
        tinyApis.sAssertContent(emptyTable),
        sAssertEventsOrder([ 'tablemodified' ]),
        sAssertTableModifiedEvent({ structure: false, style: true }),
        sClearEvents
      ]);
    };

    const execCommandTest = () => {
      const advHtml = '<table><tbody><tr><th style="width: 10px; height: 11px; vertical-align: top; text-align: right; ' +
      'border-width: thick; border-color: red; border-style: dashed; background-color: blue;" scope="row">X</th></tr></tbody></table>';

      const advData = {
        width: '10px',
        height: '11px',
        celltype: 'th',
        scope: 'row',
        halign: 'right',
        valign: 'top',
        backgroundcolor: 'blue',
        bordercolor: 'red',
        borderstyle: 'dashed',
        border: 'thick'
      };

      return Log.stepsAsStep('TBA', 'Table: Open dialog via execCommand', [
        tinyApis.sSetContent(advHtml),
        tinyApis.sSelect('th', [ 0 ]),
        tinyApis.sExecCommand('mceTableCellProps'),
        TableTestUtils.sAssertDialogValues(advData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('submit dialog', false),
        sAssertEventsOrder([])
      ]);
    };

    const okCancelTest = () => {
      const advData = {
        width: '10px',
        height: '11px',
        scope: 'row',
        celltype: 'th',
        halign: 'right',
        valign: 'top',
        borderstyle: 'dashed',
        bordercolor: 'red',
        backgroundcolor: 'blue',
        border: ''
      };

      const advHtml = '<table><tbody><tr><th style="width: 10px; height: 11px; vertical-align: top; text-align: right; ' +
      'border-color: red; border-style: dashed; background-color: blue;" scope="row">a</th><td>b</td></tr></tbody></table>';

      return Log.stepsAsStep('TBA', 'Table: Test cancel changes nothing and save does', [
        sAssertEventsOrder([]),
        tinyApis.sSetSetting('table_cell_advtab', true),
        tinyApis.sSetContent(baseHtml),
        tinyApis.sSelect('td', [ 0 ]),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(baseAdvData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('click cancel', false),
        sAssertEventsOrder([]),
        sClearEvents,
        tinyApis.sAssertContent(noSelectBaseHtml),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(baseAdvData, true, generalSelectors),
        TableTestUtils.sSetDialogValues(advData, true, generalSelectors),
        TableTestUtils.sClickDialogButton('submit dialog', true),
        tinyApis.sAssertContent(advHtml),
        TableTestUtils.sOpenTableDialog(tinyUi),
        TableTestUtils.sAssertDialogValues(advData, true, generalSelectors),
        sAssertEventsOrder([ 'newcell', 'tablemodified' ]),
        sAssertTableModifiedEvent({ structure: true, style: true }),
        sClearEvents
      ]);
    };

    Pipeline.async({}, [
      tinyApis.sFocus(),
      baseGetTest(),
      baseGetSetTest(),
      advGetTest(),
      advGetSetTest(),
      multiUpdate(),
      removeAllTest(),
      execCommandTest(),
      okCancelTest()
    ], onSuccess, onFailure);
  }, {
    plugins: 'table',
    theme: 'silver',
    base_url: '/project/tinymce/js/tinymce',
    toolbar: 'tablecellprops',
    indent: false,
    valid_styles: {
      '*': 'width,height,vertical-align,text-align,float,border-color,border-style,background-color,border,padding,border-spacing,border-collapse,border-width'
    },
    setup: (editor: Editor) => {
      editor.on('tablemodified', (event) => {
        logEventTypes(event);
        logTableModified(event);
      });
      editor.on('newcell', logEventTypes);
    }
  }, success, failure);
});
