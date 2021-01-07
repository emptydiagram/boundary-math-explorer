import { parseStringExprTwoBd, voidTwoBd, circleTwoBd, juxtaposeTwoBd, roundTwoBd, squareTwoBd } from './langs';

let one = circleTwoBd();
let two = juxtaposeTwoBd(new Set([circleTwoBd(), circleTwoBd()]));
let three = juxtaposeTwoBd(new Set([circleTwoBd(), circleTwoBd(), circleTwoBd()]));
let base = roundTwoBd(one);
let squareVoid = squareTwoBd(voidTwoBd());

test('Parses void', () => {
    expect(parseStringExprTwoBd("")).toEqual(voidTwoBd());
    expect(parseStringExprTwoBd(" ")).toEqual(voidTwoBd());
    expect(parseStringExprTwoBd("  ")).toEqual(voidTwoBd());
    expect(parseStringExprTwoBd("   ")).toEqual(voidTwoBd());
});

test('Parses unit', () => {
    expect(parseStringExprTwoBd("()")).toEqual(one);
    expect(parseStringExprTwoBd(" ()")).toEqual(one);
    expect(parseStringExprTwoBd("() ")).toEqual(one);
    expect(parseStringExprTwoBd("( )")).toEqual(one);
    expect(parseStringExprTwoBd(" (   )  ")).toEqual(one);
    expect(parseStringExprTwoBd("o")).toEqual(one);
});

test('Parses two units', () => {
    expect(parseStringExprTwoBd("()()")).toEqual(two);
    expect(parseStringExprTwoBd(" () ()")).toEqual(two);
    expect(parseStringExprTwoBd("( ) ( )")).toEqual(two);
    expect(parseStringExprTwoBd("oo")).toEqual(two);
});

test('Parses three units', () => {
    expect(parseStringExprTwoBd("()()()")).toEqual(three);
    expect(parseStringExprTwoBd(" () () ()")).toEqual(three);
    expect(parseStringExprTwoBd("( ) ( ) ( )")).toEqual(three);
    expect(parseStringExprTwoBd("o   o o    ")).toEqual(three);
});

test('Parses base', () => {
    expect(parseStringExprTwoBd("(o)")).toEqual(base);
    expect(parseStringExprTwoBd("(())")).toEqual(base);
    expect(parseStringExprTwoBd(" ( () ) ")).toEqual(base);
    expect(parseStringExprTwoBd("(( ))")).toEqual(base);
});

test('Parses square', () => {
    expect(parseStringExprTwoBd("[]")).toEqual(squareVoid);
    expect(parseStringExprTwoBd(" [  ]")).toEqual(squareVoid);
    expect(parseStringExprTwoBd("[      ]")).toEqual(squareVoid);
});

test('Parses inversion pairs', () => {
    expect(parseStringExprTwoBd("([])")).toEqual(roundTwoBd(squareVoid));
    expect(parseStringExprTwoBd("( [  ])")).toEqual(roundTwoBd(squareVoid));
    expect(parseStringExprTwoBd("[() ]  ")).toEqual(squareTwoBd(one));
    expect(parseStringExprTwoBd(" [   o]")).toEqual(squareTwoBd(one));
});