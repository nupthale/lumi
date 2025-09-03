import { Command } from 'prosemirror-state';
import { EditorView } from "prosemirror-view";

export const runCommand = (view: EditorView, command: Command) => {
   return command(view.state, view.dispatch, view);
}