import type { BasicTextOperation } from "@/applicationSpecific/plainTextWithBasicOperations";

import {
  transformListAgainstList,
  BasicTextOperationType,
} from "@/applicationSpecific/plainTextWithBasicOperations";

describe("plainTextWithBasicOperations", () => {
  it("transformListAgainstList", () => {
    const testcases: {
      input: [BasicTextOperation[], BasicTextOperation[]];
    }[] = [
      {
        input: [
          [{ type: BasicTextOperationType.Insert, content: "2", position: 0 }], // server
          [{ type: BasicTextOperationType.Insert, content: "1", position: 0 }], // client
        ],
      },
      {
        input: [
          [{ type: BasicTextOperationType.Insert, content: "2", position: 0 }], // server
          [
            { type: BasicTextOperationType.Insert, content: "1", position: 0 },
            { type: BasicTextOperationType.Insert, content: "a", position: 1 },
          ], // client
        ],
      },
    ];

    expect(transformListAgainstList(...testcases[0].input)).toMatchInlineSnapshot(`
      [
        [
          {
            "content": "2",
            "position": 0,
            "type": "INSERT",
          },
        ],
        [
          {
            "content": "1",
            "position": 1,
            "type": "INSERT",
          },
        ],
      ]
    `);
    expect(transformListAgainstList(...testcases[1].input)).toMatchInlineSnapshot(`
      [
        [
          {
            "content": "2",
            "position": 0,
            "type": "INSERT",
          },
        ],
        [
          {
            "content": "1",
            "position": 1,
            "type": "INSERT",
          },
          {
            "content": "a",
            "position": 2,
            "type": "INSERT",
          },
        ],
      ]
    `);
  });
});
