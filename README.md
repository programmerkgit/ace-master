## TO-LEARN
- [ ] Learn editor.textInput
- [x] keyboard/keybindings.callKeyboardHandlers
- [?] keyboard/keybindings.handlers.handleKeyboard
- [x] editor.commands
- [x] commandManager
- [x] editor.defaultCommands

## TODO
- [x] Ace
- [ ] Aceの実行環境の作成 
- [ ] Read Text Input
- [ ] TextLayer
- [ ] Focus, and selection api: ace_layer ace_marker-layer => controls selection
- [ ] Undomanager
- [ ] VirtualRenderer
- [ ] Layer
- [ ] https://developer.mozilla.org/en-US/docs/Web/API/Document#Events
- [ ] focus, selection control api.  
## Think
1. 良い整理はコーディング

## DOMの習熟が必要

## 
npm run start
http://192.168.2.101:8888/index.html#nav=about
doc/site/js/main.js
##
1. http-server
2. doc/site/main.jsをいじる
3. node Makefile.dryice.jsで更新
4. lib/ace配下を更新してbuild可能


## Relations

// ace calls Prompt. Prompt calls AcePopUp
// default commands calls editor.prompot
// who calls default_commands?
// commands manager import defualt commands
// who calls commands manager ?

ace/keyboard/textinput
event(required from Editor) => TextInput.onInput => Editor.onTextInput 
=> Ediitor/ext/prompt, require(default_commands) => AcePopUp 

## Eventの元
require("lib/keyboard/textInput") などを利用してイベントを読み込み

```

        var onInput = function (e) {
            if (inComposition)
                return onCompositionUpdate();
            if (e && e.inputType) {
                if (e.inputType == "historyUndo") return host.execCommand("undo");
                if (e.inputType == "historyRedo") return host.execCommand("redo");
            }
            var data = text.value;
            // var inserted = sendText(data, true);
            if (
                data.length > MAX_LINE_LENGTH + 100
                || valueResetRegex.test(inserted)
                || isMobile && lastSelectionStart < 1 && lastSelectionStart == lastSelectionEnd
            ) {
                resetSelection();
            }
        };
```
