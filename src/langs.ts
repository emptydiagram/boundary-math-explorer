type StringExpressionTwoBdVoid = {
    exprType: "void";
}

type StringExpressionTwoBdRound = {
    exprType: "round";
    contents: StringExpressionTwoBd;
}

type StringExpressionTwoBdSquare = {
    exprType: "square";
    contents: StringExpressionTwoBd;
}

type StringExpressionTwoBdJuxtaposition = {
    exprType: "juxtaposition";
    collection: Set<StringExpressionTwoBd>;
}

export type StringExpressionTwoBd =
    | StringExpressionTwoBdVoid
    | StringExpressionTwoBdRound
    | StringExpressionTwoBdSquare
    | StringExpressionTwoBdJuxtaposition


export function voidTwoBd() : StringExpressionTwoBdVoid {
    return { exprType: "void" };
}
export function roundTwoBd(expr: StringExpressionTwoBd): StringExpressionTwoBdRound {
    return {
        exprType: "round",
        contents: expr
    };
}
export function squareTwoBd(expr: StringExpressionTwoBd): StringExpressionTwoBdSquare {
    return {
        exprType: "square",
        contents: expr
    };
}
export function juxtaposeTwoBd(exprs: Set<StringExpressionTwoBd>): StringExpressionTwoBdJuxtaposition {
    return {
        exprType: "juxtaposition",
        collection: exprs
    };
}
export function circleTwoBd() : StringExpressionTwoBd {
    return roundTwoBd(voidTwoBd());
}


class Stack<T> {
    array: T[];

    constructor() {
        this.array = [];
    }

    push(val: T) {
        this.array.push(val);
    }

    pop() : T {
        return this.array.pop();
    }

    // todo: use optional type in return?
    peek(): T {
        if (this.array.length > 0) {
            return this.array[this.array.length - 1];
        }
        return null;
    }

    isEmpty() {
        return this.array.length === 0;
    }
}

/*
 * def parseTwoBd(s) {
 *   let containers = new empty stack;
 *   let contents = new empty Stack<Set<StringExpressionTwoBd>>
 *   // actually we need to populate contents with an initial Set so that we can allow for root-level juxtaposition
 *   contents.push(new Set());
 *   for char c in s {
 *     if c = '(' or c = '[' {
 *       push c onto containers
 *       push new Set<StringExpressionTwoBd> onto contents
 *     } else if c = ')' or c = ']' {
 *       if (containers.peek() != the left analog of c):
 *         throw error("expected previous symbol to be the left matching symbol")
 *       let topContents = contents.pop()
 *       let result
 *       if topContents is empty {
 *         result = Round/Square(void)
 *       } else {
 *         result = Round/Square(juxtaposition of topContents)
 *       }
 *        let newTopContents = contents.peek()
 *        add result to newTopContents
 *     } else if c = 'o' {
 *        let topContents = contents.peek();
 *        add Round(void) to topContents
 *     }
 *   }
 *   let rootContents = contents.pop();
 *   if rootContents is empty:
 *     return void
 *   else if rootContents is singleton:
 *     return the sole element in rootContents (avoids unnecessary juxtaposition)
 *   else:
 *     return a juxtaposition of rootContents
 * }
 */
export function parseStringExprTwoBd(s: string) : StringExpressionTwoBd {
    let containers: Stack<string> = new Stack();
    let contents: Stack<Set<StringExpressionTwoBd>> = new Stack();
    contents.push(new Set());
    for (const char of s) {
        // console.log(char, "\ncontainers = ", containers, "\ncontents = ", contents);
        switch (char) {
            case ' ':
            case '\t':
                continue; // skip whitespace
            case '(':
            case '[':
                containers.push(char);
                contents.push(new Set());
                break;
            case 'o':
                let topContents = contents.peek();
                topContents.add(circleTwoBd())
                break;
            case ')':
            case ']':
                if (containers.isEmpty() || (char === ')' && containers.peek() !== '(')
                    || (char === ']' && containers.peek() !== '[')) {
                    throw new Error(`invalid string expression: '${s}'`)
                }
                containers.pop();
                let currContainer = char === ')' ? roundTwoBd : squareTwoBd;
                let currContents = contents.pop();
                let result: StringExpressionTwoBd;
                if (currContents.size === 0) {
                    result = currContainer(voidTwoBd());
                } else if (currContents.size === 1) {
                    for (let item of currContents) {
                        result = currContainer(item);
                    }
                } else {
                    result = currContainer(juxtaposeTwoBd(currContents));
                }
                let newTopContents = contents.peek();
                newTopContents.add(result);
                break;
            default:
                throw new Error(`Invalid character: ${char}`)

        }
    }
    let rootContents = contents.pop();
    if (rootContents.size === 0) {
        return { exprType: "void" } ;
    } else if (rootContents.size === 1) {
        for (let item of rootContents) {
            return item;
        }
    } else {
        return juxtaposeTwoBd(rootContents);
    }
}