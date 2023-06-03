transform 的核心在于如何处理 server 返回的 operation 的数据，处理 server operation 意味着需要处理 client 的 operation 

核心代码如下[plainTextWithBasicOperations](../src/applicationSpecific/plainTextWithBasicOperations.tsx)

transformListAgainstList(a, bs) 收到 a 之后，对 bs (client operation) 做 transform。
transformSingleAgainstList 首先对 bs 的第一个 op 做 transform，然后对 tail 递归做 transformListAgainstList 处理

```js
function transformSingleAgainstList(
  a: BasicTextOperation,
  bs: BasicTextOperation[],
): [BasicTextOperation[], BasicTextOperation[]] {
  if (bs.length === 0) {
    return [[a], bs];
  }
  const [headB, ...tailBs] = bs;
  const [aPrimes, headBPrimes] = transformBasicTextOperation(a, headB);
  const [aPrimesPrimes, tailBPrimes] = transformListAgainstList(aPrimes, tailBs);
  return [aPrimesPrimes, [...headBPrimes, ...tailBPrimes]];
}

export function transformListAgainstList(
  as: BasicTextOperation[], // server
  bs: BasicTextOperation[], // client
): [BasicTextOperation[], BasicTextOperation[]] {
  let currBs = bs;
  const asPrime = as.flatMap((a) => {
    const [aPrimes, bsPrime] = transformSingleAgainstList(a, currBs);
    currBs = bsPrime;
    return aPrimes;
  });
  return [asPrime, currBs];
}
```