# Nonogram Solver

## Compile:

```
npm run compile
```

## Run tests:


(compile first)


```
npm test
```

## Run tests in watch mode

```
while true; do inotifywait -e modify src/*; clear; npm run compile && npm test; done
```

## Solve a sample puzzle:

```
cat samples/puzzle2.json | node src/index.js
```


