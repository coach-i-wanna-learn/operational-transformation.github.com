import { CodeMirrorAdapter } from '@/applicationSpecific/codemirror-adapter'

describe('CodeMirrorAdapter', () => {
  it('operationFromCodeMirrorChanges', () => {
    const testcases = [
      {
        input: {
          changes: [
            {
              from: { line: 0, ch: 13, sticky: null },
              to: { line: 0, ch: 13, sticky: null },
              text: ['1'],
              removed: [''],
              origin: '+input',
            } as any,
          ],
          doc: {
            indexFromPos: () => 0,
            getLine: () => 'Lorem ipsum1234',
            lastLine: () => 0,
          } as any,
        },
      },
      {
        input: {
          changes: [
            {
              from: { line: 0, ch: 13, sticky: null },
              to: { line: 0, ch: 13, sticky: null },
              text: ['11'],
              removed: [''],
              origin: '+input',
            } as any,
          ],
          doc: {
            indexFromPos: () => 0,
            getLine: () => 'Lorem ipsum1234',
            lastLine: () => 0,
          } as any,
        },
      },
      {
        input: {
          changes: [
            {
              from: { line: 0, ch: 1, sticky: null },
              to: { line: 0, ch: 1, sticky: null },
              text: ['1'],
              removed: [''],
              origin: '+input',
            } as any,
          ],
          doc: {
            indexFromPos: ({ line, ch }: { line: number; ch: number }) =>
              11 * line + line + ch,
            getLine: () => 'L1orem ipsum',
            lastLine: () => 0,
          } as any,
        },
      },
      {
        input: {
          changes: [
            {
              from: { line: 1, ch: 11, sticky: null },
              to: { line: 1, ch: 11, sticky: null },
              text: ['1'],
              removed: [''],
              origin: '+input',
            } as any,
          ],
          // 这里假定除了最后一行每一行都是 Lorem ipsum
          doc: {
            indexFromPos: ({ line, ch }: { line: number; ch: number }) =>
              11 * line + line + ch,
            getLine: () => 'Lorem ipsum1',
            lastLine: () => 1,
          } as any,
        },
      },
    ]
    testcases.forEach(({ input }) => {
      const [operation, inverse] =
        CodeMirrorAdapter.operationFromCodeMirrorChanges(
          input.changes,
          input.doc,
        )

      expect([operation.toString(), inverse.toString()]).toMatchSnapshot()
    })
  })
})
